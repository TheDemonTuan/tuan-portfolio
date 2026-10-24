#!/usr/bin/env bash
# .deploy/smoke-image.sh validates an exact-pinned container image under
# platform security constraints (unprivileged UID 101, read-only root, no
# capabilities, loopback health supervisor).
set -Eeuo pipefail

IMAGE="${1:-}"
if [[ -z "$IMAGE" ]]; then
  printf 'usage: %s <image-with-exact-digest>\n' "$0" >&2
  exit 2
fi

if [[ ! "$IMAGE" =~ ^ghcr\.io/thedemontuan/tuan-portfolio@sha256:[0-9a-f]{64}$ ]]; then
  printf 'error: expected the registered repository and a complete sha256 digest\n' >&2
  exit 2
fi

DEPLOY_SLOT="${DEPLOY_SLOT:-blue}"
case "$DEPLOY_SLOT" in
  blue|green) ;;
  *)
    printf 'error: DEPLOY_SLOT must be blue or green, got %s\n' "$DEPLOY_SLOT" >&2
    exit 2
    ;;
esac

CONTAINER="tuan-portfolio-smoke-$$"
cleanup() {
  set +e
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

# Run under identical hardening to vps-deploy: read-only root filesystem,
# unprivileged UID, dropped capabilities, private tmpfs.
docker run -d \
  --name "$CONTAINER" \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=16m,mode=1777 \
  --tmpfs /var/cache/nginx:rw,noexec,nosuid,size=16m,uid=101,gid=101 \
  --security-opt no-new-privileges:true \
  --cap-drop=ALL \
  --user 101:101 \
  -e "DEPLOY_SLOT=$DEPLOY_SLOT" \
  "$IMAGE" >/dev/null

IP=""
for _ in $(seq 1 60); do
  IP="$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$CONTAINER" 2>/dev/null || true)"
  if [[ -n "$IP" ]]; then
    break
  fi
  sleep 0.1
done

if [[ -z "$IP" ]]; then
  printf 'error: failed to retrieve IP address for container %s\n' "$CONTAINER" >&2
  docker logs "$CONTAINER" || true
  exit 1
fi

HEALTH_JSON=""
for _ in $(seq 1 60); do
  if ! docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null | grep -qx 'true'; then
    printf 'error: container exited prematurely\n' >&2
    docker logs "$CONTAINER" || true
    exit 1
  fi
  if HEALTH_JSON="$(curl --fail --silent --show-error --max-time 2 "http://$IP:8080/healthz" 2>/dev/null)"; then
    break
  fi
  sleep 0.2
done

if [[ -z "$HEALTH_JSON" ]]; then
  printf 'error: health endpoint did not respond successfully\n' >&2
  docker logs "$CONTAINER" || true
  exit 1
fi

export HEALTH_JSON DEPLOY_SLOT
python3 -c '
import json, os, re, sys

data = json.loads(os.environ["HEALTH_JSON"])
slot = os.environ["DEPLOY_SLOT"]

assert data.get("ok") is True, f"ok is not true: {data}"
assert data.get("deployment_slot") == slot, f"slot mismatch: {data}"

instance = data.get("instance_id")
assert isinstance(instance, str) and re.fullmatch(r"^[A-Za-z0-9_.-]+-[1-9][0-9]*$", instance), (
    f"invalid instance_id format: {instance}"
)

assert data.get("active_requests_known") is True, f"active_requests_known not true: {data}"
active = data.get("active_requests")
assert isinstance(active, int) and not isinstance(active, bool), f"active_requests not int: {active}"
assert active >= 0, f"active_requests negative: {active}"
'

# A partially received request must prevent an idle report until it disconnects.
python3 - "$IP" <<'PY'
import json, socket, sys, time, urllib.request
host = sys.argv[1]
def activity():
    with urllib.request.urlopen(f'http://{host}:8080/healthz', timeout=2) as response:
        data = json.load(response)
    assert data['active_requests_known'] is True, data
    return data['active_requests']
with socket.create_connection((host, 8080), timeout=2) as pending:
    pending.sendall(b'GET / HTTP/1.1\r\nHost: smoke\r\nX-Pending: ')
    assert activity() >= 1, 'in-flight connection was reported idle'
for _ in range(50):
    if activity() == 0:
        break
    time.sleep(0.1)
else:
    raise AssertionError('closed connection never drained')
PY

# Direct status access must be denied to outside clients.
STATUS_CODE="$(curl -s -o /dev/null -w '%{http_code}' "http://$IP:8080/internal/nginx-status" || true)"
if [[ "$STATUS_CODE" != "403" ]]; then
  printf 'error: expected /internal/nginx-status to return 403, got %s\n' "$STATUS_CODE" >&2
  exit 1
fi

# The primary static page must render with strict security headers.
HEADERS="$(curl --fail --silent --show-error --head "http://$IP:8080/")"
printf '%s\n' "$HEADERS" | grep -qi '^HTTP/[0-9.]* 200'
printf '%s\n' "$HEADERS" | grep -qi '^X-Content-Type-Options:[[:space:]]*nosniff'
printf '%s\n' "$HEADERS" | grep -qi '^X-Frame-Options:[[:space:]]*DENY'

# Method constraints: health endpoint accepts only GET.
METHOD_CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://$IP:8080/healthz" || true)"
if [[ "$METHOD_CODE" != "405" ]]; then
  printf 'error: expected POST /healthz to return 405, got %s\n' "$METHOD_CODE" >&2
  exit 1
fi

# Clean exit: SIGTERM must shut down both helper and nginx without hanging.
docker kill --signal=SIGTERM "$CONTAINER" >/dev/null
for _ in $(seq 1 50); do
  if ! docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null | grep -qx 'true'; then
    break
  fi
  sleep 0.1
done

if docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null | grep -qx 'true'; then
  printf 'error: container did not exit cleanly on SIGTERM\n' >&2
  docker logs "$CONTAINER" || true
  exit 1
fi

EXIT_CODE="$(docker inspect -f '{{.State.ExitCode}}' "$CONTAINER" 2>/dev/null || echo 1)"
if [[ "$EXIT_CODE" != "0" ]]; then
  printf 'error: container exited with status %s on SIGTERM\n' "$EXIT_CODE" >&2
  docker logs "$CONTAINER" || true
  exit 1
fi

printf 'image smoke passed for %s (slot %s)\n' "$IMAGE" "$DEPLOY_SLOT"
