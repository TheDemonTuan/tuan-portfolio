#!/usr/bin/env bash
set -euo pipefail

script="scripts/deploy.sh"
bash -n "$script"
grep -q 'flock -n' "$script"
grep -q 'sha256:\[a-f0-9\]{64}' "$script"
grep -q 'Deployment failed; restoring previous configuration' "$script"
grep -q 'ingress_healthy' "$script"
grep -q 'edge-portfolio must be internal' "$script"
grep -q 'dc up -d --no-deps --force-recreate portfolio' "$script"
grep -q 'external: true' compose.yml
grep -q 'name: edge-portfolio' compose.yml
grep -q 'portfolio-web' compose.yml

if grep -Eiq '^([[:space:]]*)(tunnel:|ports:)|token-file|^[[:space:]]*image:.*cloudflared|^[[:space:]]*caddy:' \
  compose.yml scripts/deploy.sh .github/workflows/deploy.yml; then
  echo "portfolio deployment must not own a proxy, tunnel, token, or host port" >&2
  exit 1
fi

printf 'deploy script checks passed\n'
