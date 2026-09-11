# Shared edge stack

This directory defines the VPS-wide ingress: exactly one `cloudflared` connector and one Caddy gateway. Files under `config/routes/` are hostname routes loaded by that single Caddy process; they are not per-application proxy instances.

The complete rules for onboarding repositories are in [`../../EDGE_INGRESS_RULES.md`](../../EDGE_INGRESS_RULES.md).

## VPS layout

```text
/opt/edge/
├── compose.yml
├── config/
│   ├── Caddyfile
│   └── routes/
├── services.yml
└── secrets/tunnel-token
```

Install or rotate the connector token without printing it to terminal history:

```bash
install -d -m 0700 /opt/edge/secrets
umask 077
read -rsp 'Tunnel token: ' token; printf '%s' "$token" > /opt/edge/secrets/tunnel-token; unset token
```

The Cloudflare management API credential is never placed in this directory or mounted into either container.

## Validate and deploy

1. Copy `infra/edge` to a temporary release directory on the VPS.
2. Ensure `/opt/edge/secrets/tunnel-token` exists with mode `0600`.
3. Run `scripts/edge-preflight.sh` with `EDGE_DIR=/opt/edge`.
4. Run `scripts/edge-deploy.sh <release-directory>`.
5. Run `scripts/edge-smoke.sh`; set `PUBLIC_URL` when a public health check is required.

`edge-deploy.sh` takes a temporary rollback snapshot, validates the Caddy and Compose configuration, recreates only the shared Caddy when configuration changes, checks the connector registration and runs routing/security smoke tests. Application deployments never invoke this script and never restart the edge stack.

## Operations

```bash
docker compose --project-name edge -f /opt/edge/compose.yml ps
docker logs --tail 100 edge-cloudflared
docker logs --tail 100 edge-caddy
docker exec edge-caddy caddy validate --config /etc/caddy/Caddyfile
/opt/edge/bin/edge-smoke.sh
```

Do not run `docker compose down` casually: the gateway is shared by every migrated hostname. Deploy route changes through `edge-deploy.sh` so validation and rollback run first.
