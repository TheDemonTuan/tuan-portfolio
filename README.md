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

The container serves static files on `127.0.0.1:18080`; it is intentionally inaccessible from
public interfaces. On the VPS it also joins the existing external `omniroute_edge` Docker network
so Caddy can reach it by the `tuan-portfolio` service name without exposing another public port.

## Continuous deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. Type-check and build the static site.
2. Build the ARM64 container on a native GitHub runner.
3. Publish `ghcr.io/thedemontuan/tuan-portfolio` to GitHub Container Registry.
4. Deploy the immutable image digest to `/opt/tuan-portfolio` over SSH.
5. Wait for container health, verify public portfolio routes, and recheck OmniRoute health.

The `production` GitHub environment holds `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`, and
`VPS_KNOWN_HOSTS`. The workflow uses the short-lived `GITHUB_TOKEN` for each image pull and logs
the VPS out of GitHub Container Registry afterward.

The production Compose file reads `PORTFOLIO_IMAGE` from `/opt/tuan-portfolio/.deploy.env`.
`scripts/deploy.sh` serializes deploys with `flock`, rejects mutable image references, records the
active digest, and rolls back to the previous healthy digest when a replacement fails.

A dedicated `cloudflared` sidecar in the portfolio Compose project serves the remotely managed
tunnel configuration. The portfolio container owns the network alias `caddy`, so the existing
`http://caddy:8080` ingress resolves locally to the portfolio rather than depending on OmniRoute's
Caddyfile or deployment lifecycle. The sidecar reuses the existing connector token from
`/opt/tuan-portfolio/.tunnel.env`; routine deploys never transfer that token through GitHub
Actions.

## Rollback

1. Restore the previous Cloudflare Tunnel ingress and DNS snapshot.
2. Restore and validate the previous Caddyfile, then reload Caddy.
3. Run `docker compose down` inside `/opt/tuan-portfolio`.

This does not stop or modify OmniRoute application containers.
