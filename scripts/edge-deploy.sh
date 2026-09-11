#!/usr/bin/env bash
set -Eeuo pipefail

EDGE_DIR="${EDGE_DIR:-/opt/edge}"
STAGED_DIR="${1:-}"
LOCK_FILE="$EDGE_DIR/.deploy.lock"

log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }
die() { log "ERROR: $*" >&2; return 1; }
dc() { docker compose --project-name edge -f "$EDGE_DIR/compose.yml" "$@"; }

[[ -d "$STAGED_DIR" ]] || die "usage: $0 <staged-edge-directory>"
[[ -f "$EDGE_DIR/secrets/tunnel-token" ]] || die "missing runtime tunnel token"

exec 9>"$LOCK_FILE"
flock -n 9 || die "another edge deployment is already running"

BACKUP="$(mktemp -d "$EDGE_DIR/.rollback.XXXXXX")"
HAD_COMPOSE=false
HAD_CONFIG=false
if [[ -f "$EDGE_DIR/compose.yml" ]]; then
  cp "$EDGE_DIR/compose.yml" "$BACKUP/compose.yml"
  HAD_COMPOSE=true
fi
if [[ -d "$EDGE_DIR/config" ]]; then
  cp -a "$EDGE_DIR/config" "$BACKUP/config"
  HAD_CONFIG=true
fi

rollback() {
  local code=$?
  trap - ERR
  log "Edge deployment failed; restoring previous validated configuration"
  if [[ "$HAD_COMPOSE" == true ]]; then
    cp "$BACKUP/compose.yml" "$EDGE_DIR/compose.yml"
  else
    rm -f "$EDGE_DIR/compose.yml"
  fi
  rm -rf "$EDGE_DIR/config"
  if [[ "$HAD_CONFIG" == true ]]; then
    cp -a "$BACKUP/config" "$EDGE_DIR/config"
  fi
  if [[ "$HAD_COMPOSE" == true ]]; then
    dc up -d --no-deps --force-recreate caddy || true
    dc up -d cloudflared || true
  else
    docker rm -f edge-cloudflared edge-caddy >/dev/null 2>&1 || true
  fi
  rm -rf "$BACKUP"
  exit "$code"
}
trap rollback ERR

install -m 0644 "$STAGED_DIR/compose.yml" "$EDGE_DIR/compose.yml"
rm -rf "$EDGE_DIR/config.next"
cp -a "$STAGED_DIR/config" "$EDGE_DIR/config.next"
rm -rf "$EDGE_DIR/config"
mv "$EDGE_DIR/config.next" "$EDGE_DIR/config"

EDGE_DIR="$EDGE_DIR" "$(dirname "$0")/edge-preflight.sh"
dc pull
docker pull curlimages/curl:8.16.0 >/dev/null
dc up -d --no-deps --force-recreate caddy
dc up -d cloudflared

ready=false
for _ in {1..45}; do
  if [[ "$(docker inspect edge-caddy --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' 2>/dev/null)" == healthy ]] && \
    [[ "$(docker inspect edge-cloudflared --format '{{.State.Running}}' 2>/dev/null)" == true ]] && \
    docker logs edge-cloudflared 2>&1 | grep -q 'Registered tunnel connection'; then
    ready=true
    break
  fi
  sleep 2
done
[[ "$ready" == true ]] || die "edge containers did not become ready"
"$(dirname "$0")/edge-smoke.sh"

rm -rf "$BACKUP"
trap - ERR
log "Shared edge deployment is healthy"
