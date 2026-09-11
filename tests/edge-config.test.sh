#!/usr/bin/env bash
set -euo pipefail

compose="infra/edge/compose.yml"
route="infra/edge/config/routes/tuannguyenviet.site.conf"
rules="EDGE_INGRESS_RULES.md"

for file in "$compose" infra/edge/config/Caddyfile "$route" infra/edge/services.yml "$rules"; do
  [[ -s "$file" ]]
done

grep -q '^name: edge$' "$compose"
[[ "$(grep -c '^  cloudflared:' "$compose")" == 1 ]]
[[ "$(grep -c '^  caddy:' "$compose")" == 1 ]]
grep -q 'name: edge-portfolio' "$compose"
grep -q 'internal: true' "$compose"
! grep -qE '^[[:space:]]+ports:' "$compose"
grep -q 'trusted_proxies static 172.31.250.2/32' infra/edge/config/Caddyfile
grep -q 'client_ip_headers CF-Connecting-IP' infra/edge/config/Caddyfile
! grep -q 'private_ranges' infra/edge/config/Caddyfile
grep -q 'reverse_proxy portfolio-web:8080' "$route"
grep -q '@unknownHost not host tuannguyenviet.site' "$route"
! grep -q 'edge-canary' "$route" infra/edge/services.yml scripts/cloudflare-edge.py
grep -q 'Mỗi ứng dụng có một network ingress riêng' "$rules"
grep -q 'route_file: config/routes/tuannguyenviet.site.conf' infra/edge/services.yml

for script in scripts/edge-preflight.sh scripts/edge-deploy.sh scripts/edge-smoke.sh; do
  bash -n "$script"
done
python3 -m py_compile scripts/cloudflare-edge.py
rm -rf scripts/__pycache__

if grep -RIE '(cfut_|eyJhIjoi|api[_-]?token[=:][[:space:]]*[^$<])' \
  infra EDGE_INGRESS_RULES.md scripts compose.yml; then
  echo "possible secret found in source" >&2
  exit 1
fi

printf 'shared edge config checks passed\n'
