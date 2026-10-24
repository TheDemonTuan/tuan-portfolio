# Nguyễn Viết Tuấn — Portfolio

Bilingual portfolio for [tuannguyenviet.site](https://tuannguyenviet.site), built with Bun and
Astro and shipped as static files. Systems Observatory combines readable source-backed HTML
with a local, progressively enhanced Three.js scene; no client framework or live GitHub fetches.

## Local development

Requires Bun 1.4.4 or newer, Bash for the shell regression suites, and Docker for the production
image. The project pins Bun 1.4.4 for reproducible development and CI.

```bash
bun install
bun ./node_modules/playwright/cli.js install chromium
bun run dev --background
```

Invoke Playwright's installed CLI directly with Bun: on Windows, the `bunx.exe` launcher can be
inherited by Playwright workers and cause their forked process to fail.

The default development URL is `http://localhost:4321`. Stop it with `bun run astro dev stop` before running
browser tests: Playwright starts a fresh built preview at `http://127.0.0.1:4321` and never reuses
an existing server. Build before testing:

```bash
bun run check
bun run build
bun run test
```

`bun run typecheck` first synchronizes Astro types, then runs the native Bun TypeScript checker
(`bun check --no-script`) and Astro's checker for `.astro` files. `bun run check` also checks formatting;
`bun run build` includes type checking before generating the static site.

Use `bun run fmt` to format files or `bun run fmt:check` for a read-only formatting check. Bun's
native formatter handles supported non-Astro files; Prettier and its Astro plugin are retained
only for `src/**/*.astro`.
The scripts use `--no-script` with native `bun check` and `bun fmt` because the package scripts
named `check` and `fmt` otherwise shadow those commands. Use `bun run` to invoke the package scripts.
The formatter also uses `--no-config` to disable Prettier-compatible configuration discovery so
native TOML formatting remains available; formatting settings still come from `bunfig.toml`.

Astro and Playwright run their installed CLI files directly with Bun. On this Windows Bun release,
`bunx --bun` exposes `bunx.exe` as the process executable; forked background servers or browser
workers then interpret the child script path as a package request. Direct Bun invocation preserves
the real runtime identity without a Node fallback or dependency patches.

`bun run test:browser` runs the three Playwright projects (desktop-wide, desktop, and mobile)
against the built preview. Set `BASE_URL` to test an already-running deployment instead; Playwright
then does not start a local server. `bun run test:shell` runs the Bash deployment, image-retention,
and edge-configuration regression suites. `bun run test` runs both suites. Playwright and Bash
remain the test runners; native Bun test does not replace their fixtures or lifecycle.

Use `bun install --frozen-lockfile` when reproducing the committed dependency graph in CI.

## Content

All copy and data live in `src/data/`, never in markup:

| File               | Holds                                                                           |
| ------------------ | ------------------------------------------------------------------------------- |
| `contributions.ts` | The merged upstream pull requests and their write-ups                           |
| `articles.ts`      | Eight complete EN/VI systems articles with section-level source evidence        |
| `personal-work.ts` | Public repository snapshot, original/fork/derived/profile ownership and sources |
| `site.ts`          | Identity and contact channels                                                   |
| `stack.ts`         | Tools linked to merged contributions or public project evidence                 |
| `copy.ts`          | Page prose                                                                      |
| `ui.ts`            | Navigation and control labels                                                   |
| `i18n.ts`          | Locale helpers, `localizePath` / `alternatePath`                                |

Totals such as `+1,503 / −300` are **computed** from `contributions.ts`, so the home page and the
index cannot disagree. Repository star and fork counts are stamped with `statsAsOf` and rendered
as a snapshot; they are deliberately not fetched at build time, which would make builds
non-reproducible and add a network dependency to the Docker build.

The current repository inventory was fetched on **2026-10-23**. External application evidence
links pin the default-branch commit read during editorial research. Portfolio changes use main-path
links until the redesigned sources are published. Article dates are writing dates, not repository
creation dates; reading time is rounded up from each locale's whitespace-delimited content at
220 words/minute. Profile metadata is not a product, and repository ownership is not a PR metric.
The ACB repository's current code accepts payment-provider events rather than its historical email
intake; the article states this source discrepancy explicitly.

Two contact channels are ready but unset: `site.linkedin` and `site.cv` are `null`, and nothing is
rendered for them. Set `linkedin` to a URL, or drop a PDF at `public/cv.pdf` and set
`cv: { href: "/cv.pdf", updated: "2026-08" }`, and the entries appear.

### Adding a contribution

Append to `contributions.ts`. Routes, index rows, totals and stack links follow from the data.
`tests/routes.spec.ts` checks the built public sitemap rather than maintaining a second catalogue.

## Language

English is the default edition at the unprefixed path; Vietnamese lives under `/vi/`. Each page is
rendered once per locale rather than shipping both languages in one document, so there is no
flash, no duplicated DOM, and each edition has a crawlable URL. Page bodies live in `src/views/`
and the route files are thin wrappers that pass `lang`.

Technical strings — commit titles, file names, code fragments, diff figures — stay in English in
both editions.

The retired `/work/omniroute-vps-workflow` article redirects to
`/work/blue-green-deploys-on-a-shared-vps/`, with the same mapping under `/vi/`.
Nginx returns a single HTTP 301 for both trailing-slash forms with a relative `Location`;
Astro emits a usable static redirect document at the trailing-slash URL for built preview;
preview itself rejects slashless routes under `trailingSlash: "always"`. Production checks use
`BASE_URL` to exercise both forms. Only current article URLs belong in the sitemap and canonical links.

## Design

Systems Observatory uses Manrope Variable for display, Be Vietnam Pro (400/500/600/700) for
body copy, and IBM Plex Mono (400/500) for metadata and code. Fontsource full-unicode/per-weight
entry points preserve `unicode-range` and Vietnamese coverage; all font files are self-hosted.
Vite asset inlining is disabled so small font subsets remain same-origin files rather than
`data:` URLs rejected by the production `font-src 'self'` policy.

Light is the complete server-rendered/no-JavaScript edition; dark is a separately designed palette.
A synchronous head bootstrap reads storage independently from OS-theme detection. The binary
toggle appears only after initialization, follows OS changes until explicit choice, and retains an
in-memory override even when storage is denied.
Its accessible name includes the visible edition label as well as the switch action for voice control.

The homepage's HTML links and orbital SVG carry the complete project meaning. Desktop fine-pointer
visitors without reduced motion or save-data may load the local renderer near the viewport.
Mobile and other ineligible visits retain the static composition without downloading Three.js.
The scene pauses offscreen, in hidden documents, or on user request; eligibility changes, context
loss, navigation and BFCache restoration are lifecycle boundaries, not reasons to hide content.

## Regenerating the Open Graph card

`public/og.png` is rendered by Chromium so it uses the real fonts. Twitter and Facebook do not
render an SVG `og:image`, so a PNG is required.

```bash
bun run og
```

## Production container

```bash
docker network inspect edge-portfolio
docker compose up -d
EDGE_HOST=tuannguyenviet.site scripts/edge-smoke.sh
```

The external `edge-portfolio` network and shared edge stack must exist before starting the production Compose file.

The production site container publishes no host port. The VPS-wide Cloudflare Tunnel connector
reaches one shared Caddy gateway; that gateway proxies `tuannguyenviet.site` to the stable Docker
alias `portfolio-web:8080` on the internal `edge-portfolio` network. The portfolio repository owns
only the application container, while `/opt/edge` owns the single connector and gateway used by
all migrated applications. See `EDGE_INGRESS_RULES.md` for the convention used by other repos.

`nginx.conf` sets `absolute_redirect off` — without it, the redirect from `/work` to `/work/`
would be built from the container's own host and port and leak an internal address through the
tunnel. Its content security policy allows no third-party origin for scripts, styles or fonts.

## Continuous deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. Type-check and build the static site.
2. Build the ARM64 container on a native GitHub runner.
3. Publish `ghcr.io/thedemontuan/tuan-portfolio` to GitHub Container Registry.
4. Deploy the immutable image digest to `/opt/tuan-portfolio` over SSH.
5. Stage deployment files after confirming the shared Caddy, connector, and `edge-portfolio` network exist.
6. Recreate only the portfolio service and verify its health through the shared Caddy ingress.

The shared connector token is stored only as `/opt/edge/secrets/tunnel-token` with mode `0600`; it
is never committed or copied by the application deployment workflow. The `production` GitHub environment holds
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
