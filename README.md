# Nguyễn Viết Tuấn — Portfolio

Bilingual portfolio for [tuannguyenviet.site](https://tuannguyenviet.site), built with Bun and
Astro and shipped as static files. Systems Observatory combines readable source-backed HTML
with a local, progressively enhanced Three.js scene; no client framework or live GitHub fetches.

## Local development

Requires Bun 1.4.4 or newer and Docker for the production image. The project pins Bun 1.4.4
for reproducible development and CI.

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
then does not start a local server. `bun run test` runs this browser suite. Deployment-engine,
route-publication and host-isolation tests belong to the deployment platform, not this application.

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

The image builds the Astro site with Bun and serves static files with unprivileged Nginx on
port `8080`. A small compiled supervisor supplies the deployment health contract and supervises
Nginx; it is not an application server and does not render pages. Production runs read-only,
with capabilities dropped, `no-new-privileges`, bounded resources and writable temporary storage.
The platform owns the production container configuration and private ingress; the application
does not publish a production host port.

For a local container check, build and bind only to loopback:

```bash
docker build -t tuan-portfolio:local .
docker run --rm -d --name portfolio-local --read-only --cap-drop ALL \
  --security-opt no-new-privileges:true --tmpfs /tmp:rw,nosuid,nodev,size=32m,mode=1777 \
  --tmpfs /var/cache/nginx:rw,noexec,nosuid,size=16m,uid=101,gid=101 \
  -e DEPLOY_SLOT=blue -p 127.0.0.1:8088:8080 tuan-portfolio:local
curl --fail http://127.0.0.1:8088/healthz
BASE_URL=http://127.0.0.1:8088 bun run test:browser
docker stop portfolio-local
```

`DEPLOY_SLOT` is required and must be `blue` or `green`; production supplies it through the
platform. A successful `/healthz` response is uncached JSON with `ok: true`, the
`deployment_slot`, an `instance_id` in `<hostname>-<positive decimal>` form,
`active_requests_known: true`, and an integer `active_requests`. Activity is a conservative
Nginx connection observation, excluding the two connections used by the health probe itself;
idle keepalive connections remain counted rather than being declared drained early. An unavailable
or inconsistent observation returns HTTP 503 with unknown activity, never a fabricated zero.
Nginx's status endpoint and the supervisor listener remain container-local.

`nginx.conf` keeps `absolute_redirect off` so redirects cannot leak an internal host or port.
The content security policy permits no third-party script, style or font origin. Static assets,
real 404 responses and the legacy article redirects remain Nginx responsibilities.

## Continuous deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. Install the locked dependencies, check types and formatting, build the site, and run browser tests.
2. Call the exact-commit-pinned `vps-deploy` reusable `build-docker.yml` workflow. It validates
   the registered caller and `.deploy/app.yml`, builds natively for `linux/arm64`, and publishes
   `ghcr.io/thedemontuan/tuan-portfolio` with an immutable digest.
3. In the protected `production` environment, pass that digest to the pinned platform deploy action
   for app `tuan-portfolio` on host `oracle-main`.
4. The host-owned engine validates the request and runs blue-green candidate health, route
   publication/acknowledgement and old-slot draining. Candidate health has a 60-second bound;
   route acknowledgement has a 30-second bound.

Manual dispatch with `skip_deploy: true` runs the same test/build/publish path but never submits
a deployment request or acquires production deployment credentials. Updating the platform revision
requires changing both `uses` pins and both matching `platform-ref` inputs together, after the
registered app and host release have been enrolled. The manifest must exactly match the platform
registration; it is not an unrestricted Compose configuration.

### Production environment configuration

Configure only `DEPLOY_SSH_KEY` in GitHub's `production` environment: the dedicated key enrolled
for the forced-command `deploy-tuan-portfolio` account, never a general-purpose administrator key.
The registered `oracle-main` inventory supplies the SSH address and port; the transport derives
the account name from the app ID and pins and verifies the registered host fingerprint. The caller
does not supply `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER` or `VPS_KNOWN_HOSTS` overrides.

The reusable builder uses `GITHUB_TOKEN` with `packages: write` for publication. Host registry
access, if needed, is managed by platform enrollment, not a caller SSH login or forwarded GitHub token.

### Ownership and migration

[vps-deploy](https://github.com/TheDemonTuan/vps-deploy) owns the registered adapter, production
Compose configuration, host profile, route generation, ingress policy, enrollment and recovery.
The application owns its image, Nginx/static security, runtime health contract and manifest.
The caller submits only bounded platform operations: it does not copy files to the VPS, execute
arbitrary remote shell commands, manage Caddy or Cloudflare credentials, or prune host images.

This replaces the former raw-SSH/Compose/Caddy delivery path. The old application Compose file,
deployment and image-retention scripts, edge scripts and infrastructure, edge runbook and their
three shell regression suites have been removed. After the platform cutover is accepted, retire
the old `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`, and `VPS_KNOWN_HOSTS` environment secrets
and obsolete `BUILD_RUNNER`/`DEPLOY_PLATFORM` variables. Revoke the old deploy key on the host;
deleting a GitHub secret alone does not revoke access. Host resource retirement must be coordinated
by the platform operator without removing networks or ingress still serving other applications.

The source-backed portfolio articles retain their historical Caddy architecture evidence. Those
editorial snapshots are not current operating instructions; this section and the registered
platform release describe the deployment boundary after migration.

## Recovery

Use the registered platform's `status`, `reconcile` and `rollback` operations through its approved
operator procedure; see the [platform operations documentation](https://github.com/TheDemonTuan/vps-deploy#readme).
Do not revive the retired deployment script or manually modify shared routes. The engine owns
per-app locking, candidate failure recovery and route acknowledgements. A disconnected CI transport
does not cancel detached host work: inspect its status before requesting another operation.
Old-slot cleanup depends on known activity reaching zero; unknown activity must not be treated
as a successful drain. Rollback is a traffic/image operation, not a guarantee of data restoration.
