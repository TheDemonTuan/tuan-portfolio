#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/tuan-portfolio}"
COMPOSE="$APP_DIR/compose.yml"
DEPLOY_ENV="$APP_DIR/.deploy.env"
LOCK_FILE="$APP_DIR/.deploy.lock"
IMAGE_STATE="$APP_DIR/.deployed-image"
PREVIOUS_IMAGE_STATE="$APP_DIR/.previous-image"
READY_TIMEOUT="${READY_TIMEOUT:-90}"
EDGE_CONTAINER="${EDGE_CONTAINER:-edge-caddy}"
EDGE_INGRESS_URL="${EDGE_INGRESS_URL:-http://172.31.250.3:8080/healthz}"
EDGE_HOST="${EDGE_HOST:-tuannguyenviet.site}"

log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }
die() { log "ERROR: $*" >&2; exit 1; }
dc() { docker compose --env-file "$DEPLOY_ENV" -f "$COMPOSE" "$@"; }

# shellcheck source=scripts/image-retention.sh
source "$APP_DIR/image-retention.sh"

health_status() {
  docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    tuan-portfolio 2>/dev/null || true
}

ingress_healthy() {
  docker run --rm --network container:edge-cloudflared \
    curlimages/curl:8.16.0 --fail --silent --show-error --max-time 5 \
    --header "Host: $EDGE_HOST" "$EDGE_INGRESS_URL" 2>/dev/null | grep -qx 'ok'
}

status() {
  printf 'image=%s\n' "$(cat "$IMAGE_STATE" 2>/dev/null || echo unknown)"
  printf 'previous_image=%s\n' "$(cat "$PREVIOUS_IMAGE_STATE" 2>/dev/null || echo none)"
  printf 'health=%s\n' "$(health_status)"
  printf 'ingress=%s\n' "$(ingress_healthy && echo healthy || echo unhealthy)"
  dc ps
}

case "${1:-}" in
  --status)
    status
    exit 0
    ;;
  "")
    die "usage: $0 ghcr.io/<owner>/tuan-portfolio@sha256:<digest> [staged-compose] | --status"
    ;;
esac

IMAGE_REF="$1"
STAGED_COMPOSE="${2:-}"
[[ "$IMAGE_REF" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]] || \
  die "image must be an immutable GHCR digest"
[[ -z "$STAGED_COMPOSE" || -f "$STAGED_COMPOSE" ]] || die "staged compose does not exist"

docker network inspect edge-portfolio >/dev/null 2>&1 || die "edge-portfolio network is missing"
[[ "$(docker network inspect edge-portfolio --format '{{.Internal}}')" == "true" ]] || \
  die "edge-portfolio must be internal"
docker inspect "$EDGE_CONTAINER" >/dev/null 2>&1 || die "$EDGE_CONTAINER is not running"
docker image inspect curlimages/curl:8.16.0 >/dev/null 2>&1 || die "pinned ingress probe image is missing"

mkdir -p "$APP_DIR"
exec 9>"$LOCK_FILE"
flock -n 9 || die "another portfolio deployment is already running"

PREVIOUS_IMAGE="$(cat "$IMAGE_STATE" 2>/dev/null || true)"
BACKUP_COMPOSE="$(mktemp "$APP_DIR/.compose.rollback.XXXXXX")"
cp "$COMPOSE" "$BACKUP_COMPOSE"

rollback() {
  local exit_code=$?
  trap - ERR
  log "Deployment failed; restoring previous configuration"
  cp "$BACKUP_COMPOSE" "$COMPOSE"
  if [[ -n "$PREVIOUS_IMAGE" ]]; then
    printf 'PORTFOLIO_IMAGE=%s\n' "$PREVIOUS_IMAGE" > "$DEPLOY_ENV"
    dc up -d --no-deps --force-recreate portfolio || true
    if [[ "$(health_status)" != "healthy" ]] || ! ingress_healthy; then
      log "ERROR: rollback health verification failed"
    fi
  fi
  rm -f "$BACKUP_COMPOSE"
  exit "$exit_code"
}
trap rollback ERR

if [[ -n "$STAGED_COMPOSE" ]]; then
  PORTFOLIO_IMAGE="$IMAGE_REF" docker compose -f "$STAGED_COMPOSE" config --quiet
  install -m 0644 "$STAGED_COMPOSE" "$COMPOSE"
fi
PORTFOLIO_IMAGE="$IMAGE_REF" docker compose -f "$COMPOSE" config --quiet

log "Pulling $IMAGE_REF"
docker pull "$IMAGE_REF"
printf 'PORTFOLIO_IMAGE=%s\n' "$IMAGE_REF" > "$DEPLOY_ENV"
dc up -d --no-deps --force-recreate portfolio

for ((elapsed = 0; elapsed < READY_TIMEOUT; elapsed += 2)); do
  if [[ "$(health_status)" == "healthy" ]] && ingress_healthy; then
    if [[ -n "$PREVIOUS_IMAGE" && "$PREVIOUS_IMAGE" != "$IMAGE_REF" ]]; then
      printf '%s\n' "$PREVIOUS_IMAGE" > "$PREVIOUS_IMAGE_STATE"
    fi
    printf '%s\n' "$IMAGE_REF" > "$IMAGE_STATE"
    rm -f "$BACKUP_COMPOSE"
    trap - ERR
    log "Deployment healthy through shared ingress: $IMAGE_REF"
    prune_repository_images "${IMAGE_REF%@sha256:*}" \
      "$IMAGE_REF" "$(cat "$PREVIOUS_IMAGE_STATE" 2>/dev/null || echo "$IMAGE_REF")"
    exit 0
  fi
  sleep 2
done

die "portfolio did not become healthy through shared ingress within ${READY_TIMEOUT}s"
