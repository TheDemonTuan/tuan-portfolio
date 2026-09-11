#!/usr/bin/env bash
set -Eeuo pipefail

ORIGIN_URL="${ORIGIN_URL:-http://172.31.250.3:8080}"
EDGE_HOST="${EDGE_HOST:-tuannguyenviet.site}"
PUBLIC_URL="${PUBLIC_URL:-}"

network_request() {
  docker run --rm --network edge-cf-ingress --ip 172.31.250.4 \
    curlimages/curl:8.16.0 "$@"
}

tunnel_request() {
  docker run --rm --network container:edge-cloudflared \
    curlimages/curl:8.16.0 "$@"
}

[[ "$(tunnel_request -sS -o - -H "Host: $EDGE_HOST" "$ORIGIN_URL/healthz")" == ok ]]
[[ "$(tunnel_request -sS -o /dev/null -w '%{http_code}' -H "Host: $EDGE_HOST" "$ORIGIN_URL/")" == 200 ]]
[[ "$(tunnel_request -sS -o /dev/null -w '%{http_code}' -H 'Host: invalid.example' "$ORIGIN_URL/")" == 404 ]]
[[ "$(tunnel_request -sS -o /dev/null -w '%{http_code}' -X POST -H "Host: $EDGE_HOST" "$ORIGIN_URL/")" == 405 ]]
[[ "$(network_request -sS -o /dev/null -w '%{http_code}' -H "Host: $EDGE_HOST" "$ORIGIN_URL/")" == 403 ]]

if [[ -n "$PUBLIC_URL" ]]; then
  curl --fail --silent --show-error --max-time 15 "$PUBLIC_URL/healthz" | grep -qx ok
fi

printf 'shared edge smoke checks passed for %s\n' "$EDGE_HOST"
