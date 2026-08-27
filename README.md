# Nguyễn Viết Tuấn — Portfolio

Bilingual portfolio for [tuannguyenviet.site](https://tuannguyenviet.site), built with Astro and
shipped as static files. There is no client framework and no script bundle: the home page sends
2.4 KB of inline JavaScript and nothing else.

## Local development

Requires Node.js 22 or 24, and Docker for the production image.

```bash
npm install
npm run dev
npm run check
npm test
npm run build
```

The default URL is `http://localhost:4321`. Playwright needs its browser once:
`npx playwright install chromium`.

## Content

All copy and data live in `src/data/`, never in markup:

| File               | Holds                                                       |
| ------------------ | ----------------------------------------------------------- |
| `contributions.ts` | The merged upstream pull requests and their write-ups       |
| `articles.ts`      | Long-form operations notes with source-backed evidence      |
| `personal-work.ts` | Fork and self-hosted work, labelled separately on purpose   |
| `site.ts`          | Identity and contact channels                               |
| `stack.ts`         | Tools, each linked to the contribution that demonstrates it |
| `copy.ts`          | Page prose                                                  |
| `ui.ts`            | Navigation and control labels                               |
| `i18n.ts`          | Locale helpers, `localizePath` / `alternatePath`            |

Totals such as `+1,503 / −300` are **computed** from `contributions.ts`, so the home page and the
index cannot disagree. Repository star and fork counts are stamped with `statsAsOf` and rendered
as a snapshot; they are deliberately not fetched at build time, which would make builds
non-reproducible and add a network dependency to the Docker build.

Two contact channels are ready but unset: `site.linkedin` and `site.cv` are `null`, and nothing is
rendered for them. Set `linkedin` to a URL, or drop a PDF at `public/cv.pdf` and set
`cv: { href: "/cv.pdf", updated: "2026-08" }`, and the entries appear.

### Adding a contribution

Append to `contributions.ts`. The route, the index row, the totals, the stack links and the test
suite all follow from the data — `tests/routes.spec.ts` derives its route list from it.

## Language

English is the default edition at the unprefixed path; Vietnamese lives under `/vi/`. Each page is
rendered once per locale rather than shipping both languages in one document, so there is no
flash, no duplicated DOM, and each edition has a crawlable URL. Page bodies live in `src/views/`
and the route files are thin wrappers that pass `lang`.

Technical strings — commit titles, file names, code fragments, diff figures — stay in English in
both editions.

## Design

Fraunces for display type (its `WONK` axis is what makes the letterforms irregular), Newsreader for
prose, IBM Plex Mono for every number and label. All three are self-hosted and all three include
the Vietnamese subset.

Import fonts through Fontsource's **per-weight** entry points, not its per-subset files: those omit
`unicode-range`, so importing several for one weight makes the last one claim every codepoint.

Light paper is the default and the server-rendered edition; dark is a designed counterpart. A
blocking script in `<head>` applies the stored choice before paint.

## Regenerating the Open Graph card

`public/og.png` is rendered by Chromium so it uses the real fonts. Twitter and Facebook do not
render an SVG `og:image`, so a PNG is required.

```bash
node scripts/make-og.mjs
```

## Production container

```bash
docker compose build
docker compose up -d
curl --fail http://127.0.0.1:18080/healthz
```

The site container serves static files on `127.0.0.1:18080`; it is intentionally inaccessible from
public interfaces. A dedicated Cloudflare Tunnel connector reaches it through the private Compose
network. The Compose project, network, tunnel, deployment state, and ingress are kept independent
from every other application on the VPS.

`nginx.conf` sets `absolute_redirect off` — without it, the redirect from `/work` to `/work/`
would be built from the container's own host and port and leak an internal address through the
tunnel. Its content security policy allows no third-party origin for scripts, styles or fonts.

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
`VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`, and `VPS_KNOWN_HOSTS`. The workflow uses the
short-lived `GITHUB_TOKEN` for each image pull and logs the VPS out of GitHub Container Registry
afterward.

The production Compose file reads `PORTFOLIO_IMAGE` from `/opt/tuan-portfolio/.deploy.env`.
`scripts/deploy.sh` serializes deploys with `flock`, rejects mutable image references, records the
active and previous healthy digests, rolls back when a replacement fails, and removes older
portfolio images only after a successful health check. It never runs a host-wide image or builder
prune.

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
