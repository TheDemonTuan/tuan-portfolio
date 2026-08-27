import type { RichText } from "./contributions";
import type { L10n } from "./i18n";

export interface ArticleStep {
  readonly id: string;
  readonly label: L10n;
  readonly title: L10n;
  readonly summary: L10n<RichText>;
  readonly detail: L10n<RichText>;
  readonly proof: { readonly label: string; readonly href: string };
}

export interface Article {
  readonly slug: string;
  readonly eyebrow: L10n;
  readonly title: L10n;
  readonly description: L10n;
  readonly published: string;
  readonly updated: string;
  readonly readTime: L10n;
  readonly stack: readonly string[];
  readonly lede: L10n<RichText>;
  readonly architecture: readonly string[];
  readonly principles: readonly { readonly title: L10n; readonly body: L10n }[];
  readonly steps: readonly ArticleStep[];
  readonly limits: readonly L10n<RichText>[];
}

const repoAt =
  "https://github.com/TheDemonTuan/OmniRoute/blob/5d58343b0a0aff4f6335638c96f26a8bb5b104c4";

export const articles: readonly Article[] = [
  {
    slug: "omniroute-vps-workflow",
    eyebrow: { en: "Operations field note", vi: "Ghi chép vận hành" },
    title: {
      en: "How I ship OmniRoute to a VPS without treating deploy as a leap of faith",
      vi: "Cách tôi triển khai OmniRoute lên VPS mà không biến deploy thành một lần cầu may",
    },
    description: {
      en: "A source-backed walkthrough of my OmniRoute production fork: reviewable upstream syncs, Bun images, immutable digests, blue-green switching, health gates and rollback.",
      vi: "Quy trình có dẫn chứng từ source cho fork OmniRoute production: đồng bộ upstream qua PR, image Bun, digest bất biến, chuyển blue-green, health gate và rollback.",
    },
    published: "2026-08-27",
    updated: "2026-08-27",
    readTime: { en: "8 min read", vi: "8 phút đọc" },
    stack: ["GitHub Actions", "Bun", "Docker", "GHCR", "Caddy", "Cloudflare Tunnel"],
    lede: {
      en: [
        "The application is only half the system. My production fork adds a review and delivery path around upstream OmniRoute: sync into a dedicated branch, test the exact runtime image, address it by digest, then let the VPS perform the stateful switch. This article follows the repository as it exists, not an idealised architecture diagram.",
      ],
      vi: [
        "Ứng dụng chỉ là một nửa hệ thống. Fork production của tôi bổ sung một đường review và phân phối bao quanh OmniRoute upstream: đồng bộ vào branch riêng, test đúng runtime image, định danh image bằng digest, rồi để VPS tự thực hiện lần chuyển có state. Bài này đi theo source đang chạy, không kể một sơ đồ lý tưởng hoá.",
      ],
    },
    architecture: [
      "Upstream release/*",
      "sync PR → fork/prod",
      "Actions → Bun image",
      "GHCR @ sha256",
      "SSH → VPS staging",
      "blue / green slots",
      "Caddy → cloudflared",
    ],
    principles: [
      {
        title: { en: "Review before shipping", vi: "Review trước khi ship" },
        body: {
          en: "Upstream changes arrive as a pull request into prod, not a blind scheduled push.",
          vi: "Thay đổi từ upstream đi vào prod bằng pull request, không phải một scheduled push mù.",
        },
      },
      {
        title: { en: "Deploy an identity", vi: "Deploy một định danh" },
        body: {
          en: "The VPS receives image@sha256, so rebuilds and mutable tags cannot change what is released.",
          vi: "VPS nhận image@sha256, vì vậy rebuild hay tag có thể đổi không thể thay thứ được phát hành.",
        },
      },
      {
        title: { en: "Let the host own the switch", vi: "Để host làm chủ lần chuyển" },
        body: {
          en: "A VPS-local script holds the lock, starts the inactive slot, probes it and decides whether to switch or roll back.",
          vi: "Script cục bộ trên VPS giữ lock, bật slot đang nghỉ, probe và quyết định chuyển hay rollback.",
        },
      },
    ],
    steps: [
      {
        id: "sync",
        label: { en: "Input", vi: "Đầu vào" },
        title: {
          en: "Turn upstream updates into a reviewable diff",
          vi: "Biến cập nhật upstream thành diff có thể review",
        },
        summary: {
          en: [
            "A scheduled or manual workflow fetches upstream, selects a release ref and opens a PR against the fork's ",
            { code: "prod" },
            " branch.",
          ],
          vi: [
            "Workflow chạy định kỳ hoặc thủ công fetch upstream, chọn release ref và mở PR vào branch ",
            { code: "prod" },
            " của fork.",
          ],
        },
        detail: {
          en: [
            "This keeps upstream application code and fork-only infrastructure visibly separate. Merging that PR is the explicit production trigger; it also leaves the exact version bump and conflicts in normal Git history.",
          ],
          vi: [
            "Cách này giữ code ứng dụng từ upstream và hạ tầng riêng của fork tách biệt rõ. Merge PR là trigger production có chủ đích; version bump và conflict cũng nằm lại trong lịch sử Git bình thường.",
          ],
        },
        proof: {
          label: "prod-sync-upstream.yml",
          href: `${repoAt}/.github/workflows/prod-sync-upstream.yml`,
        },
      },
      {
        id: "build",
        label: { en: "Build", vi: "Build" },
        title: {
          en: "Exercise the Bun runtime before publishing",
          vi: "Kiểm tra runtime Bun trước khi publish",
        },
        summary: {
          en: [
            "The multi-stage image installs with Bun, smoke-checks ",
            { code: "bun:sqlite" },
            ", builds the application and removes build-only material from the runtime stage.",
          ],
          vi: [
            "Image nhiều stage cài bằng Bun, smoke-check ",
            { code: "bun:sqlite" },
            ", build ứng dụng và loại vật liệu chỉ dùng lúc build khỏi runtime stage.",
          ],
        },
        detail: {
          en: [
            "The deployment workflow uses Buildx, pushes to GHCR and tests the final image. That matters because several failures I fixed upstream only existed at the boundary between Bun, native SQLite and the assembled container.",
          ],
          vi: [
            "Workflow deploy dùng Buildx, push lên GHCR và test image cuối. Điều này quan trọng vì nhiều lỗi tôi sửa upstream chỉ xuất hiện tại ranh giới giữa Bun, SQLite native và container đã lắp ráp.",
          ],
        },
        proof: { label: "Dockerfile.bun", href: `${repoAt}/Dockerfile.bun` },
      },
      {
        id: "digest",
        label: { en: "Artifact", vi: "Artifact" },
        title: {
          en: "Carry the immutable digest across the SSH boundary",
          vi: "Đưa digest bất biến qua ranh giới SSH",
        },
        summary: {
          en: [
            "After publication, the workflow resolves the pushed artifact and passes a fully qualified ",
            { code: "ghcr.io/…@sha256:…" },
            " reference to the VPS.",
          ],
          vi: [
            "Sau khi publish, workflow resolve artifact vừa push và truyền reference đầy đủ ",
            { code: "ghcr.io/…@sha256:…" },
            " sang VPS.",
          ],
        },
        detail: {
          en: [
            "A tag describes intent; a digest identifies bytes. Pinning the latter makes deployment records and rollback candidates reproducible even after a later build moves a tag.",
          ],
          vi: [
            "Tag mô tả ý định; digest định danh byte. Ghim theo digest giúp bản ghi deploy và ứng viên rollback tái lập được ngay cả khi build sau làm tag dịch chuyển.",
          ],
        },
        proof: { label: "prod-deploy.yml", href: `${repoAt}/.github/workflows/prod-deploy.yml` },
      },
      {
        id: "stage",
        label: { en: "Boundary", vi: "Ranh giới" },
        title: {
          en: "Stage infrastructure, do not execute a remote one-liner",
          vi: "Stage hạ tầng, không chạy một remote one-liner",
        },
        summary: {
          en: [
            "Actions packages the Compose file, deploy controller, Caddy config, backup and retention scripts, copies them to a staging directory, then invokes the VPS-local controller.",
          ],
          vi: [
            "Actions đóng gói Compose, deploy controller, cấu hình Caddy, script backup và retention, copy vào thư mục staging rồi gọi controller cục bộ trên VPS.",
          ],
        },
        detail: {
          en: [
            "The host, not the CI runner, owns runtime state: the deployment lock, current slot, previous digest, shared data path and recovery decisions. The network hop only delivers a requested release and its controller inputs.",
          ],
          vi: [
            "Host, không phải CI runner, làm chủ runtime state: deploy lock, slot hiện tại, digest trước, data path dùng chung và quyết định khôi phục. Network hop chỉ chuyển release cần triển khai cùng input cho controller.",
          ],
        },
        proof: { label: "infra/README.md", href: `${repoAt}/infra/README.md` },
      },
      {
        id: "switch",
        label: { en: "Release", vi: "Phát hành" },
        title: {
          en: "Warm the inactive slot, then move Caddy",
          vi: "Làm nóng slot nghỉ rồi mới chuyển Caddy",
        },
        summary: {
          en: [
            "The controller starts the inactive blue or green slot, waits for container health, probes through the proxy path and only then rewrites the active upstream.",
          ],
          vi: [
            "Controller bật slot blue hoặc green đang nghỉ, chờ container healthy, probe qua đường proxy rồi mới viết lại upstream đang active.",
          ],
        },
        detail: {
          en: [
            "After the switch, a stabilization window continues probing. Failure in that window restores the previous route and image. Existing streams are given a drain period before the old slot stops.",
          ],
          vi: [
            "Sau khi chuyển, cửa sổ stabilization tiếp tục probe. Nếu lỗi trong khoảng này, route và image cũ được khôi phục. Stream đang chạy có một khoảng drain trước khi slot cũ dừng.",
          ],
        },
        proof: { label: "infra/deploy.sh", href: `${repoAt}/infra/deploy.sh` },
      },
      {
        id: "ingress",
        label: { en: "Ingress", vi: "Ingress" },
        title: {
          en: "Keep the origin private and streaming-aware",
          vi: "Giữ origin riêng tư và hiểu streaming",
        },
        summary: {
          en: [
            "Cloudflared reaches Caddy over a private Docker network. Caddy's HTTP port is not published on the VPS host, and public TLS terminates at Cloudflare.",
          ],
          vi: [
            "Cloudflared truy cập Caddy qua Docker network riêng. HTTP port của Caddy không publish trên VPS host, còn public TLS kết thúc tại Cloudflare.",
          ],
        },
        detail: {
          en: [
            "Caddy avoids proxy read/write timeouts because model responses can stream for minutes, hides the internal liveness endpoint and routes the host-level Telegram webhook separately.",
          ],
          vi: [
            "Caddy không đặt proxy read/write timeout vì phản hồi model có thể stream nhiều phút, ẩn liveness endpoint nội bộ và route riêng webhook Telegram chạy ở host.",
          ],
        },
        proof: { label: "infra/caddy/Caddyfile", href: `${repoAt}/infra/caddy/Caddyfile` },
      },
      {
        id: "operate",
        label: { en: "Aftercare", vi: "Hậu kiểm" },
        title: {
          en: "Retain a rollback image and operate outside the app container",
          vi: "Giữ image rollback và vận hành bên ngoài app container",
        },
        summary: {
          en: [
            "Retention protects the current and previous digest instead of pruning by tag. Backups run SQLite integrity checks, while the Telegram operations bot is a host systemd service.",
          ],
          vi: [
            "Retention bảo vệ digest hiện tại và digest trước thay vì prune theo tag. Backup chạy SQLite integrity check, còn Telegram operations bot là systemd service ở host.",
          ],
        },
        detail: {
          en: [
            "Keeping control-plane tooling outside the application container means it survives an application restart. Its surface includes bounded deployment, rollback, status and log operations rather than arbitrary shell access.",
          ],
          vi: [
            "Đặt công cụ control-plane ngoài application container giúp nó sống qua lần restart ứng dụng. Bề mặt điều khiển gồm deploy, rollback, status và log có giới hạn thay vì mở arbitrary shell.",
          ],
        },
        proof: { label: "image-retention.sh", href: `${repoAt}/infra/image-retention.sh` },
      },
    ],
    limits: [
      {
        en: [
          "This is controlled blue-green deployment, not permanent high availability. Both slots overlap only during warm-up and stabilization because the application uses one shared SQLite database and has no leader election.",
        ],
        vi: [
          "Đây là blue-green deploy có kiểm soát, không phải high availability thường trực. Hai slot chỉ chồng nhau lúc warm-up và stabilization vì ứng dụng dùng một SQLite database chung và không có leader election.",
        ],
      },
      {
        en: [
          "Cloudflare, Caddy and health probes reduce exposure and bad releases; they do not make the single VPS or its disk redundant.",
        ],
        vi: [
          "Cloudflare, Caddy và health probe giảm bề mặt tấn công và release lỗi; chúng không tạo dự phòng cho VPS đơn hay ổ đĩa của nó.",
        ],
      },
      {
        en: [
          "The workflow proves the artifact and the switch path. It does not prove every provider integration, so upstream synchronization remains a reviewed change rather than an automatic production promise.",
        ],
        vi: [
          "Workflow chứng minh artifact và đường chuyển. Nó không chứng minh mọi provider integration, vì vậy đồng bộ upstream vẫn là thay đổi cần review chứ không phải lời hứa production tự động.",
        ],
      },
    ],
  },
] as const;

export function articleBySlug(slug: string): Article {
  const article = articles.find((entry) => entry.slug === slug);
  if (!article) throw new Error(`Unknown article slug: ${slug}`);
  return article;
}
