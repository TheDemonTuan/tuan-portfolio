/** Generate self-owned Systems Observatory identity assets with Bun and Chromium. */
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { site } from "../src/data/site.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const embedFontCss = async (packageName, entry) => {
  const folder = join(root, "node_modules", packageName);
  let css = await readFile(join(folder, entry), "utf8");
  for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
    const bytes = await readFile(join(folder, match[1].replace(/["']/g, "")));
    css = css.replace(match[0], `url(data:font/woff2;base64,${bytes.toString("base64")})`);
  }
  return css;
};
const fontCss = (
  await Promise.all([
    embedFontCss("@fontsource-variable/manrope", "index.css"),
    embedFontCss("@fontsource/be-vietnam-pro", "400.css"),
    embedFontCss("@fontsource/ibm-plex-mono", "500.css"),
  ])
).join("\n");
const emblem = `<path d="M10 34V10l14 24V10M29 10l8 24 8-24M48 10h20M58 10v24" fill="none" stroke="#67E8F9" stroke-width="3" stroke-linecap="square"/>`;
const motif = `<g fill="none" stroke="#67E8F9"><ellipse cx="920" cy="310" rx="210" ry="85" transform="rotate(-25 920 310)" opacity=".45"/><ellipse cx="920" cy="310" rx="160" ry="160" transform="rotate(30 920 310)" opacity=".22"/><ellipse cx="920" cy="310" rx="115" ry="210" transform="rotate(45 920 310)" opacity=".3"/></g><g stroke="#67E8F9" fill="#19273B"><path d="m920 224 64 35v72l-64 35-64-35v-72z"/><path d="m856 259 64 36 64-36M920 295v71" fill="none"/><path d="m864 333 56 32 56-32v20l-56 32-56-32z"/><path d="m872 373 48 28 48-28v18l-48 28-48-28z"/></g><g fill="#67E8F9"><circle cx="733" cy="389" r="6"/><circle cx="1074" cy="212" r="6"/><circle cx="1012" cy="480" r="6"/><circle cx="853" cy="126" r="6"/></g><g fill="#F4AF86"><circle cx="1106" cy="359" r="6"/><circle cx="778" cy="226" r="6"/></g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#080D16"/><path d="M64 100H1136M64 530H1136" stroke="#19273B"/><g transform="translate(64 36)">${emblem}</g><text x="160" y="68" fill="#B2C1D5" font-family="sans-serif" font-size="18">SYSTEMS OBSERVATORY</text>${motif}<g fill="#EDF4FF" font-family="Manrope Variable, sans-serif" font-weight="600"><text x="64" y="183" font-size="36">${site.name}</text><text x="64" y="287" font-size="60">Backend systems.</text><text x="64" y="360" font-size="60">AI workflows.</text><text x="64" y="433" font-size="44">Built with evidence.</text></g><text x="64" y="577" fill="#B2C1D5" font-family="monospace" font-size="20">${new URL(site.origin).host}</text></svg>`;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 48"><rect width="80" height="48" rx="9" fill="#080D16"/>${emblem}</svg>`;
const html = `<!doctype html><meta charset="utf-8"><style>${fontCss}*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#080D16;color:#EDF4FF;font-family:"Be Vietnam Pro",sans-serif}.art{position:absolute;inset:0}.identity{position:absolute;left:64px;top:143px;font-family:"Manrope Variable",sans-serif;font-size:36px;font-weight:600}.headline{position:absolute;left:64px;top:225px;font-family:"Manrope Variable",sans-serif;font-size:60px;font-weight:600;line-height:1.22;letter-spacing:-.035em}.headline small{font-size:44px}.domain{position:absolute;left:64px;bottom:48px;font-family:"IBM Plex Mono",monospace;font-size:20px;color:#B2C1D5}</style><body><svg class="art" width="1200" height="630" viewBox="0 0 1200 630"><path d="M64 100H1136M64 530H1136" stroke="#19273B"/><g transform="translate(64 36)">${emblem}</g><text x="160" y="68" fill="#B2C1D5" font-family="IBM Plex Mono" font-size="18">SYSTEMS OBSERVATORY</text>${motif}</svg><div class="identity">${site.name}</div><h1 class="headline">Backend systems.<br>AI workflows.<br><small>Built with evidence.</small></h1><div class="domain">${new URL(site.origin).host}</div></body>`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  await writeFile(join(root, "public", "og.png"), png);
  await writeFile(join(root, "public", "og-card.svg"), svg);
  await writeFile(join(root, "public", "favicon.svg"), favicon);
  await page.setViewportSize({ width: 64, height: 64 });
  await page.setContent(
    `<style>body{margin:0;width:64px;height:64px;display:grid;place-items:center;background:#080D16}svg{width:64px}</style>${favicon}`,
  );
  const iconPng = await page.screenshot({ type: "png" });
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 64;
  header[7] = 64;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(iconPng.length, 14);
  header.writeUInt32LE(22, 18);
  await writeFile(join(root, "public", "favicon.ico"), Buffer.concat([header, iconPng]));
  console.log(`Generated 1200×630 OG PNG (${png.length} bytes), SVG and 64×64 favicon.`);
} finally {
  await browser.close();
}
