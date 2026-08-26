import type { RichText } from "./contributions";
import type { L10n } from "./i18n";

export const home = {
  title: {
    en: "Nguyễn Viết Tuấn — backend developer",
    vi: "Nguyễn Viết Tuấn — lập trình viên backend",
  } satisfies L10n,
  description: {
    en: "Backend developer in Hanoi. Six patches merged into OmniRoute, an MIT AI gateway with 55,917 stars. This is what they fixed and why.",
    vi: "Lập trình viên backend tại Hà Nội. Sáu bản vá đã merge vào OmniRoute, một AI gateway MIT với 55.917 sao. Đây là những gì chúng sửa và vì sao.",
  } satisfies L10n,
  headline: {
    en: "I fix things that break underneath the application.",
    vi: "Tôi sửa những thứ vỡ ở bên dưới ứng dụng.",
  } satisfies L10n,
  lede: {
    en: [
      "Backend developer in Hanoi. Most of what I have shipped in public lives inside somebody else's codebase: startup crashes in a container that will not boot, admission control that lies about capacity, build failures that only appear inside a bundler. The pages below are the actual patches, with the diffs attached.",
    ],
    vi: [
      "Lập trình viên backend tại Hà Nội. Phần lớn những gì tôi đã đưa ra công khai nằm bên trong codebase của người khác: những cú crash lúc khởi động trong một container không chịu boot, cơ chế nạp request nói dối về tài nguyên, những lỗi build chỉ xuất hiện bên trong bundler. Các trang bên dưới là chính những bản vá đó, kèm nguyên diff.",
    ],
  } satisfies L10n<RichText>,
  selectedTitle: { en: "Selected contributions", vi: "Đóng góp tiêu biểu" } satisfies L10n,
  selectedNote: {
    en: "Three investigations, six merged pull requests. Each write-up follows the same shape: what the subsystem does, what was broken, what changed, and what evidence exists that it worked.",
    vi: "Ba lần truy vết, sáu pull request đã merge. Mỗi bài viết theo cùng một cấu trúc: hệ thống con đó làm gì, cái gì đã hỏng, đã thay đổi những gì, và bằng chứng nào cho thấy nó hiệu quả.",
  } satisfies L10n,
  personalTitle: { en: "Own work", vi: "Việc tự làm" } satisfies L10n,
  personalNote: {
    en: "Not upstream contributions — these run in a personal fork or on my own infrastructure, and are listed separately for that reason.",
    vi: "Không phải đóng góp upstream — những thứ này chạy trong fork cá nhân hoặc trên hạ tầng của riêng tôi, nên được liệt kê tách biệt.",
  } satisfies L10n,
  stackTitle: { en: "Tools", vi: "Công cụ" } satisfies L10n,
  stackNote: {
    en: "Marked entries appear in a patch that was merged upstream. The rest are used in personal or private work, and are not claimed as anything more.",
    vi: "Những mục có đánh dấu xuất hiện trong một bản vá đã merge upstream. Phần còn lại được dùng trong công việc cá nhân hoặc riêng tư, và không được nhận là gì hơn thế.",
  } satisfies L10n,
  contactTitle: { en: "Contact", vi: "Liên hệ" } satisfies L10n,
};

export const work = {
  title: {
    en: "Upstream contributions — Nguyễn Viết Tuấn",
    vi: "Đóng góp upstream — Nguyễn Viết Tuấn",
  } satisfies L10n,
  description: {
    en: "Six pull requests merged into OmniRoute: SSE admission control, a Bun N-API startup crash, and bundler resolution failures.",
    vi: "Sáu pull request đã merge vào OmniRoute: admission control cho SSE, một cú crash N-API lúc khởi động Bun, và các lỗi resolution của bundler.",
  } satisfies L10n,
  headline: { en: "Upstream contributions", vi: "Đóng góp upstream" } satisfies L10n,
  scopeNote: {
    en: "Focused fixes and runtime hardening, not feature epics. Diff sizes are as merged, and every link goes to the pull request itself.",
    vi: "Là những bản vá tập trung và việc siết chặt runtime, không phải các epic tính năng. Kích thước diff đúng như lúc merge, và mọi link đều trỏ thẳng tới pull request.",
  } satisfies L10n,
  personalTitle: { en: "Own work", vi: "Việc tự làm" } satisfies L10n,
};

export const about = {
  title: { en: "About — Nguyễn Viết Tuấn", vi: "Giới thiệu — Nguyễn Viết Tuấn" } satisfies L10n,
  description: {
    en: "Backend developer in Hanoi, working on runtimes, containers and the parts of a system that fail before the application starts.",
    vi: "Lập trình viên backend tại Hà Nội, làm việc với runtime, container và những phần của hệ thống hỏng trước cả khi ứng dụng khởi động.",
  } satisfies L10n,
  headline: { en: "About", vi: "Giới thiệu" } satisfies L10n,
  bio: [
    {
      en: [
        "I am a backend developer based in Hanoi. I have three public repositories, which is not much of a portfolio — so this site is built around the work itself instead: six patches merged into ",
        { link: "OmniRoute", href: "https://github.com/diegosouzapw/OmniRoute" },
        ", an MIT-licensed AI gateway maintained by more than 450 contributors.",
      ],
      vi: [
        "Tôi là một lập trình viên backend sống ở Hà Nội. Tôi có ba repository công khai, tự nó chưa phải là một portfolio — nên trang này được dựng quanh chính công việc: sáu bản vá đã merge vào ",
        { link: "OmniRoute", href: "https://github.com/diegosouzapw/OmniRoute" },
        ", một AI gateway giấy phép MIT do hơn 450 người cùng duy trì.",
      ],
    },
    {
      en: [
        "The work I gravitate towards sits below the application: why a container aborts before the server exists, why a limiter rejects work on an idle machine, why a build fails on a file that is supposed to be generated later. These problems are usually not visible from the code that reports them, and the fix is usually small once the cause is actually understood.",
      ],
      vi: [
        "Loại việc tôi bị cuốn vào nằm bên dưới tầng ứng dụng: vì sao một container abort trước khi server kịp tồn tại, vì sao một bộ giới hạn từ chối công việc trên một máy đang rảnh, vì sao một bản build thất bại vì một file lẽ ra sẽ được sinh ra sau. Những vấn đề này thường không nhìn thấy được từ đoạn code báo lỗi, và bản vá thường rất nhỏ một khi đã thật sự hiểu nguyên nhân.",
      ],
    },
    {
      en: [
        "I learn by fixing real systems in the open, where the patch has to survive review by people who maintain the code every day. That constraint is the reason the work is worth showing at all.",
      ],
      vi: [
        "Tôi học bằng cách sửa những hệ thống thật một cách công khai, nơi bản vá phải sống sót qua review của những người ngày nào cũng duy trì đoạn code đó. Chính ràng buộc ấy là lý do công việc này đáng để trưng ra.",
      ],
    },
  ] satisfies readonly L10n<RichText>[],
  principlesTitle: { en: "How I work", vi: "Cách tôi làm việc" } satisfies L10n,
  principles: [
    {
      title: { en: "Reproduce before patching", vi: "Tái hiện trước khi vá" } satisfies L10n,
      body: {
        en: "Every fix on this site started with a test that failed for the reported reason, so the patch has something to prove rather than something to claim.",
        vi: "Mọi bản vá trên trang này đều bắt đầu bằng một test thất bại đúng vì lý do đã báo cáo, để bản vá có thứ để chứng minh thay vì thứ để tuyên bố.",
      } satisfies L10n,
    },
    {
      title: { en: "Move failures earlier", vi: "Đẩy lỗi ra sớm hơn" } satisfies L10n,
      body: {
        en: "A crash at startup is better than a crash in production, and a failed build is better than both. Where possible I make the broken state impossible to produce.",
        vi: "Một cú crash lúc khởi động tốt hơn một cú crash trên production, và một bản build thất bại thì tốt hơn cả hai. Khi có thể, tôi làm cho trạng thái hỏng không thể tạo ra được.",
      } satisfies L10n,
    },
    {
      title: { en: "Leave the state readable", vi: "Để lại trạng thái đọc được" } satisfies L10n,
      body: {
        en: "A limiter nobody can inspect gets tuned by guesswork. If I add a control, I expose what it is currently doing.",
        vi: "Một bộ giới hạn không ai xem được thì sẽ bị chỉnh bằng cách đoán. Nếu tôi thêm một cơ chế điều khiển, tôi expose luôn trạng thái hiện tại của nó.",
      } satisfies L10n,
    },
  ],
  stackTitle: { en: "Tools", vi: "Công cụ" } satisfies L10n,
  contactTitle: { en: "Contact", vi: "Liên hệ" } satisfies L10n,
};

export interface ColophonBlock {
  readonly id: string;
  readonly title: L10n;
  readonly body: L10n<RichText>;
  readonly specs?: readonly { readonly key: string; readonly value: string }[];
}

export const colophon = {
  title: { en: "Colophon — Nguyễn Viết Tuấn", vi: "Kỹ thuật — Nguyễn Viết Tuấn" } satisfies L10n,
  description: {
    en: "How this site is built, hardened and shipped: Astro static output, a read-only container, digest-pinned deploys and automatic rollback.",
    vi: "Trang này được dựng, siết chặt và triển khai ra sao: Astro static, container read-only, deploy ghim theo digest và tự động rollback.",
  } satisfies L10n,
  headline: {
    en: "How this site is built and shipped",
    vi: "Trang này được dựng và triển khai ra sao",
  } satisfies L10n,
  lede: {
    en: [
      "This page is here because the deployment is part of the portfolio. Everything described below is in the repository and can be read.",
    ],
    vi: [
      "Trang này tồn tại vì bản thân việc triển khai cũng là một phần của portfolio. Mọi thứ mô tả bên dưới đều nằm trong repository và đọc được.",
    ],
  } satisfies L10n<RichText>,
  blocks: [
    {
      id: "build",
      title: { en: "Build", vi: "Build" },
      body: {
        en: [
          "Astro with static output and no client framework. There is not a single ",
          { code: "<script src>" },
          " on any page: the home page ships 2.4 KB of inline JavaScript, unminified, doing three things — applying the stored theme before paint, running the theme switch, and reassembling an email address that is stored split so it is not sitting in the HTML for scrapers. No hydration, no island, nothing to hydrate.",
        ],
        vi: [
          "Astro với static output và không dùng framework phía client. Không một trang nào có lấy một thẻ ",
          { code: "<script src>" },
          ": trang chủ gửi đi 2,4 KB JavaScript inline chưa nén, làm đúng ba việc — áp giao diện đã lưu trước khi paint, xử lý nút đổi giao diện, và ghép lại địa chỉ email vốn được lưu tách phần để nó không nằm sẵn trong HTML cho các bot thu thập. Không hydration, không island, không có gì để hydrate.",
        ],
      },
      specs: [
        { key: "Framework", value: "Astro 7, output: static" },
        { key: "Client JS", value: "2.4 KB inline, 0 bundles, no framework" },
        { key: "First load", value: "~205 KB, of which ~167 KB is type" },
        { key: "Fonts", value: "Self-hosted woff2, subset by unicode-range" },
      ],
    },
    {
      id: "type",
      title: { en: "Type", vi: "Chữ" },
      body: {
        en: [
          "Fraunces carries the display type — a variable serif whose ",
          { code: "WONK" },
          " axis deliberately breaks the letterforms out of their regular shapes. Newsreader sets the prose and IBM Plex Mono carries every number, label and code fragment. All three are self-hosted and all three include the Vietnamese subset, which is not optional on a site whose author's name is Nguyễn Viết Tuấn.",
        ],
        vi: [
          "Fraunces đảm nhiệm phần chữ display — một serif biến thiên có trục ",
          { code: "WONK" },
          " cố tình bẻ các con chữ ra khỏi hình dạng chuẩn của chúng. Newsreader dùng cho văn xuôi và IBM Plex Mono gánh mọi con số, nhãn và mảnh code. Cả ba đều tự host và cả ba đều có subset tiếng Việt — điều không thể bỏ qua trên một trang mà tên tác giả là Nguyễn Viết Tuấn.",
        ],
      },
    },
    {
      id: "image",
      title: { en: "Image", vi: "Image" },
      body: {
        en: [
          "A two-stage build compiles the site on ",
          { code: "node:24-alpine" },
          " and copies the output into ",
          { code: "nginx-unprivileged" },
          ", which runs as a non-root user. The filesystem is read-only, all capabilities are dropped, privilege escalation is disabled, and the only writable paths are three size-limited tmpfs mounts.",
        ],
        vi: [
          "Một bản build hai giai đoạn biên dịch trang trên ",
          { code: "node:24-alpine" },
          " rồi chép kết quả vào ",
          { code: "nginx-unprivileged" },
          ", chạy dưới một user không phải root. Filesystem là read-only, mọi capability bị loại bỏ, việc leo thang đặc quyền bị vô hiệu hoá, và ba tmpfs có giới hạn dung lượng là những đường ghi duy nhất.",
        ],
      },
      specs: [
        { key: "Runtime", value: "nginx-unprivileged:1.29-alpine, uid 101" },
        { key: "Filesystem", value: "read_only, cap_drop ALL, no-new-privileges" },
        { key: "Limits", value: "128 MB, 0.5 CPU, pids_limit 100" },
      ],
    },
    {
      id: "delivery",
      title: { en: "Delivery", vi: "Đường ra Internet" },
      body: {
        en: [
          "The container binds to ",
          { code: "127.0.0.1:18080" },
          " and is never published on a public interface. Traffic arrives through a dedicated Cloudflare Tunnel connector on a private Compose network, holding its own credentials as a file-mounted secret. The connector waits for the site's health check before it starts, so it cannot route to a container that is not ready.",
        ],
        vi: [
          "Container bind vào ",
          { code: "127.0.0.1:18080" },
          " và không bao giờ được publish ra interface công cộng. Lưu lượng đi vào qua một connector Cloudflare Tunnel riêng trên một mạng Compose nội bộ, giữ credential riêng dưới dạng secret gắn theo file. Connector chờ health check của trang trước khi khởi động, nên nó không thể route tới một container chưa sẵn sàng.",
        ],
      },
    },
    {
      id: "deploy",
      title: { en: "Deploy", vi: "Triển khai" },
      body: {
        en: [
          "Every push to ",
          { code: "main" },
          " type-checks, builds an ARM64 image, publishes it to the registry, and deploys it over SSH by immutable digest — the deploy script rejects a mutable tag outright. Deploys are serialised with a lock rather than queued, the active and previous digests are recorded, and a rollback is wired to the shell's own error trap. If the replacement fails either its container health check or a direct request to ",
          { code: "/healthz" },
          " within ninety seconds, the previous digest comes back. Old images are removed only after a successful health check, and never with a host-wide prune.",
        ],
        vi: [
          "Mỗi lần push lên ",
          { code: "main" },
          " sẽ type-check, build image ARM64, publish lên registry, rồi triển khai qua SSH theo digest bất biến — script deploy từ chối thẳng một tag có thể thay đổi. Các lượt deploy được tuần tự hoá bằng lock chứ không xếp hàng, digest hiện tại và trước đó đều được ghi lại, và cơ chế rollback gắn thẳng vào error trap của shell. Nếu bản thay thế thất bại ở health check của container hoặc ở một request trực tiếp tới ",
          { code: "/healthz" },
          " trong vòng chín mươi giây, digest trước đó sẽ quay lại. Image cũ chỉ bị xoá sau khi health check thành công, và không bao giờ bằng một lệnh prune toàn máy.",
        ],
      },
      specs: [
        { key: "Pinning", value: "Digest only, mutable tags rejected" },
        { key: "Concurrency", value: "flock, non-blocking" },
        { key: "Rollback", value: "Automatic, on ERR trap, 90 s health window" },
      ],
    },
    {
      id: "headers",
      title: { en: "Headers", vi: "Header" },
      body: {
        en: [
          "Self-hosting the fonts let the content security policy drop its third-party style and font origins entirely, so every stylesheet, script and font on this page comes from its own origin.",
        ],
        vi: [
          "Việc tự host font cho phép content security policy loại bỏ hoàn toàn các origin bên thứ ba cho style và font, nên mọi stylesheet, script và font trên trang này đều đến từ chính origin của nó.",
        ],
      },
    },
  ] satisfies readonly ColophonBlock[],
};

export const notFound = {
  title: { en: "404 — Nguyễn Viết Tuấn", vi: "404 — Nguyễn Viết Tuấn" } satisfies L10n,
  description: {
    en: "That page does not exist.",
    vi: "Trang đó không tồn tại.",
  } satisfies L10n,
  headline: { en: "No such page.", vi: "Không có trang này." } satisfies L10n,
  body: {
    en: "The address does not match anything here. The contributions index is probably what you wanted.",
    vi: "Địa chỉ này không khớp với thứ gì ở đây. Có lẽ thứ bạn cần là trang danh sách đóng góp.",
  } satisfies L10n,
};
