// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://tuannguyenviet.site",
  output: "static",
  trailingSlash: "always",
  redirects: {
    "/work/omniroute-vps-workflow": {
      destination: "/work/blue-green-deploys-on-a-shared-vps/",
      status: 301,
    },
    "/vi/work/omniroute-vps-workflow": {
      destination: "/vi/work/blue-green-deploys-on-a-shared-vps/",
      status: 301,
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    build: {
      // font-src 'self' requires files, including small Unicode-range subsets.
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en-US", vi: "vi-VN" },
      },
    }),
  ],
});
