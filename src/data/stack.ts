import type { L10n } from "./i18n";

export interface StackItem {
  readonly name: string;
  readonly provenance:
    | { readonly kind: "contribution"; readonly slug: string }
    | { readonly kind: "project"; readonly id: string };
}

export interface StackGroup {
  readonly id: string;
  readonly label: L10n;
  readonly items: readonly StackItem[];
}

export const stack: readonly StackGroup[] = [
  {
    id: "languages",
    label: { en: "Languages", vi: "Ngôn ngữ" },
    items: [
      { name: "TypeScript", provenance: { kind: "contribution", slug: "sse-ingest-byte-budget" } },
      { name: "JavaScript", provenance: { kind: "contribution", slug: "bun-napi-abort" } },
      { name: "Go", provenance: { kind: "project", id: "acb-transaction-webhook" } },
      { name: "SQL", provenance: { kind: "project", id: "facebook-messenger-ai-rep" } },
      { name: "Bash", provenance: { kind: "project", id: "vps-deploy" } },
    ],
  },
  {
    id: "runtime",
    label: { en: "Runtime & rendering", vi: "Runtime & hiển thị" },
    items: [
      { name: "Node.js", provenance: { kind: "contribution", slug: "bundler-resolution" } },
      { name: "Bun", provenance: { kind: "contribution", slug: "bun-napi-abort" } },
      { name: "Next.js", provenance: { kind: "contribution", slug: "bundler-resolution" } },
      { name: "Astro", provenance: { kind: "project", id: "tuan-portfolio" } },
      { name: "Three.js", provenance: { kind: "project", id: "tuan-portfolio" } },
    ],
  },
  {
    id: "data",
    label: { en: "Data", vi: "Dữ liệu" },
    items: [
      { name: "SQLite", provenance: { kind: "contribution", slug: "bun-napi-abort" } },
      { name: "PostgreSQL", provenance: { kind: "project", id: "facebook-messenger-ai-rep" } },
    ],
  },
  {
    id: "ops",
    label: { en: "Infrastructure", vi: "Hạ tầng" },
    items: [
      { name: "Docker", provenance: { kind: "project", id: "vps-deploy" } },
      { name: "GitHub Actions", provenance: { kind: "project", id: "vps-deploy" } },
      { name: "Linux ARM64", provenance: { kind: "project", id: "vps-deploy" } },
      { name: "Nginx", provenance: { kind: "project", id: "tuan-portfolio" } },
      { name: "Caddy", provenance: { kind: "project", id: "tuan-portfolio" } },
      { name: "Cloudflare Workers", provenance: { kind: "project", id: "tuan-uptimeflare" } },
      { name: "Cloudflare Tunnel", provenance: { kind: "project", id: "tuan-portfolio" } },
    ],
  },
];
