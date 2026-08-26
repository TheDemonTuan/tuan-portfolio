/**
 * Renders the Open Graph card to a real PNG. Twitter and Facebook do not
 * render an SVG `og:image`, so the card cannot simply be the SVG source.
 *
 * Chromium is used because it is already a dev dependency and because it is
 * the only renderer here that can lay the card out with the site's own
 * self-hosted fonts rather than a system substitute.
 *
 *   node scripts/make-og.mjs
 */
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const font = async (path) => (await readFile(join(root, "node_modules", path))).toString("base64");

const fraunces = await font("@fontsource-variable/fraunces/files/fraunces-latin-wonk-normal.woff2");
const frauncesVi = await font(
  "@fontsource-variable/fraunces/files/fraunces-vietnamese-wonk-normal.woff2",
);
const mono = await font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2");
const monoVi = await font(
  "@fontsource/ibm-plex-mono/files/ibm-plex-mono-vietnamese-500-normal.woff2",
);

const html = `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: F; src: url(data:font/woff2;base64,${fraunces}) format("woff2-variations"); font-weight: 100 900; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+2000-206F, U+2122, U+2212; }
  @font-face { font-family: F; src: url(data:font/woff2;base64,${frauncesVi}) format("woff2-variations"); font-weight: 100 900; unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB; }
  @font-face { font-family: M; src: url(data:font/woff2;base64,${mono}) format("woff2"); font-weight: 500; }
  @font-face { font-family: M; src: url(data:font/woff2;base64,${monoVi}) format("woff2"); font-weight: 500; unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #f3f0e9; color: #16140f;
         font-family: F, serif; display: flex; flex-direction: column;
         justify-content: space-between; padding: 68px 76px; }
  .top { display: flex; justify-content: space-between; align-items: baseline;
         border-bottom: 3px double rgba(22,20,15,.35); padding-bottom: 20px; }
  .mono { font-family: M, monospace; font-size: 21px; letter-spacing: .14em;
          text-transform: uppercase; color: #6f695c; }
  h1 { font-size: 96px; line-height: .95; letter-spacing: -.035em;
       font-variation-settings: "WONK" 1; font-weight: 400; max-width: 17ch; }
  .foot { display: flex; justify-content: space-between; align-items: baseline;
          border-top: 1px solid rgba(22,20,15,.22); padding-top: 20px; }
  .stat { font-family: M, monospace; font-size: 30px; font-weight: 500;
          letter-spacing: -.02em; color: #16140f; }
  .add { color: #2f6b34; } .del { color: #a3341f; }
</style>
<body>
  <div class="top">
    <span class="mono" style="color:#16140f">Nguyễn Viết Tuấn</span>
    <span class="mono">Hanoi · Backend</span>
  </div>
  <h1>I fix things that break underneath the application.</h1>
  <div class="foot">
    <span class="stat">6 merged &nbsp; <span class="add">+1,503</span> <span class="del">−300</span> &nbsp; 34 files</span>
    <span class="mono">tuannguyenviet.site</span>
  </div>
</body>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();

await writeFile(join(root, "public", "og.png"), png);
console.log(`public/og.png written (${(png.length / 1024).toFixed(1)} KB)`);
