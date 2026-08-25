# Nguyễn Viết Tuấn — Portfolio

Independent bilingual portfolio for [tuannguyenviet.site](https://tuannguyenviet.site), built
with Astro and one small React island for navigation and language state.

## Local development

Requires Node.js 22 or 24 and Docker for the production image.

```bash
npm install
npm run dev
npm run check
npm test
npm run build
```

The default URL is `http://localhost:4321`.

## Content

Public profile and project links are defined in `src/pages/index.astro`. The first release only
uses facts visible on [TheDemonTuan](https://github.com/TheDemonTuan). Add verified biography,
contact links, and projects there; keep Vietnamese and English copy aligned.

## Production container

```bash
docker compose build
docker compose up -d
curl --fail http://127.0.0.1:18080/healthz
```

The site container serves static files on `127.0.0.1:18080`; it is intentionally inaccessible
from public interfaces. A dedicated Cloudflare Tunnel connector reaches it through the private
Compose network. The Compose project, network, tunnel, deployment state, and ingress are kept
independent from every other application on the VPS.

## Continuous deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. Type-check and build the static site.
2. Build the ARM64 container on a native GitHub runner.
3. Publish `ghcr.io/thedemontuan/tuan-portfolio` to GitHub Container Registry.
4. Deploy the immutable image digest to `/opt/tuan-portfolio` over SSH.
5. Wait for the portfolio container's loopback health check.
6. Keep the dedicated portfolio tunnel connector running on the same private Compose network.

The connector token is stored only as `/opt/tuan-portfolio/.tunnel-token` with mode `0600`; it is
never committed or copied by the deployment workflow. The `production` GitHub environment holds
`VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`, and
`VPS_KNOWN_HOSTS`. The workflow uses the short-lived `GITHUB_TOKEN` for each image pull and logs
the VPS out of GitHub Container Registry afterward.

The production Compose file reads `PORTFOLIO_IMAGE` from `/opt/tuan-portfolio/.deploy.env`.
`scripts/deploy.sh` serializes deploys with `flock`, rejects mutable image references, records the
active digest, and rolls back to the previous healthy digest when a replacement fails.

Public routing must use a portfolio-owned ingress with separate credentials and lifecycle. Never
attach this Compose project to another application's Docker network, proxy, or tunnel connector.

## Rollback

Deployments roll back automatically when the replacement container fails its local health check.
For a manual rollback, redeploy an earlier immutable digest with `scripts/deploy.sh`. Removing the
portfolio uses its own Compose project only:

```bash
cd /opt/tuan-portfolio
docker compose --env-file .deploy.env down
```
