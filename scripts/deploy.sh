#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/tuan-portfolio"
COMPOSE="$APP_DIR/compose.yml"
DEPLOY_ENV="$APP_DIR/.deploy.env"
LOCK_FILE="$APP_DIR/.deploy.lock"
IMAGE_STATE="$APP_DIR/.deployed-image"
READY_TIMEOUT="${READY_TIMEOUT:-90}"

log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }
die() { log "ERROR: $*" >&2; exit 1; }
dc() { docker compose --env-file "$DEPLOY_ENV" -f "$COMPOSE" "$@"; }

health_status() {
  docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    tuan-portfolio 2>/dev/null || true
}

status() {
  printf 'image=%s\n' "$(cat "$IMAGE_STATE" 2>/dev/null || echo unknown)"
  printf 'health=%s\n' "$(health_status)"
  dc ps
}

case "${1:-}" in
  --status)
    status
    exit 0
    ;;
  "")
    die "usage: $0 ghcr.io/<owner>/tuan-portfolio@sha256:<digest> | --status"
    ;;
esac

IMAGE_REF="$1"
[[ "$IMAGE_REF" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]] || \
  die "image must be an immutable GHCR digest"

mkdir -p "$APP_DIR"
exec 9>"$LOCK_FILE"
flock -n 9 || die "another portfolio deployment is already running"

PREVIOUS_IMAGE="$(cat "$IMAGE_STATE" 2>/dev/null || true)"
rollback() {
  local exit_code=$?
  trap - ERR
  if [[ -n "$PREVIOUS_IMAGE" && "$PREVIOUS_IMAGE" != "$IMAGE_REF" ]]; then
    log "Deployment failed; rolling back to $PREVIOUS_IMAGE"
    printf 'PORTFOLIO_IMAGE=%s\n' "$PREVIOUS_IMAGE" > "$DEPLOY_ENV"
    dc up -d --no-deps portfolio || true
    dc up -d --no-deps tunnel || true
  fi
  exit "$exit_code"
}
trap rollback ERR

log "Pulling $IMAGE_REF"
docker pull "$IMAGE_REF"
printf 'PORTFOLIO_IMAGE=%s\n' "$IMAGE_REF" > "$DEPLOY_ENV"

dc up -d --no-deps --force-recreate portfolio
dc up -d --no-deps tunnel

for ((elapsed = 0; elapsed < READY_TIMEOUT; elapsed += 2)); do
  if [[ "$(health_status)" == "healthy" ]] && \
    curl --fail --silent --show-error --max-time 5 http://127.0.0.1:18080/healthz >/dev/null; then
    printf '%s\n' "$IMAGE_REF" > "$IMAGE_STATE"
    trap - ERR
    log "Deployment healthy: $IMAGE_REF"
    status
    exit 0
  fi
  sleep 2
done

docker logs --tail 100 tuan-portfolio >&2 || true
die "portfolio did not become healthy within ${READY_TIMEOUT}s"
