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

## VPS deployment

The production directory is `/opt/tuan-portfolio`. Sync the repository without `.git`,
`node_modules`, test output, or credentials, then run:

```bash
cd /opt/tuan-portfolio
docker compose build
docker compose up -d
```

Caddy routes only `Host: tuannguyenviet.site` to `tuan-portfolio:8080`. Cloudflare Tunnel
then maps the public hostname to Caddy. Cloudflare credentials are deployment inputs and must
never be copied into this repository or image.

## Rollback

1. Restore the previous Cloudflare Tunnel ingress and DNS snapshot.
2. Restore and validate the previous Caddyfile, then reload Caddy.
3. Run `docker compose down` inside `/opt/tuan-portfolio`.

This does not stop or modify OmniRoute application containers.
