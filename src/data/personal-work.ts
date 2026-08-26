import type { L10n } from "./i18n";

export interface PersonalProject {
  readonly id: string;
  readonly title: string;
  readonly year: string;
  readonly summary: L10n;
  readonly tech: readonly string[];
  readonly url: string | null;
  /**
   * Kept explicit so this block can never be mistaken for upstream-merged work.
   * `fork` — shipped in a personal fork. `self` — this site's own infrastructure.
   */
  readonly kind: "fork" | "self";
}

export const personalWork: readonly PersonalProject[] = [
  {
    id: "edge-approval-gateway",
    title: "Cloudflare Edge Approval Gateway",
    year: "2026",
    summary: {
      en: "An approval gateway running at the edge on Cloudflare Workers, keeping per-tenant state in SQLite-backed Durable Objects so a decision survives the request that made it.",
      vi: "Một cổng phê duyệt chạy ở edge trên Cloudflare Workers, giữ trạng thái theo từng tenant trong Durable Objects nền SQLite, để một quyết định vẫn tồn tại sau khi request tạo ra nó kết thúc.",
    },
    tech: ["Cloudflare Workers", "Durable Objects", "SQLite", "TypeScript"],
    url: "https://github.com/TheDemonTuan/OmniRoute",
    kind: "fork",
  },
  {
    id: "telegram-ops-bot",
    title: "Telegram ops bot",
    year: "2026",
    summary: {
      en: "A chat-driven operations bot for a self-hosted deployment: container logs by alias, bounded command timeouts, and a privileged helper that behaves correctly when supervised by systemd.",
      vi: "Một bot vận hành điều khiển qua chat cho hệ thống tự host: xem log container theo alias, giới hạn thời gian chờ lệnh, và một helper đặc quyền hoạt động đúng khi được systemd giám sát.",
    },
    tech: ["Node.js", "systemd", "Docker", "Linux"],
    url: "https://github.com/TheDemonTuan/OmniRoute",
    kind: "fork",
  },
  {
    id: "this-site",
    title: "tuannguyenviet.site",
    year: "2026",
    summary: {
      en: "This site, and the pipeline under it: digest-pinned deploys serialised with a lock, automatic rollback on a failed health check, and a hardened read-only container reachable only through its own tunnel.",
      vi: "Chính trang này, và pipeline bên dưới nó: deploy ghim theo digest và tuần tự hoá bằng lock, tự động rollback khi health check thất bại, và một container read-only đã siết chặt, chỉ tiếp cận được qua tunnel riêng của nó.",
    },
    tech: ["Astro", "Docker", "Nginx", "GitHub Actions", "Cloudflare Tunnel"],
    url: "https://github.com/TheDemonTuan/tuan-portfolio",
    kind: "self",
  },
];

export const KIND_LABEL: Readonly<Record<PersonalProject["kind"], L10n>> = {
  fork: { en: "Personal fork", vi: "Fork cá nhân" },
  self: { en: "This site", vi: "Trang này" },
};
