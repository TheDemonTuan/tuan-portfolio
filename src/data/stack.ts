import type { L10n } from "./i18n";

export interface StackItem {
  readonly name: string;
  /**
   * Slug of the contribution that demonstrates this technology in public.
   * `null` means it is used in private or personal work only — labelled as
   * such rather than presented alongside the proven entries.
   */
  readonly provenance: string | null;
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
      { name: "TypeScript", provenance: "sse-ingest-byte-budget" },
      { name: "JavaScript", provenance: "bun-napi-abort" },
      { name: "Go", provenance: null },
      { name: "SQL", provenance: null },
      { name: "Bash", provenance: null },
    ],
  },
  {
    id: "runtime",
    label: { en: "Runtime & frameworks", vi: "Runtime & framework" },
    items: [
      { name: "Node.js", provenance: "bundler-resolution" },
      { name: "Bun", provenance: "bun-napi-abort" },
      { name: "Next.js", provenance: "bundler-resolution" },
      { name: "NestJS", provenance: null },
      { name: "Astro", provenance: null },
      { name: "Prisma", provenance: null },
    ],
  },
  {
    id: "data",
    label: { en: "Data", vi: "Dữ liệu" },
    items: [
      { name: "SQLite", provenance: "bun-napi-abort" },
      { name: "MySQL", provenance: null },
      { name: "MongoDB", provenance: null },
      { name: "Redis", provenance: null },
      { name: "GraphQL", provenance: null },
    ],
  },
  {
    id: "ops",
    label: { en: "Operations", vi: "Vận hành" },
    items: [
      { name: "Docker", provenance: "bun-napi-abort" },
      { name: "Linux / ARM64", provenance: "bun-napi-abort" },
      { name: "GitHub Actions", provenance: null },
      { name: "Nginx", provenance: null },
      { name: "Caddy", provenance: null },
      { name: "Cloudflare Workers", provenance: null },
      { name: "Cloudflare Tunnel", provenance: null },
    ],
  },
];

export const provenLabel: L10n = {
  en: "Shown in a merged upstream patch",
  vi: "Có trong một bản vá đã merge upstream",
};
