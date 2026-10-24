import type { L10n } from "./i18n";

export interface PersonalProject {
  readonly id: string;
  readonly title: string;
  readonly year: string;
  readonly summary: L10n;
  readonly tech: readonly string[];
  readonly url: string;
  readonly kind: "original" | "fork" | "derived" | "profile";
  readonly upstream: string | null;
  readonly articleSlug: string | null;
  readonly evidenceUrl: string;
}

export const repositorySnapshot = "2026-10-23";
export const sceneProjectIds = [
  "9router",
  "vps-deploy",
  "tuan-file-manager",
  "tuan-docker-manager",
  "acb-transaction-webhook",
  "facebook-messenger-ai-rep",
] as const;

export const personalWork: readonly PersonalProject[] = [
  {
    id: "9router",
    title: "9Router",
    year: "2026",
    summary: {
      en: "A maintained fork of 9Router, separating AI gateway administration, API traffic and browser runtime with source-backed delivery notes.",
      vi: "Fork đang phát triển của 9Router, tách quản trị AI gateway, lưu lượng API và browser runtime với ghi chép triển khai có dẫn chứng.",
    },
    tech: ["TypeScript", "Bun", "Docker", "GitHub Actions"],
    url: "https://github.com/TheDemonTuan/9router",
    kind: "fork",
    upstream: "https://github.com/decolua/9router",
    articleSlug: "ai-gateway-control-and-data-planes",
    evidenceUrl:
      "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/DEPLOYMENT.md",
  },
  {
    id: "vps-deploy",
    title: "Shared VPS deployment platform",
    year: "2026",
    summary: {
      en: "A shared deployment engine that accepts immutable CI requests and coordinates candidate health, route acknowledgement and blue-green recovery.",
      vi: "Deployment engine dùng chung nhận request bất biến từ CI, điều phối health của candidate, xác nhận route và phục hồi blue-green.",
    },
    tech: ["Python", "Bash", "Docker", "GitHub Actions", "Linux ARM64"],
    url: "https://github.com/TheDemonTuan/vps-deploy",
    kind: "original",
    upstream: null,
    articleSlug: "blue-green-deploys-on-a-shared-vps",
    evidenceUrl:
      "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/README.md",
  },
  {
    id: "tuan-file-manager",
    title: "Resumable file manager",
    year: "2026",
    summary: {
      en: "A Go file manager with tus uploads, SQLite WAL and a documented reconciliation design across database and filesystem boundaries.",
      vi: "File manager bằng Go với tus upload, SQLite WAL và thiết kế reconciliation được ghi nhận qua ranh giới database và filesystem.",
    },
    tech: ["Go", "SQLite", "tus", "Cloudflare Access"],
    url: "https://github.com/TheDemonTuan/tuan-file-manager",
    kind: "original",
    upstream: null,
    articleSlug: "tus-uploads-and-crash-safe-finalization",
    evidenceUrl:
      "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/README.md",
  },
  {
    id: "tuan-docker-manager",
    title: "Docker Compose manager",
    year: "2026",
    summary: {
      en: "An MVP management panel whose Go application core delegates privileged Docker operations to a separate Unix-socket agent; the article examines the limits of that boundary.",
      vi: "Management panel ở mức MVP: application core bằng Go chuyển thao tác Docker đặc quyền cho agent riêng qua Unix socket; bài viết phân tích giới hạn của ranh giới đó.",
    },
    tech: ["Go", "SQLite", "Docker", "Unix sockets"],
    url: "https://github.com/TheDemonTuan/tuan-docker-manager",
    kind: "original",
    upstream: null,
    articleSlug: "docker-manager-isolating-the-docker-socket",
    evidenceUrl:
      "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/README.md",
  },
  {
    id: "acb-transaction-webhook",
    title: "Bank event gateway",
    year: "2026",
    summary: {
      en: "A Go payment-event gateway with verified provider intake, SQLite-backed durable notification delivery and separate gateway and worker roles.",
      vi: "Gateway sự kiện thanh toán bằng Go, xác minh đầu vào từ provider, gửi thông báo bền vững trên SQLite và tách vai trò gateway với worker.",
    },
    tech: ["Go", "SQLite", "Docker", "Webhooks"],
    url: "https://github.com/TheDemonTuan/acb-transaction-webhook",
    kind: "original",
    upstream: null,
    articleSlug: "acb-email-to-durable-webhook",
    evidenceUrl:
      "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/cmd/gateway/main.go",
  },
  {
    id: "facebook-messenger-ai-rep",
    title: "Single-agent Messenger automation",
    year: "2026",
    summary: {
      en: "Experimental personal-account Messenger automation with PostgreSQL jobs, a separate browser agent and human handoff; subject to Meta account and policy risks.",
      vi: "Tự động hóa Messenger tài khoản cá nhân mang tính thử nghiệm, với job PostgreSQL, browser agent riêng và chuyển giao cho người; có rủi ro tài khoản và chính sách Meta.",
    },
    tech: ["TypeScript", "PostgreSQL", "Playwright", "Docker"],
    url: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep",
    kind: "original",
    upstream: null,
    articleSlug: "a-single-agent-messenger-automation-system",
    evidenceUrl:
      "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/README.md",
  },
  {
    id: "tuan-beszel",
    title: "Beszel infrastructure integration",
    year: "2026",
    summary: {
      en: "Infrastructure integration using official Beszel Hub/Agent images, plus an independently managed heartbeat Worker and D1 database; not authorship of Beszel.",
      vi: "Tích hợp hạ tầng dùng image Beszel Hub/Agent chính thức, kèm heartbeat Worker và D1 quản lý độc lập; không nhận tác giả Beszel.",
    },
    tech: ["Docker", "Beszel", "Cloudflare Workers", "D1"],
    url: "https://github.com/TheDemonTuan/tuan-beszel",
    kind: "original",
    upstream: "https://github.com/henrygd/beszel",
    articleSlug: "monitoring-a-service-with-independent-health-signals",
    evidenceUrl:
      "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/README.md",
  },
  {
    id: "tuan-uptimeflare",
    title: "UptimeFlare status integration",
    year: "2026",
    summary: {
      en: "An UptimeFlare-derived status and monitoring integration on Cloudflare Workers, consuming independent service and host-health signals.",
      vi: "Tích hợp status và monitoring phát triển từ UptimeFlare trên Cloudflare Workers, tiêu thụ tín hiệu sức khỏe dịch vụ và máy chủ độc lập.",
    },
    tech: ["TypeScript", "Cloudflare Workers", "D1"],
    url: "https://github.com/TheDemonTuan/tuan-uptimeflare",
    kind: "derived",
    upstream: "https://github.com/lyc8503/UptimeFlare",
    articleSlug: "monitoring-a-service-with-independent-health-signals",
    evidenceUrl:
      "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/README.md",
  },
  {
    id: "tuan-portfolio",
    title: "Systems Observatory portfolio",
    year: "2026",
    summary: {
      en: "This bilingual static portfolio: typed editorial data, public source attribution and progressively enhanced local Three.js visualization.",
      vi: "Portfolio tĩnh song ngữ này: dữ liệu biên tập có kiểu, ghi công nguồn công khai và trực quan Three.js cục bộ theo progressive enhancement.",
    },
    tech: ["Astro", "Bun", "Three.js", "Nginx", "Caddy", "Cloudflare Tunnel"],
    url: "https://github.com/TheDemonTuan/tuan-portfolio",
    kind: "original",
    upstream: null,
    articleSlug: "portfolio-as-a-source-backed-editorial-system",
    evidenceUrl: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/README.md",
  },
  {
    id: "TheDemonTuan",
    title: "GitHub profile",
    year: "2026",
    summary: {
      en: "Public GitHub profile repository metadata. No product or feature claims are assigned to this entry.",
      vi: "Metadata repository hồ sơ GitHub công khai. Mục này không gán tuyên bố về sản phẩm hoặc tính năng.",
    },
    tech: [],
    url: "https://github.com/TheDemonTuan/TheDemonTuan",
    kind: "profile",
    upstream: null,
    articleSlug: null,
    evidenceUrl: "https://github.com/TheDemonTuan/TheDemonTuan",
  },
];

export const KIND_LABEL: Readonly<Record<PersonalProject["kind"], L10n>> = {
  original: { en: "Original project", vi: "Dự án tự xây" },
  fork: { en: "Maintained fork", vi: "Fork đang phát triển" },
  derived: { en: "Upstream-derived", vi: "Phát triển từ upstream" },
  profile: { en: "Profile", vi: "Hồ sơ GitHub" },
};
