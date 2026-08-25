#!/usr/bin/env bash
set -euo pipefail

script="scripts/deploy.sh"
bash -n "$script"
grep -q 'flock -n' "$script"
grep -q 'sha256:\[a-f0-9\]{64\}' "$script"
grep -q 'Deployment failed; rolling back' "$script"
grep -q 'curl --fail' "$script"

if grep -Eiq 'omniroute|cloudflared|\.tunnel\.env|caddy' \
  compose.yml scripts/deploy.sh .github/workflows/deploy.yml; then
  echo "deployment must not reference another app, proxy, or tunnel" >&2
  exit 1
fi

echo "deploy script checks passed"
