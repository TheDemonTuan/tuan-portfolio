#!/usr/bin/env bash
set -Eeuo pipefail

EDGE_DIR="${EDGE_DIR:-/opt/edge}"
COMPOSE="$EDGE_DIR/compose.yml"
NETWORK="edge-portfolio"
SUBNET="172.31.250.0/28"

log() { printf '%s  %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }
die() { log "ERROR: $*" >&2; exit 1; }

[[ -f "$COMPOSE" ]] || die "missing $COMPOSE"
[[ -f "$EDGE_DIR/config/Caddyfile" ]] || die "missing Caddyfile"
[[ -f "$EDGE_DIR/secrets/tunnel-token" ]] || die "missing tunnel token"
[[ "$(stat -c '%a' "$EDGE_DIR/secrets/tunnel-token")" == "600" ]] || \
  die "tunnel token must have mode 0600"

if docker network inspect "$NETWORK" >/dev/null 2>&1; then
  [[ "$(docker network inspect "$NETWORK" --format '{{.Internal}}')" == "true" ]] || \
    die "$NETWORK exists but is not internal"
else
  log "Creating internal application ingress network $NETWORK"
  docker network create --internal --subnet 172.31.251.0/28 --label io.tuan.edge.managed=true "$NETWORK" >/dev/null
fi

for route in $(docker network ls --format '{{.Name}}'); do
  [[ "$route" == "edge-cf-ingress" ]] && continue
  while IFS= read -r existing; do
    [[ -z "$existing" ]] && continue
    if python3 - "$SUBNET" "$existing" <<'PY'
import ipaddress
import sys
sys.exit(0 if ipaddress.ip_network(sys.argv[1]).overlaps(ipaddress.ip_network(sys.argv[2])) else 1)
PY
    then
      die "subnet $SUBNET overlaps $existing on $route"
    fi
  done < <(docker network inspect "$route" --format '{{range .IPAM.Config}}{{.Subnet}}{{"\n"}}{{end}}' 2>/dev/null)
done

docker compose --project-name edge -f "$COMPOSE" config --quiet

docker run --rm --network none \
  -v "$EDGE_DIR/config:/etc/caddy:ro,Z" \
  "${CADDY_IMAGE:-caddy@sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648}" \
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

log "Edge preflight passed"
