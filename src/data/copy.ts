import type { RichText } from "./contributions";
import type { L10n } from "./i18n";

export const home = {
  title: {
    en: "Nguyễn Viết Tuấn — backend systems & AI workflows",
    vi: "Nguyễn Viết Tuấn — hệ thống backend & luồng AI",
  } satisfies L10n,
  description: {
    en: "Backend developer in Hanoi. Explore public systems, AI workflows and historical upstream contributions through source-backed technical writing.",
    vi: "Lập trình viên backend tại Hà Nội. Khám phá hệ thống công khai, luồng AI và đóng góp upstream trong lịch sử qua bài viết kỹ thuật có dẫn chứng.",
  } satisfies L10n,
  headline: {
    en: "Backend systems. AI workflows. Built with evidence.",
    vi: "Hệ thống backend. Luồng AI. Dẫn chứng từ code.",
  } satisfies L10n,
  lede: {
    en: [
      "I work at the boundaries between application code, runtimes and operations. These are the systems I build, the trade-offs behind them, and the public source that lets you inspect the work.",
    ],
    vi: [
      "Tôi làm việc tại ranh giới giữa code ứng dụng, runtime và vận hành. Đây là những hệ thống tôi xây, những đánh đổi phía sau và source công khai để bạn tự xem xét công việc.",
    ],
  } satisfies L10n<RichText>,
  writingTitle: { en: "Inside the systems", vi: "Bên trong hệ thống" } satisfies L10n,
  writingNote: {
    en: "Architecture, failure boundaries and implementation decisions — with sources, not promises.",
    vi: "Kiến trúc, ranh giới sự cố và quyết định triển khai — có nguồn, không phải lời hứa.",
  } satisfies L10n,
  personalTitle: { en: "Selected systems", vi: "Hệ thống tiêu biểu" } satisfies L10n,
  personalNote: {
    en: "Current public work. Original projects and maintained forks are attributed separately; each card leads back to its repository and evidence.",
    vi: "Công việc công khai hiện tại. Dự án tự xây và fork đang phát triển được ghi công riêng; mỗi mục đều dẫn về repository và dẫn chứng.",
  } satisfies L10n,
  selectedTitle: { en: "Evidence upstream", vi: "Dẫn chứng từ upstream" } satisfies L10n,
  selectedNote: {
    en: "Historical merged contributions, separate from the current project catalogue. The figures below are calculated from the linked pull requests, not live repository counters.",
    vi: "Đóng góp đã merge trong lịch sử, tách biệt với catalogue dự án hiện tại. Các số dưới đây được tính từ pull request có liên kết, không phải bộ đếm repository trực tiếp.",
  } satisfies L10n,
  stackTitle: { en: "Tools with a source", vi: "Công cụ có dẫn chứng" } satisfies L10n,
  stackNote: {
    en: "Each tool links to public work: a current repository or a historical merged contribution, with its provenance visible.",
    vi: "Mỗi công cụ dẫn tới công việc công khai: repository hiện tại hoặc đóng góp đã merge trong lịch sử, với nguồn ghi rõ.",
  } satisfies L10n,
  contactTitle: {
    en: "Let’s work on the next system.",
    vi: "Cùng xây hệ thống tiếp theo.",
  } satisfies L10n,
};

export const work = {
  title: { en: "Work — Nguyễn Viết Tuấn", vi: "Dự án — Nguyễn Viết Tuấn" } satisfies L10n,
  description: {
    en: "Source-backed writing, current public repositories and historical merged upstream contributions by Nguyễn Viết Tuấn.",
    vi: "Bài viết có dẫn chứng, repository công khai hiện tại và đóng góp upstream đã merge trong lịch sử của Nguyễn Viết Tuấn.",
  } satisfies L10n,
  headline: { en: "Systems, explained.", vi: "Hệ thống, có lời giải." } satisfies L10n,
  lede: {
    en: "Follow the architecture, inspect the repository, or read a merged diff. Writing, personal work and upstream history are separate views of the same engineering practice.",
    vi: "Theo dõi kiến trúc, xem repository hoặc đọc diff đã merge. Bài viết, dự án cá nhân và lịch sử upstream là những góc nhìn riêng của cùng một cách làm kỹ thuật.",
  } satisfies L10n,
  writingNote: {
    en: "Long-form notes on mechanisms, decisions and limits. The source snapshot belongs to each article; it is not a claim about a live deployment.",
    vi: "Ghi chép dài về cơ chế, quyết định và giới hạn. Snapshot source thuộc về từng bài; đó không phải khẳng định về một deployment đang chạy.",
  } satisfies L10n,
  personalTitle: {
    en: "Public repository catalogue",
    vi: "Catalogue repository công khai",
  } satisfies L10n,
  personalNote: {
    en: "Ownership is explicit. A maintained fork is not an original upstream project, and an infrastructure integration does not claim authorship of the software it deploys.",
    vi: "Quyền tác giả được ghi rõ. Fork đang phát triển không phải dự án upstream tự viết, và tích hợp hạ tầng không nhận tác giả phần mềm được triển khai.",
  } satisfies L10n,
  scopeNote: {
    en: "Historical upstream work in OmniRoute. Every metric comes from the merged PR records below; these are not totals for the current personal repositories.",
    vi: "Công việc upstream trong lịch sử tại OmniRoute. Mọi số liệu lấy từ các PR đã merge bên dưới; đây không phải tổng của các repository cá nhân hiện tại.",
  } satisfies L10n,
  profileNote: {
    en: "Profile metadata, not a product case study.",
    vi: "Metadata hồ sơ, không phải case study sản phẩm.",
  } satisfies L10n,
};

export const contribution = {
  provenance: {
    en: "Historical merged upstream work. This contribution belongs to OmniRoute’s history, not to the current personal-project catalogue.",
    vi: "Đóng góp upstream đã merge trong lịch sử. Đóng góp này thuộc lịch sử OmniRoute, không phải catalogue dự án cá nhân hiện tại.",
  } satisfies L10n,
};

export const about = {
  title: { en: "About — Nguyễn Viết Tuấn", vi: "Giới thiệu — Nguyễn Viết Tuấn" } satisfies L10n,
  description: {
    en: "Backend developer in Hanoi working across application boundaries, runtimes, infrastructure and AI workflows.",
    vi: "Lập trình viên backend tại Hà Nội, làm việc qua ranh giới ứng dụng, runtime, hạ tầng và luồng AI.",
  } satisfies L10n,
  headline: {
    en: "Understand the boundary. Build the system.",
    vi: "Hiểu ranh giới. Xây hệ thống.",
  } satisfies L10n,
  bio: [
    {
      en: [
        "I’m Nguyễn Viết Tuấn, a backend developer based in Hanoi. My public work covers AI gateways, durable jobs and webhooks, resumable uploads, container operations and the infrastructure around them.",
      ],
      vi: [
        "Tôi là Nguyễn Viết Tuấn, lập trình viên backend tại Hà Nội. Công việc công khai của tôi trải từ AI gateway, job và webhook bền vững, upload tiếp tục được đến vận hành container và hạ tầng xung quanh.",
      ],
    },
    {
      en: [
        "I’m interested in what happens between components: who owns a request, what survives a crash, which signal is actually healthy, and where privilege should stop. The useful answer is usually a clear boundary and a mechanism another person can inspect.",
      ],
      vi: [
        "Tôi quan tâm đến điều xảy ra giữa các thành phần: ai sở hữu request, thứ gì tồn tại sau crash, tín hiệu nào thật sự phản ánh sức khỏe và đặc quyền nên dừng ở đâu. Câu trả lời hữu ích thường là một ranh giới rõ cùng cơ chế để người khác kiểm tra được.",
      ],
    },
    {
      en: [
        "This portfolio keeps original work, maintained forks and historical upstream contributions distinct. The writing shows the source and the limits alongside the design, so you can judge the work without relying on a title or a live counter.",
      ],
      vi: [
        "Portfolio này phân biệt dự án tự xây, fork đang phát triển và đóng góp upstream trong lịch sử. Bài viết đặt source và giới hạn cạnh thiết kế, để bạn đánh giá công việc mà không cần dựa vào chức danh hay bộ đếm trực tiếp.",
      ],
    },
  ] satisfies readonly L10n<RichText>[],
  principlesTitle: { en: "How I work", vi: "Cách tôi làm việc" } satisfies L10n,
  principles: [
    {
      title: { en: "Trace before changing", vi: "Truy vết trước khi đổi" },
      body: {
        en: "Find the failing boundary and understand the mechanism before choosing the patch. Keep the evidence close to the explanation.",
        vi: "Tìm ranh giới gây lỗi và hiểu cơ chế trước khi chọn bản vá. Đặt dẫn chứng gần lời giải thích.",
      },
    },
    {
      title: { en: "Make ownership explicit", vi: "Làm rõ trách nhiệm" },
      body: {
        en: "Separate control from traffic, privileged operations from the application, and durable intent from best-effort delivery.",
        vi: "Tách quản trị khỏi lưu lượng, thao tác đặc quyền khỏi ứng dụng, và ý định bền vững khỏi việc gửi theo best-effort.",
      },
    },
    {
      title: { en: "Leave a readable system", vi: "Để lại hệ thống đọc được" },
      body: {
        en: "Document the state, the recovery path and the limit of each guarantee. A system should remain understandable when something goes wrong.",
        vi: "Ghi lại trạng thái, đường phục hồi và giới hạn của mỗi bảo đảm. Hệ thống cần vẫn hiểu được khi có sự cố.",
      },
    },
  ] satisfies readonly { title: L10n; body: L10n }[],
  stackTitle: { en: "Tools in public work", vi: "Công cụ trong dự án công khai" } satisfies L10n,
  contactTitle: { en: "Start a conversation", vi: "Bắt đầu trao đổi" } satisfies L10n,
};

export interface ColophonBlock {
  readonly id: string;
  readonly title: L10n;
  readonly body: L10n<RichText>;
}

export const colophon = {
  title: { en: "Colophon — Nguyễn Viết Tuấn", vi: "Kỹ thuật — Nguyễn Viết Tuấn" } satisfies L10n,
  description: {
    en: "The Systems Observatory: Bun, Astro static output, bilingual typed content, local visualization and repository-owned delivery.",
    vi: "Systems Observatory: Bun, đầu ra Astro tĩnh, nội dung có kiểu song ngữ, trực quan cục bộ và triển khai do repository quản lý.",
  } satisfies L10n,
  headline: {
    en: "The system behind the observatory.",
    vi: "Hệ thống phía sau đài quan sát.",
  } satisfies L10n,
  lede: {
    en: [
      "The site is part of the work. Its content, visual system and delivery boundary are kept in the repository, without live GitHub requests or an application server in production.",
    ],
    vi: [
      "Bản thân website là một phần của công việc. Nội dung, visual system và ranh giới triển khai được giữ trong repository, không gọi GitHub trực tiếp hay chạy application server trên production.",
    ],
  } satisfies L10n<RichText>,
  blocks: [
    {
      id: "build",
      title: { en: "Static by construction", vi: "Tĩnh từ kiến trúc" },
      body: {
        en: [
          "Bun installs the dependencies and runs the development and build tools. Astro renders the shared views into static HTML; Bun’s native checker and Astro’s checker cover their respective source formats. Production serves the build from unprivileged Nginx, not a Bun application server. There is no client framework or hydration layer.",
        ],
        vi: [
          "Bun cài dependency và chạy công cụ phát triển, build. Astro render các view dùng chung thành HTML tĩnh; native checker của Bun và checker của Astro kiểm tra các định dạng source tương ứng. Production phục vụ bản build bằng Nginx không đặc quyền, không phải application server Bun. Không có client framework hay lớp hydration.",
        ],
      },
    },
    {
      id: "scene",
      title: { en: "HTML first, local visualization", vi: "HTML trước, trực quan cục bộ" },
      body: {
        en: [
          "The observatory starts as a static orbital SVG with ordinary project links. A lightweight controller imports local Three.js only for eligible desktop devices near the viewport: at least 960px wide, fine pointer, hover, no reduced-motion preference and no data-saving request. The renderer replaces the SVG only after a successful first frame, stops continuous motion while paused, hidden or offscreen, and releases its resources on teardown. Theme, link highlight and resize still update a paused frame. Eligibility changes and restored pages are re-evaluated; initialization failure or context loss retains the illustration and native links without retrying during that visit. Mobile and no-JavaScript visits never need the renderer to read or navigate.",
        ],
        vi: [
          "Đài quan sát bắt đầu bằng SVG quỹ đạo tĩnh và các liên kết dự án thông thường. Controller nhẹ chỉ import Three.js cục bộ cho desktop đủ điều kiện ở gần viewport: rộng ít nhất 960px, con trỏ chính xác, có hover, không yêu cầu giảm chuyển động hay tiết kiệm dữ liệu. Renderer chỉ thay SVG sau frame đầu thành công, dừng chuyển động liên tục khi pause, ẩn hoặc ngoài màn hình và giải phóng tài nguyên khi tháo bỏ. Theme, highlight liên kết và resize vẫn cập nhật frame đang pause. Điều kiện thiết bị và trang được khôi phục đều được xét lại; lỗi khởi tạo hay context loss giữ hình minh họa cùng link gốc, không thử lại trong lượt truy cập đó. Mobile và chế độ không JavaScript không cần renderer để đọc hay điều hướng.",
        ],
      },
    },
    {
      id: "type",
      title: { en: "Type and visual language", vi: "Chữ và ngôn ngữ thị giác" },
      body: {
        en: [
          "Systems Observatory uses orbital geometry, a restrained grid and solid surfaces rather than a simulated terminal. Manrope sets display type, Be Vietnam Pro carries the body, and IBM Plex Mono handles metadata and code. Fonts are self-hosted with unicode-range coverage, including Vietnamese. No font CDN, model download or remote texture is needed.",
        ],
        vi: [
          "Systems Observatory dùng hình học quỹ đạo, lưới tiết chế và bề mặt đủ đặc thay vì mô phỏng terminal. Manrope dùng cho display, Be Vietnam Pro cho nội dung và IBM Plex Mono cho metadata, code. Font tự host với phạm vi unicode-range, bao gồm tiếng Việt. Không cần CDN font, tải model hay texture từ xa.",
        ],
      },
    },
    {
      id: "content",
      title: { en: "One content model, two languages", vi: "Một mô hình nội dung, hai ngôn ngữ" },
      body: {
        en: [
          "Typed TypeScript data supplies English and Vietnamese versions to shared Astro views. English routes are unprefixed; Vietnamese routes live under /vi/. Locale switching preserves the page instead of returning to a language homepage. Repository ownership and pinned source evidence are editorial snapshots. Historical PR totals are computed from the recorded merged contributions, not fetched as live counters.",
        ],
        vi: [
          "Dữ liệu TypeScript có kiểu cung cấp bản tiếng Anh và tiếng Việt cho các view Astro dùng chung. Route tiếng Anh không có prefix; tiếng Việt nằm dưới /vi/. Đổi ngôn ngữ giữ nguyên trang thay vì đưa về trang chủ của ngôn ngữ đó. Quyền tác giả repository và source ghim commit là snapshot biên tập. Tổng PR trong lịch sử được tính từ các đóng góp đã merge được ghi nhận, không lấy từ bộ đếm trực tiếp.",
        ],
      },
    },
    {
      id: "theme",
      title: { en: "A readable light and dark edition", vi: "Bản sáng và tối đều đọc được" },
      body: {
        en: [
          "Light HTML is complete without JavaScript. A small synchronous bootstrap follows the operating-system preference unless an explicit choice exists; the binary theme control uses the portfolio-theme storage key. Storage denial does not prevent switching. Headings, native scrolling, visible keyboard focus and ordinary links remain the navigation model.",
        ],
        vi: [
          "HTML nền sáng hoàn chỉnh khi không có JavaScript. Bootstrap đồng bộ nhỏ theo tùy chọn hệ điều hành trừ khi đã có lựa chọn rõ; nút đổi hai giao diện dùng khóa lưu trữ portfolio-theme. Storage bị từ chối không ngăn đổi giao diện. Heading, cuộn gốc, focus bàn phím nhìn rõ và liên kết thông thường vẫn là mô hình điều hướng.",
        ],
      },
    },
    {
      id: "delivery",
      title: { en: "The actual delivery boundary", vi: "Ranh giới triển khai thực tế" },
      body: {
        en: [
          "The repository’s workflow builds an ARM64 image and deploys an immutable digest. The static Nginx container runs as a non-root user with a read-only filesystem, dropped capabilities and limited writable tmpfs mounts. It publishes no host port. The shared Cloudflare Tunnel reaches the site through Caddy and separate internal networks. The deployment script records image state, checks container and gateway health, and has a rollback path. This is the portfolio’s current Caddy architecture; the Traefik-based shared platform described in the VPS deployment article is a separate repository, not an infrastructure migration claimed here.",
        ],
        vi: [
          "Workflow của repository build image ARM64 và triển khai bằng digest bất biến. Container Nginx tĩnh chạy bằng user không phải root, filesystem chỉ đọc, bỏ capability và chỉ có các tmpfs giới hạn để ghi. Không publish port ra host. Cloudflare Tunnel dùng chung tới website qua Caddy và các mạng nội bộ tách biệt. Script triển khai ghi trạng thái image, kiểm tra health container cùng gateway và có đường rollback. Đây là kiến trúc Caddy hiện tại của portfolio; platform dùng chung dựa trên Traefik trong bài triển khai VPS thuộc repository khác, không phải một lần chuyển hạ tầng được khẳng định ở đây.",
        ],
      },
    },
    {
      id: "headers",
      title: { en: "The policy actually served", vi: "Policy thực sự được phục vụ" },
      body: {
        en: [
          "The policy below matches Nginx’s HTML and asset responses. Scripts, styles, fonts and the local visualization use the same origin; the listed Cloudflare Insights origins are explicit exceptions. There is no unsafe-eval, remote renderer CDN or worker origin added for the scene. A policy is one layer of the deployment boundary, not a security certification.",
        ],
        vi: [
          "Policy dưới đây khớp với response HTML và asset của Nginx. Script, style, font và trực quan cục bộ dùng cùng origin; các origin Cloudflare Insights được liệt kê là ngoại lệ rõ ràng. Scene không cần thêm unsafe-eval, CDN renderer từ xa hay worker origin. Policy là một lớp trong ranh giới triển khai, không phải chứng nhận an toàn.",
        ],
      },
    },
  ] satisfies readonly ColophonBlock[],
};

export const notFound = {
  title: { en: "404 — Nguyễn Viết Tuấn", vi: "404 — Nguyễn Viết Tuấn" } satisfies L10n,
  description: {
    en: "This signal does not lead to a page. Return to the portfolio or explore the work.",
    vi: "Tín hiệu này không dẫn tới trang nào. Trở về portfolio hoặc khám phá dự án.",
  } satisfies L10n,
  headline: { en: "Lost signal.", vi: "Mất tín hiệu." } satisfies L10n,
  body: {
    en: "The address is outside this observatory. There is still a clear route back to the systems, writing and source.",
    vi: "Địa chỉ này nằm ngoài đài quan sát. Vẫn còn đường rõ ràng để trở lại hệ thống, bài viết và source.",
  } satisfies L10n,
};
