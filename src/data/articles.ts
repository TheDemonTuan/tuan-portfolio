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

export const articles: readonly Article[] = [
  {
    slug: "ai-gateway-control-and-data-planes",
    eyebrow: {
      en: "Maintained fork · AI systems",
      vi: "Fork đang phát triển · Hệ thống AI",
    },
    title: {
      en: "Separating control, traffic, and browser runtime in an AI gateway",
      vi: "Tách luồng quản trị, API và browser runtime trong AI gateway",
    },
    description: {
      en: "An evidence-led reading of the 9router fork: separate administrative authority, API-key traffic, browser execution, and the deployment proofs that connect them.",
      vi: "Đọc fork 9router từ dẫn chứng: phân tách quyền quản trị, lưu lượng API key, thực thi browser và các bằng chứng triển khai nối những phần đó lại.",
    },
    published: "2026-10-23",
    updated: "2026-10-23",
    readTime: {
      en: "7 min read",
      vi: "8 phút đọc",
    },
    stack: ["Bun", "Next.js", "SQLite", "Docker", "Traefik", "Cloudflare Access", "GitHub Actions"],
    lede: {
      en: [
        "An AI gateway looks like one endpoint from a coding client, but its authority is not one thing. Managing provider connections, forwarding a model request, opening an authenticated browser desktop, and deploying a new image require different permissions and different evidence. This article examines the public snapshot of my maintained ",
        {
          link: "9router fork",
          href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/README.md",
        },
        ". The underlying project is ",
        {
          link: "decolua/9router",
          href: "https://github.com/decolua/9router",
        },
        "; it is not an original gateway I built from scratch. The interesting engineering question here is how the fork documents its operating boundaries, and what its checked-in deployment caller actually authorizes—not whether upstream promotional claims sound impressive.",
      ],
      vi: [
        "Từ coding client, AI gateway trông như một endpoint, nhưng quyền hạn bên trong không phải một khối duy nhất. Quản lý kết nối provider, chuyển tiếp model request, mở desktop browser đã đăng nhập và triển khai image mới cần những quyền khác nhau, cùng những bằng chứng khác nhau. Bài viết đọc snapshot công khai của ",
        {
          link: "fork 9router tôi đang phát triển",
          href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/README.md",
        },
        ". Dự án nền là ",
        {
          link: "decolua/9router",
          href: "https://github.com/decolua/9router",
        },
        "; đây không phải gateway nguyên bản do tôi xây từ đầu. Câu hỏi kỹ thuật đáng quan tâm là fork mô tả ranh giới vận hành ra sao, và deployment caller đã commit thực sự cấp quyền gì—không phải lời quảng bá upstream nghe hấp dẫn đến mức nào.",
      ],
    },
    architecture: [
      "Admin identity → control plane",
      "API key → gateway data plane",
      "Gateway → browser runtime / optional RTK",
      "Companion → local Codex tools",
      "Immutable image → host engine → route ACK",
    ],
    principles: [
      {
        title: {
          en: "Authority follows the operation",
          vi: "Quyền đi theo thao tác",
        },
        body: {
          en: "A key that can send model traffic must not automatically administer browser profiles or obtain a desktop lease. Separate interfaces make that distinction reviewable.",
          vi: "Key được gửi model traffic không mặc nhiên có quyền quản trị browser profile hay nhận desktop lease. Tách interface giúp việc phân biệt quyền có thể được review cụ thể.",
        },
      },
      {
        title: {
          en: "Optional work stays optional",
          vi: "Tối ưu tùy chọn phải thật sự tùy chọn",
        },
        body: {
          en: "RTK compression is a guarded transformation of eligible output, not a prerequisite for routing and not a promise of lossless reduction or lower bills.",
          vi: "Nén RTK là phép biến đổi có điều kiện trên output đủ tiêu chuẩn, không phải điều kiện để định tuyến, cũng không phải cam kết giảm dữ liệu không mất mát hay giảm hóa đơn.",
        },
      },
      {
        title: {
          en: "Name the observation",
          vi: "Gọi đúng tên điều đã quan sát",
        },
        body: {
          en: "A synthetic runtime gate, a native sandbox image gate, and a real account/Codex exercise answer different questions. Their results cannot be substituted for one another.",
          vi: "Gate runtime tổng hợp, gate image với sandbox native và bài thử tài khoản/Codex thật trả lời những câu hỏi khác nhau. Không thể dùng kết quả của chúng thay thế lẫn nhau.",
        },
      },
    ],
    steps: [
      {
        id: "upstream",
        label: {
          en: "01 · Provenance",
          vi: "01 · Nguồn gốc",
        },
        title: {
          en: "Start with the fork boundary",
          vi: "Bắt đầu từ ranh giới của fork",
        },
        summary: {
          en: [
            "The public repository is a maintained fork of decolua/9router. Its README describes a gateway that translates provider formats, tracks quota, refreshes tokens, and serves coding clients. Those capabilities belong to a continuing upstream project, not to an invented personal product history.",
          ],
          vi: [
            "Repository công khai là fork đang được phát triển từ decolua/9router. README mô tả gateway chuyển đổi định dạng provider, theo dõi quota, refresh token và phục vụ coding client. Các khả năng đó thuộc một dự án upstream đang tiếp tục phát triển, không phải lịch sử sản phẩm cá nhân được dựng lại.",
          ],
        },
        detail: {
          en: [
            "The useful scope for this article is narrower: operational separation, the application-to-platform deployment contract, and the documented ChatGPT Web runtime boundaries. The README identifies Bun, Next.js, SQLite and SSE, and credits other work behind optional token savers. Attribution matters because a fork can contain substantial changes without making its entire ancestry original. It also prevents feature lists from becoming outcome claims. Provider availability, subscription limits, fallback behavior and account permissions still depend on external systems. I do not carry the upstream phrases about unlimited access, free operation or uninterrupted service into a personal reliability claim. Where only the deployment guide describes a mechanism, I call it documented design; reading that guide is not the same as observing a running service or reviewing every authorization handler. This distinction keeps the explanation useful without overstating what the public snapshot proves.",
          ],
          vi: [
            "Phạm vi hữu ích của bài hẹp hơn: phân tách vận hành, hợp đồng triển khai giữa ứng dụng với platform, và ranh giới ChatGPT Web runtime đã được mô tả. README nêu Bun, Next.js, SQLite và SSE, đồng thời ghi công những công trình phía sau các token saver tùy chọn. Attribution quan trọng vì một fork có thể chứa nhiều thay đổi mà không biến toàn bộ nguồn gốc thành mã nguyên bản. Nó cũng ngăn danh sách tính năng bị hiểu thành kết quả vận hành. Khả năng truy cập provider, giới hạn subscription, fallback và quyền tài khoản vẫn phụ thuộc hệ thống bên ngoài. Tôi không chuyển những cụm từ upstream về truy cập vô hạn, miễn phí hay dịch vụ không gián đoạn thành cam kết độ tin cậy cá nhân. Khi cơ chế chỉ xuất hiện trong deployment guide, tôi gọi đó là thiết kế được tài liệu hóa; đọc tài liệu không đồng nghĩa quan sát dịch vụ đang chạy hoặc review mọi authorization handler. Phân biệt như vậy giúp diễn giải có ích mà không phóng đại điều snapshot công khai chứng minh.",
          ],
        },
        proof: {
          label: "9router README · pinned snapshot",
          href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/README.md",
        },
      },
      {
        id: "domains",
        label: {
          en: "02 · Ingress",
          vi: "02 · Ingress",
        },
        title: {
          en: "Give administration and API traffic different doors",
          vi: "Cho quản trị và API traffic những cửa vào khác nhau",
        },
        summary: {
          en: [
            "The deployment guide separates an Access-protected administrative hostname from a client-facing API hostname. A coding client authenticates with an application API key; it should not have to complete an interactive Access login just to send an API request.",
          ],
          vi: [
            "Deployment guide tách hostname quản trị được Access bảo vệ khỏi hostname API phục vụ client. Coding client xác thực bằng API key của ứng dụng; nó không nên phải hoàn thành đăng nhập Access tương tác chỉ để gửi API request.",
          ],
        },
        detail: {
          en: [
            "Both documented ingress paths pass through Cloudflare Tunnel and Traefik, but they do not expose the same surface. The administrative path permits dashboard assets and administration APIs. The API path is described as allowing the selected model-facing route families while denying the web UI and administration APIs, with edge rate limiting and application key validation. Turning off Access on the API hostname therefore does not mean turning off authentication: it moves the relevant authentication boundary to the gateway's API-key contract. Conversely, passing Access for the dashboard should not turn a client key into administrator identity. The guide further requires verified dashboard or Access JWT identity for runtime administration, and same-origin checks for mutations. These are documented controls, not a claim that a hostname alone provides isolation. Their correctness depends on the edge rules and application checks agreeing. Keeping the surfaces separate makes that agreement inspectable and makes an accidental administration route on the public API host a concrete policy error.",
          ],
          vi: [
            "Hai đường ingress được mô tả đều qua Cloudflare Tunnel và Traefik, nhưng không mở cùng một bề mặt. Đường quản trị cho phép dashboard assets và API quản trị. Đường API được mô tả chỉ cho các nhóm route phục vụ model đã chọn, chặn web UI cùng API quản trị, kết hợp rate limit tại edge và kiểm tra key trong ứng dụng. Vì vậy tắt Access trên hostname API không có nghĩa tắt xác thực: ranh giới xác thực phù hợp được chuyển về hợp đồng API key của gateway. Ngược lại, đi qua Access để vào dashboard không nên biến client key thành danh tính quản trị. Tài liệu còn yêu cầu danh tính dashboard hoặc Access JWT đã được xác minh cho quản trị runtime, và kiểm tra cùng origin đối với mutation. Đây là những kiểm soát được mô tả, không phải tuyên bố một hostname tự tạo ra cách ly. Tính đúng đắn phụ thuộc edge rules và application checks thống nhất với nhau. Tách bề mặt khiến sự thống nhất đó có thể kiểm tra được, và biến việc vô tình mở route quản trị trên API host thành lỗi policy cụ thể.",
          ],
        },
        proof: {
          label: "DEPLOYMENT.md · split-domain security matrix",
          href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/DEPLOYMENT.md",
        },
      },
      {
        id: "runtime",
        label: {
          en: "03 · Execution",
          vi: "03 · Thực thi",
        },
        title: {
          en: "Separate control, data, desktop, and local tools",
          vi: "Tách control, data, desktop và công cụ cục bộ",
        },
        summary: {
          en: [
            "ChatGPT Web adds a browser-owning runtime, not a reason to give the dashboard browser credentials. The guide describes separate DATA and ADMIN tokens, a private desktop lease, and a companion on the user's Codex machine. Each boundary has a different owner.",
          ],
          vi: [
            "ChatGPT Web bổ sung runtime giữ browser, không tạo lý do đưa browser credentials cho dashboard. Tài liệu mô tả DATA token và ADMIN token riêng, desktop lease riêng tư, cùng companion trên máy Codex của người dùng. Mỗi ranh giới có một chủ thể khác nhau.",
          ],
        },
        detail: {
          en: [
            "In the documented design, the dashboard manages canonical profile IDs and diagnostics through the gateway; it does not receive the runtime URL, bearer tokens, ChatGPT cookies or desktop password. Login and human challenges happen on the separate desktop, without a public browser-control server. Opening diagnostics is not permission to send a real model turn: browser smoke is explicitly operator-triggered. The runtime owns the browser, tunnel and broker, while the companion connects the local Codex side through loopback and a provisioned public-key identity. The runtime is not described as executing the user's shell tools itself. That separation matters when interpreting a disconnected stream: the guide treats it as detaching an observer, not authority to replay a send or cancel the owning turn. Revision checks on settings and operation fences on lifecycle actions address another boundary—concurrent administration must not silently interrupt active work. These details come from the operating design, not an assertion that I exercised private staging or inspected every runtime implementation path.",
          ],
          vi: [
            "Trong thiết kế được mô tả, dashboard quản lý canonical profile ID và diagnostics qua gateway; nó không nhận runtime URL, bearer token, ChatGPT cookie hay desktop password. Đăng nhập và human challenge diễn ra trên desktop riêng, không thông qua browser-control server công khai. Mở diagnostics không đồng nghĩa cho phép gửi model turn thật: browser smoke phải do operator chủ động kích hoạt. Runtime giữ browser, tunnel và broker, còn companion nối phía Codex cục bộ qua loopback với danh tính public key đã provision. Runtime không được mô tả là tự thực thi shell tool của người dùng. Sự phân tách này quan trọng khi diễn giải stream bị ngắt: tài liệu coi đó là tách observer, không phải quyền phát lại thao tác gửi hay hủy turn đang có chủ sở hữu. Revision check khi đổi settings và operation fence cho lifecycle action giải quyết một ranh giới khác—quản trị đồng thời không được âm thầm ngắt công việc đang chạy. Những chi tiết này đến từ thiết kế vận hành, không phải khẳng định tôi đã chạy private staging hay kiểm tra mọi đường thực thi runtime.",
          ],
        },
        proof: {
          label: "DEPLOYMENT.md · runtime and companion boundaries",
          href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/DEPLOYMENT.md",
        },
      },
      {
        id: "delivery",
        label: {
          en: "04 · Delivery",
          vi: "04 · Triển khai",
        },
        title: {
          en: "Request a release; do not upload a host script",
          vi: "Yêu cầu một bản phát hành; không tải host script lên",
        },
        summary: {
          en: [
            "The checked-in caller runs application verification, delegates image construction to a SHA-pinned platform workflow, and deploys the resulting immutable image reference from a production-environment job. The application manifest declares the image repository, ARM64 platform, health endpoint and blue-green strategy.",
          ],
          vi: [
            "Caller đã commit chạy kiểm tra ứng dụng, giao build image cho platform workflow pin SHA, rồi triển khai immutable image reference từ job có environment production. Manifest ứng dụng khai báo image repository, nền tảng ARM64, health endpoint và chiến lược blue-green.",
          ],
        },
        detail: {
          en: [
            "The ",
            {
              link: "manifest",
              href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/.deploy/app.yml",
            },
            " contains no host script or browser-runtime component; it declares the app and optional RTK image. The workflow pins the platform release at 04e99424be880398513300e23162ff840d757dd9, whereas DEPLOYMENT.md still names 630272ccb6c4377748e4b153d1784586ff8c6602. The checked-in caller is the evidence for its current pin; the document is not proof that all installed profiles match. The guide describes host-side cutover as requiring both the selected slot and a fresh route generation in two consecutive public acknowledgements. That checks more than container readiness, but still only proves the named route observation. RTK remains a separate optional optimization: the README describes guarded local filters as well as an optional Rust sidecar, so a missing sidecar does not mean all local filtering disappears. HTTP success does not prove useful compression, and the documented transformations are not lossless. Neither deployment acceptance nor a sidecar health check establishes token savings on a real workload.",
          ],
          vi: [
            "",
            {
              link: "Manifest",
              href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/.deploy/app.yml",
            },
            " không chứa host script hoặc component browser runtime; nó khai báo ứng dụng và image RTK tùy chọn. Workflow pin platform release tại 04e99424be880398513300e23162ff840d757dd9, trong khi DEPLOYMENT.md vẫn nêu 630272ccb6c4377748e4b153d1784586ff8c6602. Caller đã commit là bằng chứng cho pin hiện tại của nó; tài liệu không chứng minh mọi profile đã cài đều khớp. Guide mô tả cutover phía host phải quan sát cả slot được chọn lẫn route generation mới trong hai acknowledgement công khai liên tiếp. Kiểm tra đó nhiều hơn container readiness, nhưng vẫn chỉ chứng minh quan sát route đã nêu. RTK tiếp tục là tối ưu tùy chọn tách riêng: README mô tả local filter có guard bên cạnh Rust sidecar tùy chọn, nên thiếu sidecar không đồng nghĩa mọi local filtering biến mất. HTTP thành công không chứng minh nén hữu ích, và các phép biến đổi được mô tả không phải lossless. Cả deployment acceptance lẫn sidecar health check đều không xác lập mức tiết kiệm token trên workload thật.",
          ],
        },
        proof: {
          label: "deploy.yml · pinned build and deployment caller",
          href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/.github/workflows/deploy.yml",
        },
      },
      {
        id: "evidence",
        label: {
          en: "05 · Evidence",
          vi: "05 · Dẫn chứng",
        },
        title: {
          en: "Keep synthetic gates distinct from live account E2E",
          vi: "Phân biệt gate tổng hợp với E2E tài khoản thật",
        },
        summary: {
          en: [
            "The guide explicitly labels its offline ChatGPT DOM and outer-observer fixtures synthetic. They can exercise protocol and lifecycle decisions without establishing that a real account, real Codex process, native connector and local tools completed the same path together.",
          ],
          vi: [
            "Guide ghi rõ fixture ChatGPT DOM và outer observer trong bài thử offline là tổng hợp. Chúng có thể kiểm tra quyết định protocol và lifecycle mà chưa xác lập rằng tài khoản thật, tiến trình Codex thật, native connector và công cụ cục bộ đã cùng hoàn thành một đường đi.",
          ],
        },
        detail: {
          en: [
            "There are several deliberately different gates. Offline scripts model interactions; a native image gate checks the real sandboxed Linux container on the required architectures; private live staging needs an authorized account, connector workspace, compatible Codex and separately provisioned identities. Missing prerequisites must block the relevant gate rather than turn into a passing skip. Even a successful live fixture would not automatically cover every manual approval, multipart, compaction or upgrade case in the documented matrix. The checked-in production manifest does not declare the browser-runtime component, and the guide reserves activation for a reviewed platform release and operator authorization. It would therefore be inaccurate to turn the existence of runtime documentation into a claim of production activation. This article records the separation and the evidence requirements. It reports neither a new live account exercise nor a latency, availability or savings measurement. That is the useful boundary: explain what a check means before deciding what a green result allows an operator to do.",
          ],
          vi: [
            "Có nhiều gate được cố ý giữ khác nhau. Script offline mô hình hóa tương tác; native image gate kiểm tra Linux container với sandbox thật trên những architecture cần thiết; private live staging cần tài khoản được cấp quyền, connector workspace, Codex tương thích và các danh tính được provision riêng. Thiếu prerequisite phải chặn gate tương ứng thay vì biến thành skip được tính là pass. Ngay cả live fixture thành công cũng không tự bao phủ mọi tình huống approval thủ công, multipart, compaction hay upgrade trong matrix đã mô tả. Production manifest đã commit không khai báo component browser runtime, còn guide dành việc activation cho platform release đã review và sự cho phép của operator. Vì vậy, biến sự tồn tại của tài liệu runtime thành tuyên bố đã activate production sẽ không chính xác. Bài viết ghi nhận sự phân tách và yêu cầu bằng chứng. Nó không báo cáo bài thử tài khoản thật mới, cũng không đưa ra số đo latency, availability hay mức tiết kiệm. Ranh giới hữu ích là như vậy: giải thích check có nghĩa gì trước khi quyết định kết quả xanh cho phép operator làm gì.",
          ],
        },
        proof: {
          label: "DEPLOYMENT.md · offline, native and live activation gates",
          href: "https://github.com/TheDemonTuan/9router/blob/2c6cd8e5a351ef72535ec50d77cad48767d05ebf/DEPLOYMENT.md",
        },
      },
    ],
    limits: [
      {
        en: [
          "Source boundary: README and DEPLOYMENT.md support the runtime and ingress design described here; the manifest and workflow support the caller-specific implementation claims. This is not a complete authorization audit, penetration test, or observation of a private deployment.",
        ],
        vi: [
          "Ranh giới nguồn: README và DEPLOYMENT.md hỗ trợ thiết kế runtime cùng ingress được mô tả; manifest và workflow hỗ trợ nhận định cụ thể về implementation của caller. Đây không phải audit toàn bộ authorization, penetration test hay quan sát một deployment riêng tư.",
        ],
      },
      {
        en: [
          "Operational boundary: route ACKs do not prove provider availability, a working subscription, every stream surviving a cutover, or all shared-edge writers obeying the same lock. Browser-runtime activation, real account E2E and migration-safe rollback require their own evidence.",
        ],
        vi: [
          "Ranh giới vận hành: route ACK không chứng minh provider luôn sẵn sàng, subscription hoạt động, mọi stream sống qua cutover hay mọi bên ghi shared edge cùng tuân thủ một lock. Activation browser runtime, E2E tài khoản thật và rollback an toàn với migration đều cần bằng chứng riêng.",
        ],
      },
    ],
  },
  {
    slug: "blue-green-deploys-on-a-shared-vps",
    eyebrow: {
      en: "Original project · Delivery systems",
      vi: "Dự án tự xây · Hệ thống triển khai",
    },
    title: {
      en: "Blue-green delivery on a shared VPS",
      vi: "Triển khai blue-green trên VPS dùng chung",
    },
    description: {
      en: "Moving deployment policy out of individual application scripts: immutable requests, identity-aware health checks, generation acknowledgements, and explicit recovery on a shared host.",
      vi: "Đưa policy triển khai ra khỏi script riêng từng ứng dụng: request bất biến, health check nhận diện instance, generation acknowledgement và recovery rõ ràng trên host dùng chung.",
    },
    published: "2026-10-23",
    updated: "2026-10-23",
    readTime: {
      en: "7 min read",
      vi: "8 phút đọc",
    },
    stack: [
      "Python",
      "Bash",
      "Docker Compose",
      "Traefik",
      "systemd",
      "GitHub Actions",
      "Linux ARM64",
    ],
    lede: {
      en: [
        "A per-application deployment script can look manageable until several applications share one Docker daemon and one edge proxy. Each script then carries its own answer to artifact identity, route ownership, partial failure and long-lived connections. My vps-deploy repository moves those decisions into a shared platform: application CI requests a bounded operation; a host-owned engine validates and executes it. The blue-green path examined here is the single-image application strategy, not every strategy now present in the repository. It develops the immutable-image and health-gated deployment subject previously written about on this site, without treating an older application repository as a current project. This is a source-backed explanation of the platform, not a migration of the portfolio's own delivery infrastructure.",
      ],
      vi: [
        "Script triển khai riêng từng ứng dụng có vẻ dễ quản lý cho đến khi nhiều ứng dụng cùng dùng một Docker daemon và một edge proxy. Khi đó mỗi script tự mang cách xử lý artifact identity, quyền sở hữu route, lỗi dở dang và kết nối dài. Repository vps-deploy của tôi đưa những quyết định đó vào platform dùng chung: CI ứng dụng yêu cầu một thao tác có giới hạn; engine do host quản lý kiểm tra và thực thi. Đường blue-green được đọc ở đây là strategy ứng dụng một image, không phải mọi strategy hiện có trong repository. Bài tiếp tục chủ đề immutable image và triển khai qua health gate từng được viết trên website, nhưng không coi repository ứng dụng cũ là dự án hiện tại. Đây là diễn giải platform dựa trên nguồn, không phải chuyển hạ tầng triển khai của chính portfolio sang platform này.",
      ],
    },
    architecture: [
      "Application CI → immutable request",
      "Restricted SSH → detached systemd job",
      "Per-app lock → candidate identity / health",
      "Shared route lock → atomic publish",
      "Two slot + generation ACKs → commit",
      "Old slot → drain / retained rollback",
    ],
    principles: [
      {
        title: {
          en: "CI requests; the host decides",
          vi: "CI yêu cầu; host quyết định",
        },
        body: {
          en: "The application supplies release identity, not arbitrary host paths or an uploaded privileged script. Root-owned registration determines the executable policy.",
          vi: "Ứng dụng cung cấp danh tính release, không cung cấp host path tùy ý hay script đặc quyền tải lên. Registration do root sở hữu quyết định policy được thực thi.",
        },
      },
      {
        title: {
          en: "Readiness has multiple identities",
          vi: "Readiness có nhiều lớp danh tính",
        },
        body: {
          en: "A healthy process, the intended image, the selected slot and the edge's current generation are separate facts. Cutover checks have to connect them.",
          vi: "Tiến trình healthy, image mong muốn, slot được chọn và generation hiện tại ở edge là những dữ kiện riêng. Cutover check phải nối chúng lại.",
        },
      },
      {
        title: {
          en: "Uncertainty becomes state",
          vi: "Điều chưa chắc chắn phải thành state",
        },
        body: {
          en: "Durable intent and recovery_required preserve unresolved work. A broken SSH session or an ambiguous route is not permission to run a second deployment blindly.",
          vi: "Durable intent và recovery_required giữ lại công việc chưa giải quyết. SSH bị ngắt hay route không rõ ràng không phải lý do để chạy mù một deployment thứ hai.",
        },
      },
    ],
    steps: [
      {
        id: "request",
        label: {
          en: "01 · Trust boundary",
          vi: "01 · Ranh giới tin cậy",
        },
        title: {
          en: "Accept a request, not a remote shell",
          vi: "Nhận request, không nhận remote shell",
        },
        summary: {
          en: [
            "The platform README describes a per-application SSH identity restricted by a forced command. The transport carries JSON into the host controller rather than granting CI an interactive shell or permission to upload and execute application-owned deployment code.",
          ],
          vi: [
            "README platform mô tả SSH identity riêng từng ứng dụng, bị giới hạn bằng forced command. Transport đưa JSON vào host controller thay vì cấp interactive shell cho CI hoặc cho phép tải lên rồi thực thi deployment code do ứng dụng sở hữu.",
          ],
        },
        detail: {
          en: [
            "The implementation gives that request a strict shape. core.py rejects duplicate JSON keys, unknown or missing fields, an application binding mismatch and malformed identifiers. Mutating requests name an operation, component, platform release, source commit and registered manifest hash; deploy also names the image. These fields are not an instruction language. The host chooses trusted release files and registered resources rather than accepting a script, slot or filesystem destination from the caller. In deployctl, request bytes are saved before dispatch. Reusing a request ID requires identical canonical bytes, so the same ID cannot quietly stand for a different release. This creates a useful recovery handle when the transport fails. The documented forced-command setup is an additional operating prerequisite: validation code alone does not prove that an actual SSH account has been installed correctly. The important architectural change from application-specific scripts is that each application no longer defines its own privileged vocabulary on the shared host.",
          ],
          vi: [
            "Implementation quy định hình dạng request chặt chẽ. core.py từ chối JSON key trùng, field lạ hoặc thiếu, application binding không khớp và identifier sai định dạng. Mutating request nêu operation, component, platform release, source commit và hash manifest đã đăng ký; deploy còn nêu image. Các field này không tạo thành ngôn ngữ chỉ thị. Host chọn trusted release file và tài nguyên đã đăng ký, thay vì nhận script, slot hay đích filesystem từ caller. Trong deployctl, request bytes được lưu trước dispatch. Dùng lại request ID đòi hỏi canonical bytes giống hệt, nên cùng ID không thể âm thầm đại diện cho release khác. Đây là điểm bám hữu ích để recovery khi transport lỗi. Cấu hình forced command được mô tả vẫn là prerequisite vận hành bổ sung: riêng validation code không chứng minh SSH account thực tế đã được cài đúng. Thay đổi kiến trúc quan trọng so với script riêng từng ứng dụng là mỗi ứng dụng không còn tự định nghĩa bộ lệnh đặc quyền của mình trên host dùng chung.",
          ],
        },
        proof: {
          label: "core.py · bounded request schema and registration",
          href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/core.py",
        },
      },
      {
        id: "artifact",
        label: {
          en: "02 · Artifact",
          vi: "02 · Artifact",
        },
        title: {
          en: "Bind the image to a registered deployment policy",
          vi: "Gắn image với deployment policy đã đăng ký",
        },
        summary: {
          en: [
            "For this blue-green strategy, the request must contain the exact registered image repository followed by a sha256 digest. A mutable tag is not accepted as release identity. The requested platform release and manifest hash must also match the host's registered configuration.",
          ],
          vi: [
            "Với strategy blue-green này, request phải chứa đúng image repository đã đăng ký, theo sau bằng sha256 digest. Mutable tag không được chấp nhận làm release identity. Platform release và manifest hash được yêu cầu cũng phải khớp cấu hình đã đăng ký trên host.",
          ],
        },
        detail: {
          en: [
            "There are two different checks here. Parsing establishes that the image reference has the right repository and digest shape. Registration then binds what may run to operator-reviewed policy: the manifest is compared structurally and exactly with the release registration, and its stored bytes are hashed for request matching. Host paths are derived from trusted configuration rather than supplied in that manifest. After pulling, image inspection verifies Linux and ARM64 identity for the production path, and requires the digest reference to appear in the local image's RepoDigests. This closes a gap between a syntactically valid reference and the image Docker actually knows. It is not, by itself, a signature or supply-chain attestation. The controller's source_sha field is validated as an identifier; one must not mistake that field alone for independent proof that particular source bytes produced the image. The README assigns build and smoke responsibilities to the reusable workflow. Artifact admission and build provenance are related, but they are not interchangeable claims.",
          ],
          vi: [
            "Ở đây có hai kiểm tra khác nhau. Parsing xác lập image reference có đúng repository và hình dạng digest. Registration sau đó gắn nội dung được chạy với policy đã được operator review: manifest được so sánh cấu trúc chính xác với release registration, còn bytes lưu trên host được hash để đối chiếu request. Host path được suy ra từ trusted configuration chứ không do manifest đó cung cấp. Sau khi pull, image inspection xác minh danh tính Linux và ARM64 cho production path, đồng thời yêu cầu digest reference xuất hiện trong RepoDigests của local image. Điều này khép khoảng trống giữa reference đúng cú pháp và image Docker thực sự biết. Tự nó không phải signature hay supply-chain attestation. Field source_sha của controller được kiểm tra như identifier; không nên nhầm riêng field đó với bằng chứng độc lập rằng source bytes cụ thể đã tạo ra image. README giao trách nhiệm build và smoke cho reusable workflow. Artifact admission và build provenance liên quan nhau, nhưng không thể dùng thay thế như cùng một loại cam kết.",
          ],
        },
        proof: {
          label: "core.py · manifest, digest and image identity validation",
          href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/core.py",
        },
      },
      {
        id: "candidate",
        label: {
          en: "03 · Candidate",
          vi: "03 · Candidate",
        },
        title: {
          en: "Make the idle slot prove its identity",
          vi: "Buộc idle slot chứng minh danh tính",
        },
        summary: {
          en: [
            "deployctl serializes mutation with a per-application operation lock. operations.py verifies the existing active route and image before selecting the other slot. Candidate creation is not allowed to overwrite a still-busy old slot merely because that slot is no longer receiving new routed requests.",
          ],
          vi: [
            "deployctl tuần tự hóa mutation bằng operation lock riêng từng ứng dụng. operations.py xác minh active route và image hiện tại trước khi chọn slot còn lại. Tạo candidate không được ghi đè slot cũ còn bận chỉ vì slot đó không còn nhận request mới từ route.",
          ],
        },
        detail: {
          en: [
            "The engine records a prepared intent and route snapshot before starting the candidate. The shell adapter uses Compose with no dependent-service restart and with pulling disabled at start, after the explicit image pull. Its direct health check runs inside the container and parses a structured response: ok must be true, deployment_slot must match, and instance_id must match the container hostname prefix with a positive numeric suffix. The Python layer separately checks the container's expected image and membership in the registered edge network. These checks make a generic HTTP 200 insufficient. Reusing a running target also requires active_requests_known to be true and an integer active_requests count of zero. The ",
            {
              link: "blue-green adapter",
              href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/bluegreen.sh",
            },
            " is therefore part of the application's health contract, not a universal inference about all containers. A service must expose meaningful identity and activity information for this mechanism to be safe. The candidate_ready phase is persisted only after the candidate passes the engine's health checks.",
          ],
          vi: [
            "Engine ghi prepared intent và route snapshot trước khi khởi động candidate. Shell adapter dùng Compose không restart dependent service, đồng thời tắt pull ở bước start sau khi đã pull image tường minh. Direct health check chạy bên trong container và parse response có cấu trúc: ok phải true, deployment_slot phải khớp, instance_id phải có prefix hostname của container cùng hậu tố số dương. Lớp Python kiểm tra riêng expected image của container và việc tham gia edge network đã đăng ký. Các kiểm tra này khiến HTTP 200 chung chung không đủ. Tái sử dụng target đang chạy còn đòi hỏi active_requests_known là true và active_requests là số nguyên bằng không. Vì thế ",
            {
              link: "blue-green adapter",
              href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/bluegreen.sh",
            },
            " là một phần hợp đồng health của ứng dụng, không phải suy luận phổ quát cho mọi container. Dịch vụ phải cung cấp thông tin identity và activity có ý nghĩa để cơ chế này an toàn. Phase candidate_ready chỉ được lưu bền vững sau khi candidate vượt qua health check của engine.",
          ],
        },
        proof: {
          label: "operations.py · candidate transaction and health checks",
          href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/operations.py",
        },
      },
      {
        id: "route",
        label: {
          en: "04 · Cutover",
          vi: "04 · Cutover",
        },
        title: {
          en: "Publish atomically, then wait for two matching ACKs",
          vi: "Publish nguyên tử rồi chờ hai ACK khớp nhau",
        },
        summary: {
          en: [
            "Container health cannot establish which configuration the edge has loaded. The platform renders a new route generation and checks the selected slot together with that generation. Two consecutive matching observations are required before the cutover can advance to committed state.",
          ],
          vi: [
            "Container health không xác lập edge đã nạp cấu hình nào. Platform render route generation mới rồi kiểm tra slot được chọn cùng generation đó. Cần hai quan sát liên tiếp cùng khớp trước khi cutover được đi tiếp đến committed state.",
          ],
        },
        detail: {
          en: [
            "route.py validates the mounted dynamic directory, the owned route's security shape, namespace collisions and required shared middleware. Under the shared route lock, operations.py compares the current route hash with the prepared snapshot and checks sibling files for unexpected changes. Publishing writes a temporary file in the same directory, flushes and fsyncs it, replaces the destination, then fsyncs the directory. Atomic replacement avoids a partially written file; it does not prove Traefik has adopted it. The ",
            {
              link: "cutover probe",
              href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/traefik.sh",
            },
            " supplies that second kind of evidence: HTTPS health must return the expected slot and generation, no-store, and no accepted stale/cache-hit indicators. Any mismatch resets the consecutive-observation count. If the new route cannot be acknowledged, restoration is compare-before-write and must acknowledge the old route too; unexplained drift is not overwritten. The lock coordinates participating publishers, not every possible writer on a shared VPS. Two ACKs establish bounded route convergence, not continuous global availability.",
          ],
          vi: [
            "route.py kiểm tra dynamic directory được mount, security shape của route sở hữu, namespace collision và shared middleware bắt buộc. Dưới shared route lock, operations.py so hash route hiện tại với prepared snapshot và kiểm tra sibling file có thay đổi ngoài dự kiến hay không. Publish ghi temporary file trong cùng directory, flush và fsync file, replace đích, rồi fsync directory. Replace nguyên tử tránh file bị ghi dở; nó không chứng minh Traefik đã nhận cấu hình. ",
            {
              link: "Cutover probe",
              href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/traefik.sh",
            },
            " cung cấp loại bằng chứng thứ hai đó: HTTPS health phải trả expected slot và generation, no-store, đồng thời không có các chỉ dấu stale/cache-hit bị từ chối. Mọi mismatch đặt lại số quan sát liên tiếp. Nếu route mới không được acknowledge, restore phải compare-before-write và cũng phải acknowledge route cũ; drift không giải thích được sẽ không bị ghi đè. Lock phối hợp các publisher tham gia, không phải mọi bên có thể ghi trên VPS dùng chung. Hai ACK xác lập route convergence có giới hạn, không phải availability liên tục toàn hệ thống.",
          ],
        },
        proof: {
          label: "route.py · atomic publication, shape checks and dual ACK",
          href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/lib/route.py",
        },
      },
      {
        id: "recovery",
        label: {
          en: "05 · Recovery",
          vi: "05 · Recovery",
        },
        title: {
          en: "Let disconnects, drains, and rollback have different meanings",
          vi: "Đừng gộp disconnect, drain và rollback thành một việc",
        },
        summary: {
          en: [
            "Request submission dispatches a detached systemd service. SSH disconnection does not itself cancel the engine. A receipt saying dispatched is not a completed deployment; status must distinguish running, failed, complete and recovery_required rather than encouraging another blind request.",
          ],
          vi: [
            "Request submission dispatch một systemd service tách rời. SSH bị ngắt không tự hủy engine. Receipt ghi dispatched không phải deployment hoàn tất; status phải phân biệt running, failed, complete và recovery_required thay vì khuyến khích gửi thêm request một cách mù quáng.",
          ],
        },
        detail: {
          en: [
            "The controller persists started and terminal receipts, while transaction state retains intermediate intent. Reconcile compares the durable snapshot, current route hash, generation and candidate health before finishing or restoring work; divergent state remains unresolved instead of being guessed away. After commit, the previous slot is marked draining. Cleanup checks that the active route still matches, requires the draining slot to report a known zero active-request count, checks the active route again, and only then stops the old container. The stopped container remains a potential rollback target; rollback expects a retained previous image/container and repeats health and route verification. None of this reverses writes to a shared database or volume. The ",
            {
              link: "README's database warning",
              href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/README.md",
            },
            " therefore requires compatible schema evolution. A long-lived request can keep a slot draining, bad activity instrumentation can prevent safe cleanup, and a destructive migration can invalidate an otherwise healthy old binary. Blue-green is a traffic and process transition with explicit recovery, not a universal data-rollback guarantee.",
          ],
          vi: [
            "Controller lưu started receipt và terminal receipt, trong khi transaction state giữ intermediate intent. Reconcile so durable snapshot, current route hash, generation và candidate health trước khi hoàn tất hoặc restore công việc; state bị lệch vẫn được giữ là chưa giải quyết thay vì đoán cho qua. Sau commit, slot trước được đánh dấu draining. Cleanup kiểm tra active route còn khớp, yêu cầu draining slot báo active-request count đã biết bằng không, kiểm tra active route lần nữa, rồi mới dừng container cũ. Container đã dừng tiếp tục là rollback target tiềm năng; rollback đòi hỏi previous image/container còn được giữ và lặp lại health cùng route verification. Những việc đó không đảo ngược write trên database hoặc volume dùng chung. Vì vậy ",
            {
              link: "cảnh báo database trong README",
              href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/README.md",
            },
            " yêu cầu tiến hóa schema tương thích. Request dài có thể giữ slot ở draining, activity instrumentation sai có thể ngăn cleanup an toàn, và destructive migration có thể khiến binary cũ không còn dùng được dù vẫn healthy. Blue-green là chuyển tiếp traffic và process với recovery tường minh, không phải bảo đảm rollback dữ liệu phổ quát.",
          ],
        },
        proof: {
          label: "deployctl · detached dispatch, receipts and operation ownership",
          href: "https://github.com/TheDemonTuan/vps-deploy/blob/f06c7e5f6249f1a86a54226465df55581ec0c34f/bin/deployctl",
        },
      },
    ],
    limits: [
      {
        en: [
          "This article reads the pinned single-image blue-green implementation and its documented operating contract. It does not report a newly executed rollout, fault-injection campaign, downtime measurement or production migration. Other platform strategies have different constraints and are not covered by this walkthrough.",
        ],
        vi: [
          "Bài đọc implementation blue-green một image tại commit được pin cùng hợp đồng vận hành đã mô tả. Bài không báo cáo rollout vừa chạy, chiến dịch fault injection, số đo downtime hay migration production. Strategy khác trong platform có ràng buộc khác và không thuộc diễn giải này.",
        ],
      },
      {
        en: [
          "Rollback is bounded by retained artifacts, compatible data, meaningful health/activity instrumentation and the edge's real state. Shared-host isolation still depends on correct root-owned installation and participating writers. The portfolio retains its own delivery boundary; this article does not change its proxy or deploy topology.",
        ],
        vi: [
          "Rollback bị giới hạn bởi artifact còn giữ, dữ liệu tương thích, health/activity instrumentation có ý nghĩa và state thật của edge. Cách ly trên shared host vẫn phụ thuộc cài đặt root-owned đúng và các bên ghi tuân thủ cơ chế. Portfolio giữ ranh giới triển khai riêng; bài viết không đổi proxy hoặc deploy topology của nó.",
        ],
      },
    ],
  },
  {
    slug: "tus-uploads-and-crash-safe-finalization",
    eyebrow: {
      en: "Storage · protocol and recovery",
      vi: "Lưu trữ · giao thức và phục hồi",
    },
    title: {
      en: "Resumable uploads across a database and a filesystem",
      vi: "Upload tiếp tục được qua ranh giới database và filesystem",
    },
    description: {
      en: "How a single-node Go file manager coordinates tus offsets, quota reservations, opaque objects and recoverable finalization—and where the implementation stops short of its ADR.",
      vi: "Cách file manager Go một node phối hợp offset tus, giữ chỗ quota, object định danh kín và hoàn tất có thể phục hồi—cùng những điểm implementation chưa đạt đầy đủ ADR.",
    },
    published: "2026-10-23",
    updated: "2026-10-23",
    readTime: {
      en: "7 min read",
      vi: "9 phút đọc",
    },
    stack: ["Go", "tus", "SQLite WAL", "Local filesystem", "Cloudflare Access", "Restic"],
    lede: {
      en: [
        "A large upload is not one write. It is a sequence of requests, a reservation against future storage, a temporary file and, eventually, a visible entry in a logical directory tree. In tuan-file-manager, the difficult boundary is not between microservices: it is between SQLite and a local filesystem that cannot join the same transaction. The project deliberately chooses a Go modular monolith and a single storage node. That reduces coordination machinery without removing the need to describe interrupted work. This article follows the pinned implementation and its accepted architecture decisions, distinguishing the intended crash-recovery protocol from what the source and its focused tests actually establish.",
      ],
      vi: [
        "Một upload lớn không phải một lần ghi. Nó là chuỗi request, một khoản giữ chỗ cho dung lượng sắp dùng, một file tạm và cuối cùng là mục hiển thị trong cây thư mục logic. Với tuan-file-manager, ranh giới khó không nằm giữa các microservice: nó nằm giữa SQLite và filesystem cục bộ vốn không thể tham gia cùng một transaction. Dự án chủ động chọn Go modular monolith và một node lưu trữ. Lựa chọn đó giảm bộ máy điều phối nhưng không xóa nhu cầu mô tả công việc bị gián đoạn. Bài viết đi theo implementation đã pin và các quyết định kiến trúc được chấp nhận, phân biệt giao thức phục hồi mong muốn với điều source và những test tập trung thực sự thể hiện.",
      ],
    },
    architecture: [
      "tus client",
      "Access-protected admin API",
      "quota reservation + staging",
      "durable finalizing intent",
      "opaque object rename",
      "SQLite metadata commit",
      "reconciler",
    ],
    principles: [
      {
        title: {
          en: "Separate names from bytes",
          vi: "Tách tên khỏi dữ liệu",
        },
        body: {
          en: "User-facing folders and filenames belong to metadata; storage uses generated opaque keys. A rename in the UI need not become a physical path rename.",
          vi: "Thư mục và tên file người dùng thấy thuộc metadata; lớp lưu trữ dùng key kín được sinh riêng. Đổi tên trên UI không nhất thiết phải đổi đường dẫn vật lý.",
        },
      },
      {
        title: {
          en: "Reserve before accepting work",
          vi: "Giữ chỗ trước khi nhận việc",
        },
        body: {
          en: "An in-progress upload is already a claim on capacity. Completed objects alone do not describe how much storage the service has promised.",
          vi: "Upload đang chạy đã là một yêu cầu chiếm dung lượng. Chỉ đếm object hoàn tất không thể hiện lượng lưu trữ dịch vụ đã hứa cấp.",
        },
      },
      {
        title: {
          en: "Make interruption inspectable",
          vi: "Biến gián đoạn thành trạng thái đọc được",
        },
        body: {
          en: "Persist the intended destination before moving bytes. Recovery should reason from stored state and object existence rather than depend on the original HTTP connection surviving.",
          vi: "Lưu đích đến dự kiến trước khi chuyển dữ liệu. Phục hồi phải dựa vào trạng thái đã lưu và sự tồn tại của object, không phụ thuộc kết nối HTTP ban đầu còn sống.",
        },
      },
    ],
    steps: [
      {
        id: "protocol",
        label: {
          en: "01 · Protocol",
          vi: "01 · Giao thức",
        },
        title: {
          en: "Resume from a server-owned offset",
          vi: "Tiếp tục từ offset do server quản lý",
        },
        summary: {
          en: [
            "The HTTP surface implements the tus creation and termination flow with OPTIONS, POST, HEAD, PATCH and DELETE handlers. Creation requires a non-negative Upload-Length; HEAD reports the persisted length and offset with no-store caching. PATCH requires application/offset+octet-stream and a non-negative Upload-Offset. The client therefore asks where the server is, rather than guessing which part of an interrupted request arrived.",
          ],
          vi: [
            "Bề mặt HTTP triển khai luồng tạo và hủy của tus qua các handler OPTIONS, POST, HEAD, PATCH và DELETE. Tạo upload cần Upload-Length không âm; HEAD trả length và offset đã lưu, kèm no-store để tránh cache. PATCH yêu cầu application/offset+octet-stream cùng Upload-Offset không âm. Vì vậy client hỏi server đang ở đâu thay vì đoán phần nào của request bị ngắt đã đến nơi.",
          ],
        },
        detail: {
          en: [
            "WriteChunk serializes work through the service mutex, accepts only created or receiving uploads, checks expiry, and rejects an offset that differs from received_bytes. The lifecycle test supplies two chunks, deliberately retries the wrong offset, and checks the completed object's contents. That is useful evidence for the ordinary service path, not a complete tus interoperability or network-failure campaign. ADR-0002 specifies 16 MiB client chunks for the documented Cloudflare constraint and a 10 GiB file target. Those are design parameters, not measured throughput. In the handlers and service inspected here, the chunk body is streamed into staging and length overrun is checked after copying; this is not evidence of a hard 16 MiB server-side request cap. Chunk sizing, accepted file length and durable offset recovery are different contracts and should not be conflated. ",
            {
              link: "Read the lifecycle test",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/uploads/service_test.go",
            },
          ],
          vi: [
            "WriteChunk tuần tự hóa công việc bằng mutex của service, chỉ nhận upload ở trạng thái created hoặc receiving, kiểm tra hết hạn và từ chối offset khác received_bytes. Test vòng đời gửi hai chunk, cố ý gửi lại offset sai rồi kiểm tra nội dung object hoàn tất. Đây là dẫn chứng hữu ích cho đường chạy thông thường của service, không phải chiến dịch kiểm thử đầy đủ tính tương thích tus hay lỗi mạng. ADR-0002 quy định chunk phía client 16 MiB để phù hợp giới hạn Cloudflare được tài liệu mô tả và đặt mục tiêu file 10 GiB. Đó là tham số thiết kế, không phải throughput đo được. Trong handler và service đã đọc, body của chunk được stream vào staging, sau đó mới kiểm tra vượt length; điều này không chứng minh server có giới hạn cứng 16 MiB mỗi request. Kích thước chunk, độ dài file được nhận và phục hồi offset bền vững là các hợp đồng khác nhau, không nên gộp làm một. ",
            {
              link: "Đọc test vòng đời",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/uploads/service_test.go",
            },
          ],
        },
        proof: {
          label: "Source · tus HTTP handlers",
          href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/httpapi/handlers.go",
        },
      },
      {
        id: "reservation",
        label: {
          en: "02 · Capacity",
          vi: "02 · Dung lượng",
        },
        title: {
          en: "Count promises as well as stored objects",
          vi: "Đếm cả dung lượng đã hứa lẫn object đã lưu",
        },
        summary: {
          en: [
            "CreateUpload normalizes the filename, verifies an active parent folder and checks for an existing sibling. Under the service mutex it adds completed file-object bytes, reservations in active upload states and the proposed size before comparing with the logical quota. The new upload reserves its expected size immediately, rather than waiting until the last chunk makes the file visible.",
          ],
          vi: [
            "CreateUpload chuẩn hóa tên file, xác minh thư mục cha còn hoạt động và kiểm tra mục trùng tên. Bên trong mutex của service, hàm cộng dung lượng file object đã hoàn tất, phần giữ chỗ của upload đang hoạt động và kích thước đề xuất rồi so với quota logic. Upload mới giữ chỗ ngay bằng expected size, thay vì đợi chunk cuối cùng làm file xuất hiện.",
          ],
        },
        detail: {
          en: [
            "Logical accounting is only one side of admission. The service also reads filesystem free space and compares the prospective remaining bytes with a configured reserve. It generates separate staging and final keys, creates the staging file, then inserts the upload record; if insertion fails, it attempts to remove staging. Completion, termination and expiry release the database reservation. This is accounting, not filesystem block preallocation, and it does not stop another process consuming disk. There is also an important difference from the ADR's strong wording about atomic reservation: this implementation uses an in-process mutex around separate queries and an insert, not a cross-process capacity transaction. The quota aggregate query errors are discarded, and the physical-space check is conditional on a successful result with positive free bytes. Those details matter before describing admission as fail-closed. They support the intended single-service model, not a multi-writer or absolute free-space guarantee.",
          ],
          vi: [
            "Kế toán logic chỉ là một phía của việc nhận upload. Service còn đọc dung lượng trống của filesystem và so phần dự kiến còn lại với mức dự phòng được cấu hình. Nó sinh staging key và final key riêng, tạo file staging rồi chèn bản ghi upload; nếu chèn thất bại, nó thử xóa staging. Hoàn tất, hủy và hết hạn đều giải phóng phần giữ chỗ trong database. Đây là kế toán, không phải cấp phát trước block trên filesystem, và không ngăn process khác dùng hết đĩa. Cũng có khác biệt quan trọng so với cách ADR mô tả giữ chỗ nguyên tử: implementation dùng mutex trong process bao quanh các query và một insert riêng biệt, không phải transaction dung lượng xuyên process. Lỗi query cộng quota bị bỏ qua; kiểm tra dung lượng vật lý chỉ chạy khi đọc thành công và số byte trống dương. Những chi tiết đó cần được tính đến trước khi gọi cơ chế nhận upload là fail-closed. Chúng phù hợp mô hình một service dự kiến, không bảo đảm nhiều writer hay dung lượng trống tuyệt đối.",
          ],
        },
        proof: {
          label: "Source · CreateUpload and reservation lifecycle",
          href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/uploads/service.go",
        },
      },
      {
        id: "finalization",
        label: {
          en: "03 · Commit boundary",
          vi: "03 · Ranh giới commit",
        },
        title: {
          en: "Record intent before publishing metadata",
          vi: "Ghi ý định trước khi công bố metadata",
        },
        summary: {
          en: [
            "Once received bytes equal the expected size, the service enters verifying, computes a whole-file SHA-256 and sniffs MIME. Phase A stores finalizing and the hash; the final storage key was already persisted at creation. Phase B moves staging into opaque object storage. Phase C creates the logical node and file_object, marks the upload complete and releases its reservation inside one SQLite transaction.",
          ],
          vi: [
            "Khi số byte nhận bằng expected size, service chuyển sang verifying, tính SHA-256 toàn file và nhận diện MIME. Phase A lưu finalizing cùng hash; final storage key đã được lưu từ lúc tạo. Phase B chuyển staging vào vùng object dùng key kín. Phase C tạo node logic và file_object, đánh dấu upload complete và giải phóng phần giữ chỗ trong cùng một SQLite transaction.",
          ],
        },
        detail: {
          en: [
            "The ordering gives recovery an explicit destination even if the request disappears between filesystem movement and metadata publication. It also keeps logical filenames out of physical object paths. However, the accepted ADR is stronger than the implementation at this snapshot. It calls for syncing staging, an atomic rename and syncing the destination directory. MoveStagingToObject attempts a file Sync and calls os.Rename, but ignores the Sync result and does not sync the destination directory. The three-phase structure is visible in code; full power-loss durability is not thereby established. Rename semantics also depend on the underlying filesystem and storage layout. I describe this as a recoverable finalization design, not proof that every crash leaves no orphan or corrupt object. The hash records what the server read; without a separately supplied expected digest, it is not an independent assertion that those bytes match what the client intended. ",
            {
              link: "Compare the filesystem implementation",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/storage/storage.go",
            },
          ],
          vi: [
            "Thứ tự này cho phục hồi một đích đến tường minh ngay cả khi request biến mất giữa lúc chuyển dữ liệu trên filesystem và công bố metadata. Nó cũng giữ tên logic ngoài đường dẫn object vật lý. Tuy nhiên, ADR được chấp nhận đưa ra yêu cầu mạnh hơn implementation ở snapshot này. ADR yêu cầu sync staging, rename nguyên tử và sync thư mục đích. MoveStagingToObject thử Sync file rồi gọi os.Rename, nhưng bỏ qua kết quả Sync và không sync thư mục đích. Cấu trúc ba phase xuất hiện trong code; điều đó chưa xác lập độ bền đầy đủ khi mất điện. Ngữ nghĩa rename còn phụ thuộc filesystem và bố trí vùng lưu trữ bên dưới. Tôi mô tả đây là thiết kế hoàn tất có thể phục hồi, không phải bằng chứng mọi crash đều không để lại object mồ côi hay hỏng. Hash ghi nhận dữ liệu server đã đọc; nếu không có digest mong đợi được cung cấp riêng, nó không phải xác nhận độc lập rằng dữ liệu đúng với ý định của client. ",
            {
              link: "Đối chiếu implementation filesystem",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/storage/storage.go",
            },
          ],
        },
        proof: {
          label: "Design · ADR-0002 three-phase finalization",
          href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/docs/adr/0002-tus-upload-crash-safe-finalization.md",
        },
      },
      {
        id: "reconcile",
        label: {
          en: "04 · Recovery",
          vi: "04 · Phục hồi",
        },
        title: {
          en: "Repair from stored state, not request history",
          vi: "Sửa từ trạng thái đã lưu, không từ lịch sử request",
        },
        summary: {
          en: [
            "Reconcile expires stale created or receiving uploads and inspects finalizing records. If the final object exists, it checks whether metadata already references it and either finishes metadata creation or marks the upload complete. If only staging exists, it retries the move and metadata work. If neither exists, it marks the upload failed and releases the reservation.",
          ],
          vi: [
            "Reconcile cho hết hạn các upload created hoặc receiving đã cũ rồi kiểm tra bản ghi finalizing. Nếu final object tồn tại, nó kiểm tra metadata đã tham chiếu object chưa để hoàn tất tạo metadata hoặc đánh dấu upload complete. Nếu chỉ còn staging, nó thử lại việc chuyển và tạo metadata. Nếu cả hai đều mất, nó đánh dấu upload failed và giải phóng phần giữ chỗ.",
          ],
        },
        detail: {
          en: [
            "The recovery test constructs one specific interrupted state: a finalizing row with staging bytes present and no final object. It invokes Reconcile and asserts completion, reservation release and a visible node with the expected size. Reading that test is more informative than treating the word crash-safe as a result. It does not kill a process at every instruction, emulate storage write loss or establish all branches under database errors. Several recovery writes and commits discard errors in the inspected implementation. The scan also targets finalizing, not a general repair of every verifying row or a mismatch between an appended staging file and the persisted offset. These are explicit limits to the recovery claim. The valuable pattern is that intended work survives as data and can be inspected later; the remaining work is to make every boundary and failed repair equally accountable. ",
            {
              link: "Read the reconciler branches",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/uploads/service.go",
            },
          ],
          vi: [
            "Test phục hồi dựng một trạng thái gián đoạn cụ thể: bản ghi finalizing có dữ liệu staging nhưng chưa có final object. Test gọi Reconcile rồi kiểm tra upload hoàn tất, phần giữ chỗ được giải phóng và có node hiển thị với kích thước mong đợi. Đọc test hữu ích hơn xem chữ crash-safe như một kết quả. Nó không giết process ở từng instruction, mô phỏng mất dữ liệu ghi trên thiết bị hay xác lập mọi nhánh khi database lỗi. Một số lệnh ghi và commit trong phục hồi bỏ qua lỗi ở implementation đã đọc. Việc quét cũng nhắm vào finalizing, không phải sửa tổng quát mọi bản ghi verifying hoặc chênh lệch giữa file staging đã append và offset đã lưu. Đó là giới hạn tường minh của tuyên bố phục hồi. Mẫu thiết kế có giá trị nằm ở chỗ công việc dự định tồn tại dưới dạng dữ liệu và có thể kiểm tra lại; phần còn lại là làm mọi ranh giới và lần sửa thất bại có khả năng truy trách nhiệm tương đương. ",
            {
              link: "Đọc các nhánh reconciler",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/uploads/service.go",
            },
          ],
        },
        proof: {
          label: "Test source · simulated interrupted finalization",
          href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/uploads/reconcile_test.go",
        },
      },
      {
        id: "operations",
        label: {
          en: "05 · Operating boundary",
          vi: "05 · Ranh giới vận hành",
        },
        title: {
          en: "Recovery is not a replacement for restore",
          vi: "Phục hồi trạng thái không thay thế restore",
        },
        summary: {
          en: [
            "The application separates administrative traffic from public shares. ADR-0003 documents local Cloudflare Access JWT verification for administration, while public sharing uses a different host and token surface. In the production router, the configured share host rejects administrative API paths; the public surface still serves share UI, assets and health endpoints. It is not literally a host containing only token routes.",
          ],
          vi: [
            "Ứng dụng tách traffic quản trị khỏi chia sẻ công khai. ADR-0003 mô tả xác minh Cloudflare Access JWT cục bộ cho quản trị, còn chia sẻ công khai dùng host và bề mặt token khác. Trong router production, share host được cấu hình từ chối đường dẫn API quản trị; bề mặt công khai vẫn phục vụ giao diện chia sẻ, asset và endpoint health. Nó không phải host chỉ chứa riêng các route token theo nghĩa đen.",
          ],
        },
        detail: {
          en: [
            "ADR-0001 keeps metadata and objects on one node and deliberately excludes horizontal scale-out. The README places encrypted off-site Restic backup in a separate process, keeping object-store credentials outside the web process. That is a useful operational separation, but neither an upload reconciler nor an encrypted archive proves a successful restore. Reconciliation can complete an interrupted transition using bytes that still exist locally; it cannot reconstruct a lost disk. Restoring a useful service requires compatible metadata, object contents and the necessary keys and configuration. No recovery-time objective, backup freshness measurement or disaster exercise is established by the sources read for this article. I therefore keep the claim at architecture and source behavior, without reproducing host-specific recovery commands or private operational details. The important distinction is between repairing an unfinished commit and recovering the storage system that commit depended on. ",
            {
              link: "Read the single-node architecture decision",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/docs/adr/0001-modular-monolith-sqlite.md",
            },
            "; ",
            {
              link: "backup ownership in the README",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/README.md",
            },
          ],
          vi: [
            "ADR-0001 giữ metadata và object trên một node, chủ động loại trừ mở rộng ngang. README đặt backup Restic mã hóa ngoài máy ở process riêng, giữ credential object store ngoài web process. Đây là phân tách vận hành hữu ích, nhưng reconciler upload hay archive mã hóa đều không chứng minh restore thành công. Reconciliation có thể hoàn tất chuyển trạng thái bị gián đoạn bằng dữ liệu còn trên máy; nó không thể tái tạo đĩa đã mất. Muốn khôi phục dịch vụ hữu dụng cần metadata tương thích, nội dung object và các key, cấu hình cần thiết. Các nguồn đọc cho bài này không xác lập mục tiêu thời gian phục hồi, số đo độ mới backup hay diễn tập thảm họa. Vì vậy tôi giới hạn tuyên bố ở kiến trúc và hành vi source, không chép lệnh phục hồi gắn với host hay chi tiết vận hành riêng. Điểm quan trọng là phân biệt sửa một commit chưa xong với khôi phục hệ thống lưu trữ mà commit ấy phụ thuộc. ",
            {
              link: "Đọc quyết định kiến trúc một node",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/docs/adr/0001-modular-monolith-sqlite.md",
            },
            "; ",
            {
              link: "ranh giới backup trong README",
              href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/README.md",
            },
          ],
        },
        proof: {
          label: "Source · production host routing",
          href: "https://github.com/TheDemonTuan/tuan-file-manager/blob/85b831f5c377d4597d6bc78d9414bc9c5f2d662a/internal/httpapi/router.go",
        },
      },
    ],
    limits: [
      {
        en: [
          "This is a source-backed reading of a single-node design, not an observed production reliability result. The tests were read, not executed for this article. ADR claims about every crash, strict concurrent reservation and complete tus compatibility are design claims; the narrower implementation and test evidence above do not prove them.",
        ],
        vi: [
          "Đây là phân tích thiết kế một node dựa trên source, không phải kết quả độ tin cậy production đã quan sát. Các test được đọc, không được chạy cho bài viết. Tuyên bố ADR về mọi crash, giữ chỗ chặt chẽ khi đồng thời và tương thích tus đầy đủ là tuyên bố thiết kế; implementation cùng dẫn chứng test hẹp hơn ở trên không chứng minh chúng.",
        ],
      },
      {
        en: [
          "The durable-intent pattern is valuable precisely because its assumptions can be named: one service owner, usable local storage, recoverable metadata and retained secrets. Filesystem sync gaps, ignored error paths, offset persistence windows and restore consistency remain material boundaries, not details hidden by the phrase crash-safe.",
        ],
        vi: [
          "Mẫu durable intent có giá trị chính vì các giả định có thể gọi tên: một service làm chủ, lưu trữ cục bộ dùng được, metadata phục hồi được và secret còn giữ. Khoảng trống sync filesystem, đường lỗi bị bỏ qua, cửa sổ lưu offset và tính nhất quán restore vẫn là ranh giới quan trọng, không phải chi tiết được che bởi cụm crash-safe.",
        ],
      },
    ],
  },
  {
    slug: "docker-manager-isolating-the-docker-socket",
    eyebrow: {
      en: "Infrastructure · privilege boundaries",
      vi: "Hạ tầng · ranh giới đặc quyền",
    },
    title: {
      en: "Keeping the Docker socket out of the application core",
      vi: "Giữ Docker socket ngoài application core",
    },
    description: {
      en: "A source-backed look at a Go Compose panel's core/agent split, typed Unix-socket actions, secret encryption and the limits of its documented confinement model.",
      vi: "Phân tích có dẫn chứng về cách panel Compose Go tách core/agent, dùng action có kiểu qua Unix socket, mã hóa secret và giới hạn mô hình confinement trong tài liệu.",
    },
    published: "2026-10-23",
    updated: "2026-10-23",
    readTime: {
      en: "7 min read",
      vi: "9 phút đọc",
    },
    stack: [
      "Go",
      "Docker Compose",
      "Unix sockets",
      "SQLite WAL",
      "XChaCha20-Poly1305",
      "Cloudflare Tunnel",
    ],
    lede: {
      en: [
        "A Docker management interface is not an ordinary CRUD application. Its useful operations can stop workloads, change Compose definitions and remove resources. Giving the web process the Docker socket makes that authority directly available wherever the web application can execute code. tuan-docker-manager instead places the socket in a separate agent and makes the Go application core request explicit operations over a Unix socket. That is a concrete boundary worth examining, but not a claim that compromise becomes harmless. The repository calls itself an MVP. Reading its Compose configuration and handlers alongside the README reveals both deliberate separation and places where the documented security model is broader than the actual restrictions.",
      ],
      vi: [
        "Giao diện quản lý Docker không phải ứng dụng CRUD thông thường. Các thao tác hữu ích của nó có thể dừng workload, đổi định nghĩa Compose và xóa tài nguyên. Đưa Docker socket vào web process đồng nghĩa trao trực tiếp thẩm quyền ấy cho mọi nơi ứng dụng web có thể thực thi code. Thay vào đó, tuan-docker-manager đặt socket trong agent riêng và để application core Go yêu cầu những thao tác cụ thể qua Unix socket. Đó là ranh giới thực tế đáng khảo sát, nhưng không có nghĩa xâm nhập trở nên vô hại. Repository tự gọi mình là MVP. Đọc cấu hình Compose và handler cùng README cho thấy cả sự phân tách có chủ đích lẫn những nơi mô hình bảo mật trong tài liệu rộng hơn giới hạn thực tế.",
      ],
    },
    architecture: [
      "Cloudflare Tunnel / Access",
      "panel-core: UI + API + SQLite",
      "typed HTTP over Unix socket",
      "panel-agent",
      "Docker Engine + Compose",
      "managed workloads",
    ],
    principles: [
      {
        title: {
          en: "Move authority behind an interface",
          vi: "Đặt thẩm quyền sau giao diện",
        },
        body: {
          en: "The core does not mount the Docker socket. It requests named agent actions, making the privileged surface inspectable instead of exposing a raw daemon proxy.",
          vi: "Core không mount Docker socket. Nó yêu cầu action có tên từ agent, biến bề mặt đặc quyền thành thứ kiểm tra được thay vì mở proxy daemon thô.",
        },
      },
      {
        title: {
          en: "Configuration is part of the boundary",
          vi: "Cấu hình là một phần ranh giới",
        },
        body: {
          en: "Mounts, socket ownership, network mode and capabilities determine what separation means in practice. Architecture diagrams cannot override the Compose file.",
          vi: "Mount, quyền sở hữu socket, network mode và capability quyết định ý nghĩa phân tách trong thực tế. Sơ đồ kiến trúc không thể thay thế file Compose.",
        },
      },
      {
        title: {
          en: "Keep claims proportional to evidence",
          vi: "Giữ tuyên bố tương xứng dẫn chứng",
        },
        body: {
          en: "An explicit RPC protocol and authenticated encryption are mechanisms, not a security certification or proof that every privileged action is confined.",
          vi: "Giao thức RPC tường minh và mã hóa xác thực là cơ chế, không phải chứng nhận bảo mật hay bằng chứng mọi thao tác đặc quyền đều bị giới hạn.",
        },
      },
    ],
    steps: [
      {
        id: "boundary",
        label: {
          en: "01 · Process boundary",
          vi: "01 · Ranh giới process",
        },
        title: {
          en: "Separate the web application from daemon access",
          vi: "Tách ứng dụng web khỏi quyền truy cập daemon",
        },
        summary: {
          en: [
            "The Compose file gives panel-core its data volume and the shared agent-socket volume, but not the Docker socket. Only panel-agent mounts the daemon socket. The core joins the edge network with cloudflared and exposes its internal HTTP port without a host ports mapping. The agent has network_mode: none and receives core requests through the shared Unix-socket channel.",
          ],
          vi: [
            "File Compose cấp cho panel-core volume dữ liệu và volume agent-socket dùng chung, nhưng không cấp Docker socket. Chỉ panel-agent mount socket daemon. Core tham gia edge network cùng cloudflared và expose cổng HTTP nội bộ mà không có ánh xạ ports ra host. Agent dùng network_mode: none và nhận request từ core qua kênh Unix socket chia sẻ.",
          ],
        },
        detail: {
          en: [
            "This reduces direct daemon exposure in the web container and removes a conventional TCP listener from the agent's ingress model. It does not turn the agent into an unprivileged sandbox: Docker authority remains powerful, and core can still invoke the operations that the agent accepts. The deployment also matters more than the README's shorthand about least privilege. Both long-running application containers specify read_only, no-new-privileges and cap_drop ALL, but the agent adds CHOWN, DAC_OVERRIDE and FOWNER back. It also receives host inspection mounts, including a read-only host-root view. Those are real exceptions, not invisible implementation details. Network isolation of the agent process likewise does not mean a Docker request can never cause daemon-side networking or workload changes. The useful guarantee is narrowly stated: no direct Docker-socket mount in core in this configuration, with a separate, still-powerful authority holder.",
          ],
          vi: [
            "Cách này giảm việc web container tiếp xúc trực tiếp daemon và bỏ listener TCP thông thường khỏi mô hình ingress của agent. Nó không biến agent thành sandbox không đặc quyền: quyền Docker vẫn rất mạnh, và core vẫn có thể gọi các thao tác agent chấp nhận. Cấu hình triển khai cũng quan trọng hơn cách README rút gọn về least privilege. Cả hai application container chạy dài hạn đều có read_only, no-new-privileges và cap_drop ALL, nhưng agent thêm lại CHOWN, DAC_OVERRIDE và FOWNER. Agent còn nhận các mount phục vụ quan sát host, bao gồm góc nhìn host root chỉ đọc. Đây là ngoại lệ thực tế, không phải chi tiết implementation có thể bỏ qua. Cách ly mạng của process agent cũng không đồng nghĩa request Docker không thể gây truy cập mạng từ daemon hay thay đổi workload. Bảo đảm hữu ích phải phát biểu hẹp: core không mount trực tiếp Docker socket trong cấu hình này, còn thẩm quyền nằm ở một thành phần riêng vẫn rất mạnh.",
          ],
        },
        proof: {
          label: "Source · core and agent Compose configuration",
          href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/docker-compose.yml",
        },
      },
      {
        id: "rpc",
        label: {
          en: "02 · Privileged interface",
          vi: "02 · Giao diện đặc quyền",
        },
        title: {
          en: "Name the action instead of forwarding the API",
          vi: "Gọi tên action thay vì chuyển tiếp API",
        },
        summary: {
          en: [
            "protocol.go defines request and response structures for container inventory, container actions, Compose operations, images, volumes, networks and file reading. The router maps these to named HTTP endpoints rather than accepting an arbitrary Docker API path. A container action handler explicitly switches among start, stop, restart and kill, rejecting unsupported actions before calling the daemon client.",
          ],
          vi: [
            "protocol.go định nghĩa cấu trúc request và response cho inventory container, thao tác container, Compose, image, volume, network và đọc file. Router ánh xạ chúng tới endpoint HTTP có tên thay vì nhận đường dẫn Docker API tùy ý. Handler thao tác container switch tường minh giữa start, stop, restart và kill, từ chối action không hỗ trợ trước khi gọi daemon client.",
          ],
        },
        detail: {
          en: [
            "Compose requests carry a stack name, optional stack path, action, optional Compose and environment content, and a remove-volumes flag. These fields expose the actual authority the interface can exercise; a typed request is not automatically a safe request. The handler validates stack names, handles validation and deletion branches, and forwards execution to the Compose runner. Some agent handlers require identifiers and valid JSON, while others ignore decoding errors and use zero values, so the README's description of strictly validated actions should not be read as uniform enforcement. Structured responses separate success, logs and error text, but callers must inspect that success field: several Compose failures are represented in an HTTP 200 response. Keeping this interface small enough to review is the architectural benefit. Authorization, input validation and result interpretation still have to be correct at each action boundary. ",
            {
              link: "Read the RPC handlers",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/agent/handler.go",
            },
          ],
          vi: [
            "Request Compose mang stack name, stack path tùy chọn, action, nội dung Compose và environment tùy chọn cùng cờ remove-volumes. Các trường này bộc lộ thẩm quyền thực tế mà giao diện có thể sử dụng; request có kiểu không tự động là request an toàn. Handler xác minh tên stack, xử lý các nhánh validate và delete rồi chuyển thực thi cho Compose runner. Một số handler agent yêu cầu identifier và JSON hợp lệ, trong khi số khác bỏ qua lỗi decode và dùng giá trị zero, nên mô tả action được kiểm tra nghiêm ngặt trong README không thể hiểu là thực thi đồng đều. Response có cấu trúc tách success, log và nội dung lỗi, nhưng caller phải đọc trường success: một số lỗi Compose được biểu diễn bằng HTTP 200. Lợi ích kiến trúc nằm ở việc giữ giao diện đủ rõ để review. Phân quyền, kiểm tra input và diễn giải kết quả vẫn phải đúng ở từng ranh giới action. ",
            {
              link: "Đọc các RPC handler",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/agent/handler.go",
            },
          ],
        },
        proof: {
          label: "Source · typed agent protocol",
          href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/agent/protocol.go",
        },
      },
      {
        id: "confinement",
        label: {
          en: "03 · Scope",
          vi: "03 · Phạm vi",
        },
        title: {
          en: "Distinguish a default directory from universal confinement",
          vi: "Phân biệt thư mục mặc định với confinement toàn diện",
        },
        summary: {
          en: [
            "The default stack-directory path is built from a configured root and a validated name containing only letters, digits, hyphens and underscores. GetStackDir checks the relative result for traversal. The runner invokes docker with an argument vector and a fixed action switch, rather than concatenating an unrestricted shell command. Those are concrete restrictions on the normal named-stack path.",
          ],
          vi: [
            "Đường dẫn thư mục stack mặc định được ghép từ root cấu hình và tên đã kiểm tra chỉ chứa chữ, số, dấu gạch ngang, gạch dưới. GetStackDir kiểm tra kết quả tương đối để phát hiện traversal. Runner gọi docker bằng vector argument và switch action cố định thay vì ghép một shell command không giới hạn. Đó là giới hạn cụ thể cho đường chạy stack có tên thông thường.",
          ],
        },
        detail: {
          en: [
            "The source does not support extending that statement to every path. ExecuteInDir accepts an optional custom directory and only calls GetStackDir when that field is empty. The agent passes the request's StackPath into that branch. Separately, the read-file handler tries the supplied path and host-root or stack-root alternatives; the inspected function does not apply the same root-confinement check. Combined with the agent's broad read-only host mount, that is materially different from the README's blanket claim that all access stays inside the stack directory. Even a read-only mount can expose sensitive data; read-only is not confidentiality isolation. I therefore describe path checks as present on the default stack path, not as a proven universal policy. The process split remains useful, but it must be evaluated against every available RPC and mount, including convenience features that expand authority beyond the original diagram. ",
            {
              link: "Compare custom paths and file reading",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/agent/handler.go",
            },
          ],
          vi: [
            "Source không cho phép mở rộng nhận định đó thành mọi đường dẫn. ExecuteInDir nhận custom directory tùy chọn và chỉ gọi GetStackDir khi trường ấy rỗng. Agent chuyển StackPath của request vào nhánh này. Riêng handler đọc file thử đường dẫn được cung cấp rồi các phương án qua host root hoặc stack root; hàm đã đọc không áp dụng cùng phép kiểm tra confinement theo root. Kết hợp với mount host chỉ đọc có phạm vi rộng của agent, đây là khác biệt đáng kể so với tuyên bố bao quát trong README rằng mọi truy cập đều nằm trong thư mục stack. Ngay cả mount chỉ đọc cũng có thể lộ dữ liệu nhạy cảm; read-only không phải cách ly bí mật. Vì vậy tôi mô tả có kiểm tra đường dẫn cho stack path mặc định, không gọi đó là chính sách toàn diện đã chứng minh. Tách process vẫn hữu ích, nhưng phải đánh giá theo mọi RPC và mount hiện có, kể cả tính năng tiện ích mở rộng thẩm quyền vượt sơ đồ ban đầu. ",
            {
              link: "Đối chiếu custom path và đọc file",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/agent/handler.go",
            },
          ],
        },
        proof: {
          label: "Source · Compose runner path and action checks",
          href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/compose/runner.go",
        },
      },
      {
        id: "identity",
        label: {
          en: "04 · Identity and secrets",
          vi: "04 · Danh tính và secret",
        },
        title: {
          en: "Separate trusted ingress from cryptography at rest",
          vi: "Tách ingress tin cậy khỏi mã hóa khi lưu",
        },
        summary: {
          en: [
            "The authenticator reads the Cloudflare authenticated-email header, applies an email allowlist when configured, and resolves a stored user. It can also accept a database session token; development mode has an explicit fallback. Permission middleware delegates to the RBAC matrix. This is a trusted-ingress identity model: the inspected code does not locally verify an Access JWT before trusting that email header.",
          ],
          vi: [
            "Authenticator đọc header email đã xác thực của Cloudflare, áp allowlist email khi có cấu hình rồi phân giải user đã lưu. Nó cũng có thể nhận session token trong database; development mode có fallback tường minh. Middleware quyền chuyển kiểm tra sang ma trận RBAC. Đây là mô hình danh tính dựa vào ingress tin cậy: code đã đọc không xác minh Access JWT cục bộ trước khi tin header email đó.",
          ],
        },
        detail: {
          en: [
            "Origin protection compares parsed Origin or Referer host values with the request host for POST, PUT and DELETE. With neither header, production acceptance depends on presence of the Access assertion header, not signature verification inside this function. That makes preventing direct untrusted access to core important; the tunnel configuration is part of the trust argument. At rest, the separate secrets manager uses XChaCha20-Poly1305, a fresh random nonce and authenticated Open on decryption. It loads a 32-byte master key or creates one with restrictive file permissions. This establishes an encryption mechanism, not hardware-backed key isolation, and the running core necessarily has the decryption key. An invalid-length or unreadable key takes the creation path, so key retention is also a recovery concern. Nor does a crypto helper prove every environment file is encrypted everywhere: the Compose runner writes supplied environment content as a permission-restricted plaintext file for execution. ",
            {
              link: "Read authentication and origin handling",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/auth/auth.go",
            },
          ],
          vi: [
            "Origin protection so host đã parse từ Origin hoặc Referer với host của request đối với POST, PUT và DELETE. Khi thiếu cả hai header, việc chấp nhận ở production phụ thuộc sự có mặt của header Access assertion, không phải xác minh chữ ký bên trong hàm này. Vì thế ngăn truy cập trực tiếp không tin cậy tới core là quan trọng; cấu hình tunnel là một phần lập luận tin cậy. Khi lưu dữ liệu, secrets manager riêng dùng XChaCha20-Poly1305, nonce ngẫu nhiên mới và Open có xác thực lúc giải mã. Nó nạp master key 32 byte hoặc tạo key với quyền file hạn chế. Điều này xác lập cơ chế mã hóa, không phải cách ly key bằng phần cứng, và core đang chạy tất nhiên giữ key giải mã. Key sai độ dài hay không đọc được sẽ đi vào nhánh tạo mới, nên giữ key cũng là vấn đề phục hồi. Helper crypto cũng không chứng minh mọi environment file đều được mã hóa ở mọi nơi: Compose runner ghi environment content được cung cấp thành file plaintext có quyền hạn chế để thực thi. ",
            {
              link: "Đọc xác thực và xử lý origin",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/auth/auth.go",
            },
          ],
        },
        proof: {
          label: "Source · XChaCha20-Poly1305 secrets manager",
          href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/secrets/crypto.go",
        },
      },
      {
        id: "operations",
        label: {
          en: "05 · Operations",
          vi: "05 · Vận hành",
        },
        title: {
          en: "Treat audit, backup and deployment as separate evidence",
          vi: "Xem audit, backup và triển khai là dẫn chứng riêng",
        },
        summary: {
          en: [
            "The README documents audit logging, encrypted backups, and delivery of core and agent images as a versioned pair with health checks and rollback. These are distinct responsibilities: recovering panel configuration is not restoring managed application volumes, and rolling back a panel image is not undoing a destructive Docker action. The article does not turn those documented features into observed operational outcomes.",
          ],
          vi: [
            "README mô tả audit log, backup mã hóa và phân phối image core cùng agent thành một cặp phiên bản có health check, rollback. Đây là các trách nhiệm khác nhau: phục hồi cấu hình panel không phải khôi phục volume của ứng dụng được quản lý, còn rollback image panel không hoàn tác thao tác Docker phá hủy dữ liệu. Bài viết không biến tính năng trong tài liệu thành kết quả vận hành đã quan sát.",
          ],
        },
        detail: {
          en: [
            "The audit helper starts a goroutine to persist an action and logs persistence errors. That code alone does not prove durable recording before an operation returns, nor the README's tamper-evident characterization. The backup implementation builds an archive from the database file and stack definitions or files, encrypts it through the secrets manager, then stores nonce plus ciphertext. It does not, in that function, use SQLite's online-backup API or explicitly include WAL state; reading it is not evidence of a transaction-consistent live database snapshot. Managed workload data is outside the archive scope shown here. These distinctions prevent a convenient panel backup from becoming an implied disaster-recovery guarantee. The project is best presented at its documented maturity: an MVP with concrete privilege-separation and encryption mechanisms, plus visible limitations requiring evaluation before sensitive workloads depend on it. No certification, penetration-test result, successful restore drill or production availability metric is claimed. ",
            {
              link: "Read backup archive construction",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/backup/backup.go",
            },
            "; ",
            {
              link: "read the asynchronous audit helper",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/audit/logger.go",
            },
          ],
          vi: [
            "Helper audit mở goroutine để lưu action và ghi log khi persistence lỗi. Riêng code đó không chứng minh bản ghi đã bền vững trước khi thao tác trả về, cũng không chứng minh đặc tính tamper-evident mà README mô tả. Implementation backup dựng archive từ file database cùng định nghĩa hoặc file stack, mã hóa qua secrets manager rồi lưu nonce nối ciphertext. Trong hàm đó không dùng online-backup API của SQLite hay đưa WAL state vào một cách tường minh; đọc hàm không phải dẫn chứng snapshot database đang chạy nhất quán theo transaction. Dữ liệu workload được quản lý nằm ngoài phạm vi archive thể hiện ở đây. Những phân biệt này ngăn backup tiện lợi của panel trở thành bảo đảm phục hồi thảm họa ngầm định. Cách giới thiệu phù hợp là giữ đúng độ trưởng thành tài liệu ghi nhận: một MVP có cơ chế tách đặc quyền và mã hóa cụ thể, cùng giới hạn nhìn thấy cần đánh giá trước khi workload nhạy cảm phụ thuộc vào nó. Bài không tuyên bố chứng nhận, kết quả pentest, diễn tập restore thành công hay số đo availability production. ",
            {
              link: "Đọc cách dựng archive backup",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/backup/backup.go",
            },
            "; ",
            {
              link: "đọc helper audit bất đồng bộ",
              href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/internal/audit/logger.go",
            },
          ],
        },
        proof: {
          label: "Documentation · MVP scope and delivery model",
          href: "https://github.com/TheDemonTuan/tuan-docker-manager/blob/e112a56160a3335eefccb324d2038368419f6fcb/README.md",
        },
      },
    ],
    limits: [
      {
        en: [
          "No Docker daemon, deployment, security test suite or restore exercise was run for this article. Source inspection establishes mechanisms and discrepancies at the pinned revision, not exploitability in a particular installation or a guarantee of safe operation.",
        ],
        vi: [
          "Không chạy Docker daemon, triển khai, suite kiểm thử bảo mật hay diễn tập restore cho bài viết này. Đọc source xác lập cơ chế và khác biệt tại revision đã pin, không xác lập khả năng khai thác trên một cài đặt cụ thể hay bảo đảm vận hành an toàn.",
        ],
      },
      {
        en: [
          "The core/agent split removes a direct mount, not all indirect Docker authority. Broad RPC actions, custom paths, host visibility, trusted identity headers, key custody and backup consistency remain part of the security boundary. The README's MVP label is retained rather than upgraded to production-proven or certified security.",
        ],
        vi: [
          "Tách core/agent loại bỏ mount trực tiếp, không loại bỏ toàn bộ quyền Docker gián tiếp. RPC phạm vi rộng, custom path, khả năng nhìn host, header danh tính được tin cậy, giữ key và tính nhất quán backup vẫn thuộc ranh giới bảo mật. Nhãn MVP trong README được giữ nguyên thay vì nâng thành bảo mật production đã chứng minh hay được chứng nhận.",
        ],
      },
    ],
  },
  {
    slug: "acb-email-to-durable-webhook",
    eyebrow: {
      en: "Payment events · source study",
      vi: "Sự kiện thanh toán · đọc từ mã nguồn",
    },
    title: {
      en: "From bank email to a signed durable webhook",
      vi: "Từ email ngân hàng đến webhook ký số với outbox bền vững",
    },
    description: {
      en: "Following the email-origin repository into its current provider intake, transactional SQLite outbox, signed delivery and separate worker runtime.",
      vi: "Theo dấu repository khởi đầu từ email đến luồng nhận dữ liệu provider hiện tại, outbox giao dịch trên SQLite, ký webhook và worker tách biệt.",
    },
    published: "2026-10-23",
    updated: "2026-10-23",
    readTime: {
      en: "6 min read",
      vi: "8 phút đọc",
    },
    stack: ["Go", "SQLite", "HMAC-SHA256", "Webhooks", "Traefik"],
    lede: {
      en: [
        "A payment notification crosses two different trust boundaries: the service must decide whether incoming evidence is authentic, then make its own delivery recoverable when the destination is unavailable. Those are different problems. A valid signature does not make a transaction match an order, and an HTTP success from the gateway does not mean every downstream consumer has finished processing it. This repository is useful because its code gives those boundaries separate representations instead of compressing everything into one request handler.",
        " The title preserves the email-origin context of acb-transaction-webhook, not a claim about its current intake. At the pinned October snapshot there is no root README, and the inspected gateway wires payOS and SePay services rather than an email reader. This article therefore follows the implementation that is actually present: bounded provider callbacks, financial settlement or durable review, a SQLite event-and-delivery outbox, and a separate notification worker. It does not reconstruct an unavailable email parser from the repository name.",
      ],
      vi: [
        "Một thông báo thanh toán đi qua hai ranh giới tin cậy khác nhau: dịch vụ phải xác định bằng chứng đầu vào có xác thực không, rồi bảo đảm công việc gửi tiếp có thể được phục hồi khi nơi nhận không sẵn sàng. Đây là hai bài toán riêng. Chữ ký hợp lệ không đồng nghĩa giao dịch khớp đơn hàng; HTTP thành công từ gateway cũng không có nghĩa mọi consumer phía sau đã xử lý xong. Điểm đáng đọc của repository là các ranh giới này có biểu diễn riêng trong mã nguồn, thay vì bị gộp vào một request handler.",
        " Tiêu đề giữ bối cảnh khởi đầu từ email của acb-transaction-webhook, không khẳng định đó là đầu vào hiện tại. Ở snapshot tháng Mười đã pin, repository không có README tại root; gateway được đọc khởi tạo dịch vụ payOS và SePay chứ không phải bộ đọc email. Bài viết vì thế theo đúng triển khai đang tồn tại: callback provider có giới hạn, quyết toán hoặc lưu hồ sơ cần xem xét, outbox sự kiện và lượt gửi trên SQLite, cùng notification worker riêng. Tên repository không được dùng để suy dựng một email parser không có trong nguồn.",
      ],
    },
    architecture: [
      "Provider callback",
      "Verify + normalize",
      "SQLite settlement / review",
      "Event + delivery outbox",
      "Worker claim",
      "Signed HTTP POST",
    ],
    principles: [
      {
        title: {
          en: "Authenticate evidence, then interpret it",
          vi: "Xác thực bằng chứng rồi mới diễn giải",
        },
        body: {
          en: "Provider verification answers who supplied data. Order, amount, reference and account checks answer whether it can change financial state.",
          vi: "Xác minh provider trả lời ai cung cấp dữ liệu. Kiểm tra đơn hàng, số tiền, mã tham chiếu và tài khoản mới trả lời dữ liệu có được đổi trạng thái tài chính không.",
        },
      },
      {
        title: {
          en: "Persist intent before external effects",
          vi: "Lưu ý định trước tác động bên ngoài",
        },
        body: {
          en: "Financial rows, the event and its delivery obligations share a transaction. Network notifications happen after that durable boundary.",
          vi: "Bản ghi tài chính, sự kiện và nghĩa vụ gửi dùng chung giao dịch. Thông báo qua mạng diễn ra sau ranh giới lưu bền đó.",
        },
      },
      {
        title: {
          en: "Keep acknowledgements narrow",
          vi: "Giữ ý nghĩa ACK vừa đủ",
        },
        body: {
          en: "A callback ACK, a committed event and a destination's HTTP acceptance are separate observations, not interchangeable guarantees.",
          vi: "ACK callback, sự kiện đã commit và HTTP chấp nhận từ đích là các quan sát khác nhau, không phải những bảo đảm có thể thay thế nhau.",
        },
      },
    ],
    steps: [
      {
        id: "intake",
        label: {
          en: "01 · Intake",
          vi: "01 · Tiếp nhận",
        },
        title: {
          en: "Read the current intake, not the historical name",
          vi: "Đọc đầu vào hiện tại, không suy từ tên cũ",
        },
        summary: {
          en: [
            "The current payOS HTTP handler bounds the request body, decodes JSON with number preservation, rejects malformed or trailing input, and delegates to the payment service. It is intentionally outside owner authentication and CSRF because provider authenticity belongs to a different boundary than an administrator's browser session.",
          ],
          vi: [
            "HTTP handler payOS hiện giới hạn request body, giải mã JSON có giữ biểu diễn số, từ chối dữ liệu sai dạng hoặc phần thừa và chuyển sang payment service. Handler cố ý nằm ngoài owner authentication và CSRF, vì xác thực provider là ranh giới khác với phiên trình duyệt của quản trị viên.",
          ],
        },
        detail: {
          en: [
            "That separation matters when documenting an evolved system. The repository name and metadata retain the ACB email story, but they are not implementation evidence for an email subscription or mailbox parser at this commit. The callback handler maps invalid signatures to an authentication error and service or storage unavailability to a retryable HTTP failure; it does not turn either into a successful payment. Parsing is also visible elsewhere in the current code: the SePay notification parser accepts fixed versioned headers, treats everything after content= as opaque memo text, validates positive amounts and dates, and reports review codes instead of returning raw payer text in errors. The useful lesson is explicit input grammar and provenance, not a claim that arbitrary banking emails are understood. ",
            {
              link: "SePay parser source",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/sepay/parser.go",
            },
          ],
          vi: [
            "Sự tách biệt này quan trọng khi viết về một hệ thống đã thay đổi. Tên và metadata repository vẫn giữ câu chuyện email ACB, nhưng không chứng minh commit này có đăng ký nhận email hay parser hộp thư. Callback handler trả lỗi xác thực cho chữ ký sai và lỗi HTTP có thể thử lại khi service hoặc storage không sẵn sàng; không biến trường hợp nào thành thanh toán thành công. Việc parse cũng hiện diện ở nguồn hiện tại: parser thông báo SePay chỉ nhận các header cố định có phiên bản, coi mọi nội dung sau content= là memo không diễn giải tiếp, kiểm tra số tiền dương và thời gian, trả mã cần xem xét thay vì đưa nguyên văn thông tin người trả vào lỗi. Bài học là ngữ pháp đầu vào và nguồn gốc rõ ràng, không phải khả năng hiểu mọi email ngân hàng. ",
            {
              link: "Mã nguồn parser SePay",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/sepay/parser.go",
            },
          ],
        },
        proof: {
          label: "Bounded provider callback handler",
          href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/httpapi/payos_webhook.go",
        },
      },
      {
        id: "signature",
        label: {
          en: "02 · Signature",
          vi: "02 · Chữ ký",
        },
        title: {
          en: "Separate provider verification from outbound HMAC",
          vi: "Tách xác minh provider khỏi HMAC gửi ra",
        },
        summary: {
          en: [
            "Incoming payOS evidence goes through provider verification before settlement or recognition of the exact nonfinancial confirmation sample. Outbound webhook delivery is a separate mechanism: the sender signs the persisted event payload with an endpoint secret, a timestamp and a newly generated nonce.",
          ],
          vi: [
            "Bằng chứng payOS đầu vào đi qua xác minh provider trước khi quyết toán hoặc nhận diện chính xác mẫu xác nhận phi tài chính. Gửi webhook ra ngoài là cơ chế riêng: sender ký payload sự kiện đã lưu bằng secret của endpoint, timestamp và nonce mới sinh.",
          ],
        },
        detail: {
          en: [
            "The HMAC helper hashes timestamp, a dot, nonce, another dot and the exact body with SHA-256, then prefixes the hexadecimal result with v1=. Its Verify function checks nonce shape, timestamp leeway and signature equality using hmac.Equal. A time window alone is not a persistent replay ledger: a receiving application still needs its own duplicate policy and durable business idempotency. The active sender supplies event and delivery identifiers, an idempotency header, timestamp, nonce and signature; these identify what to verify without implying that the receiver has done so. Equally, this local HMAC must not be described as bank certification or confused with payOS SDK verification on ingress. Authentication protects a message boundary, not the correctness of all information inside it. ",
            {
              link: "Active outbound sender",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/webhook/sender.go",
            },
            " · ",
            {
              link: "Provider callback verification flow",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/payments/webhook_service.go",
            },
          ],
          vi: [
            "Hàm HMAC băm timestamp, dấu chấm, nonce, dấu chấm tiếp theo và body nguyên gốc bằng SHA-256, rồi thêm tiền tố v1= vào kết quả hexadecimal. Hàm Verify kiểm tra dạng nonce, khoảng lệch timestamp và so sánh chữ ký bằng hmac.Equal. Cửa sổ thời gian không tự trở thành sổ lưu replay bền vững: ứng dụng nhận vẫn cần chính sách trùng lặp và idempotency nghiệp vụ riêng. Sender đang dùng gửi định danh event, delivery, header idempotency, timestamp, nonce và chữ ký; chúng cho biết cần xác minh gì, không có nghĩa nơi nhận đã xác minh. HMAC cục bộ cũng không được mô tả như chứng nhận của ngân hàng hay nhầm với xác minh SDK payOS ở đầu vào. Xác thực bảo vệ ranh giới thông điệp, không chứng minh mọi thông tin bên trong đều đúng. ",
            {
              link: "Sender gửi ra đang dùng",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/webhook/sender.go",
            },
            " · ",
            {
              link: "Luồng xác minh callback provider",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/payments/webhook_service.go",
            },
          ],
        },
        proof: {
          label: "HMAC format and verification helper",
          href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/webhook/webhook.go",
        },
      },
      {
        id: "outbox",
        label: {
          en: "03 · Outbox",
          vi: "03 · Outbox",
        },
        title: {
          en: "Commit the event and its delivery obligations together",
          vi: "Commit sự kiện cùng nghĩa vụ gửi",
        },
        summary: {
          en: [
            "The settlement path validates order identity, amount, account binding and reference evidence inside a SQLite transaction. Accepted financial writes call the event emitter within that same transaction; rejected signed callbacks can instead become durable review records. A signed mismatch is not silently promoted into money.",
          ],
          vi: [
            "Luồng quyết toán kiểm tra định danh đơn, số tiền, liên kết tài khoản và bằng chứng tham chiếu trong một giao dịch SQLite. Ghi tài chính được chấp nhận gọi bộ tạo event ngay trong giao dịch đó; callback có chữ ký nhưng không phù hợp có thể thành hồ sơ xem xét lưu bền. Dữ liệu sai khớp dù đã ký không bị âm thầm nâng thành tiền.",
          ],
        },
        detail: {
          en: [
            "The event emitter derives a stable identifier, inserts an event with conflict handling, snapshots active endpoint revisions and keys into PENDING delivery rows, then appends a journal record. A duplicate event creates neither extra deliveries nor another journal entry. This closes the local gap in which financial state could commit while notification intent existed only in memory. It does not close the distributed gap between an external destination applying an effect and this service recording the response. Delivery claims therefore carry tokens and leases; completion updates require the current claim token. An expired worker cannot simply complete a newer claim by using the delivery ID alone. Recipients still need to deduplicate repeated delivery attempts, especially after a timeout whose remote outcome is unknown. ",
            {
              link: "Financial settlement transaction",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/storage/settlement.go",
            },
            " · ",
            {
              link: "Delivery claims and completion",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/storage/deliveries.go",
            },
          ],
          vi: [
            "Bộ tạo event suy ra định danh ổn định, insert event có xử lý conflict, chụp revision và key của endpoint đang hoạt động vào các delivery PENDING, rồi thêm bản ghi journal. Event trùng không tạo thêm delivery hoặc journal. Cơ chế này khép khoảng hở cục bộ khi trạng thái tài chính có thể commit nhưng ý định thông báo chỉ nằm trong bộ nhớ. Nó không khép khoảng hở phân tán giữa việc đích bên ngoài đã thực hiện tác động và dịch vụ này ghi nhận phản hồi. Vì vậy claim delivery có token và lease; cập nhật hoàn tất phải khớp token claim hiện tại. Worker hết hạn không thể chỉ dùng delivery ID để hoàn tất claim mới hơn. Nơi nhận vẫn phải xử lý trùng giữa các lần gửi, nhất là khi timeout khiến kết quả phía xa chưa rõ. ",
            {
              link: "Giao dịch quyết toán tài chính",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/storage/settlement.go",
            },
            " · ",
            {
              link: "Claim và hoàn tất delivery",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/storage/deliveries.go",
            },
          ],
        },
        proof: {
          label: "Transactional event, deliveries and journal",
          href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/storage/events.go",
        },
      },
      {
        id: "worker",
        label: {
          en: "04 · Worker",
          vi: "04 · Worker",
        },
        title: {
          en: "Make the worker responsible for external delivery",
          vi: "Giao trách nhiệm gửi bên ngoài cho worker",
        },
        summary: {
          en: [
            "Production gateway startup requires its gateway role and worker RPC configuration. The worker takes an exclusive singleton file lock, opens runtime storage without performing migrations, registers notification providers, and starts the dispatcher, payment reconciliation and maintenance. HTTP ingress and background effects are not the same runtime responsibility.",
          ],
          vi: [
            "Khởi động gateway production yêu cầu đúng role gateway và cấu hình worker RPC. Worker lấy file lock singleton độc quyền, mở runtime storage không tự migration, đăng ký notification provider rồi chạy dispatcher, đối soát thanh toán và bảo trì. Nhận HTTP và tạo tác động nền không phải cùng một trách nhiệm runtime.",
          ],
        },
        detail: {
          en: [
            "The dispatcher resolves persisted delivery targets and payloads, records attempts, and chooses success, retry or terminal failure from provider results. Its wake signal accelerates work; database schedules remain the durable reference. Worker quiescence stops financial producers before draining notification sends, because a producer's final commit may enqueue new deliveries. Egress needs equally precise wording. A dedicated proxy binary enforces a configured domain allowlist, but its existence does not prove every client uses it. The webhook client's own transport explicitly disables proxy inheritance, validates destinations, rejects non-public resolved addresses and does not follow redirects. Those are separate outbound controls, not evidence of a universal proxy choke point. ",
            {
              link: "Notification dispatcher",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/notification/dispatcher.go",
            },
            " · ",
            {
              link: "Dedicated egress proxy",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/cmd/egress-proxy/main.go",
            },
          ],
          vi: [
            "Dispatcher lấy target và payload delivery đã lưu, ghi từng lần thử, rồi chọn thành công, thử lại hoặc lỗi kết thúc theo kết quả provider. Wake signal giúp bắt đầu sớm hơn; lịch trong database vẫn là căn cứ bền vững. Quiesce worker dừng producer tài chính trước khi drain lượt gửi thông báo, vì commit cuối của producer có thể tạo delivery mới. Egress cũng cần diễn đạt chính xác. Có binary proxy riêng áp dụng allowlist domain được cấu hình, nhưng sự tồn tại đó không chứng minh mọi client đều đi qua proxy. Transport của webhook client chủ động tắt kế thừa proxy, kiểm tra đích, từ chối địa chỉ phân giải không công khai và không theo redirect. Đây là các kiểm soát đầu ra riêng, không phải bằng chứng rằng toàn bộ traffic bị ép qua một proxy. ",
            {
              link: "Notification dispatcher",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/internal/notification/dispatcher.go",
            },
            " · ",
            {
              link: "Proxy egress riêng",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/cmd/egress-proxy/main.go",
            },
          ],
        },
        proof: {
          label: "Singleton worker and drain ordering",
          href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/cmd/worker/main.go",
        },
      },
      {
        id: "operations",
        label: {
          en: "05 · Operations",
          vi: "05 · Vận hành",
        },
        title: {
          en: "Test ingress selection without overstating deployment evidence",
          vi: "Kiểm tra chọn ingress mà không phóng đại bằng chứng triển khai",
        },
        summary: {
          en: [
            "The deployment test source models router selection against shipped and rendered Traefik configuration. It distinguishes exact public POST callbacks from nearby paths and other methods, checks privacy and request constraints, and keeps provider callbacks separate from administrator access. That is a concrete routing contract, not a live bank transaction receipt.",
          ],
          vi: [
            "Nguồn test triển khai mô hình hóa việc chọn router trên cấu hình Traefik có sẵn và được render. Nó phân biệt callback public POST chính xác với path lân cận hoặc method khác, kiểm tra quyền riêng tư và giới hạn request, giữ callback provider tách khỏi truy cập quản trị. Đây là hợp đồng định tuyến cụ thể, không phải biên nhận giao dịch ngân hàng trực tiếp.",
          ],
        },
        detail: {
          en: [
            "The gateway also exposes distinct liveness, readiness and deployment checks in its command entry point. Deployment readiness examines storage, compatible schema, worker readiness and expected release identity rather than treating any listening socket as sufficient. These checks cover useful failure classes but not the entire chain: a consumer can return success before its own durable commit, a provider may be unavailable, and a restore can replay local work whose remote effects already happened. Reviewing test files here establishes intended checks; this article does not claim they were executed, that a production rollout succeeded, or that a real payment was observed. Operational confidence must combine the versioned contract with environment-specific execution and restore evidence. ",
            {
              link: "Gateway role and deployment checks",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/cmd/gateway/main.go",
            },
          ],
          vi: [
            "Entry point gateway còn cung cấp lệnh kiểm tra liveness, readiness và deployment riêng. Deployment readiness xem storage, schema tương thích, worker sẵn sàng và định danh release dự kiến, thay vì coi socket đang nghe là đủ. Các kiểm tra này bao phủ những lớp lỗi hữu ích nhưng không phải toàn chuỗi: consumer có thể trả thành công trước khi tự commit bền vững, provider có thể gián đoạn và restore có thể chạy lại công việc cục bộ dù tác động ở xa đã xảy ra. Đọc file test ở đây chỉ xác lập các kiểm tra được viết; bài không tuyên bố đã chạy chúng, rollout production thành công hay quan sát thanh toán thật. Niềm tin vận hành phải kết hợp hợp đồng theo phiên bản với bằng chứng thực thi và phục hồi của môi trường cụ thể. ",
            {
              link: "Role gateway và kiểm tra deployment",
              href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/cmd/gateway/main.go",
            },
          ],
        },
        proof: {
          label: "Payment ingress routing test source",
          href: "https://github.com/TheDemonTuan/acb-transaction-webhook/blob/7bbf92fe2a9e20a78ddf008b026c53066c28fddf/deploy/tests/test_payment_ingress.py",
        },
      },
    ],
    limits: [
      {
        en: [
          "The public snapshot is code evidence, not banking certification, a financial audit or a measured delivery SLA. No exactly-once claim follows from a local transaction, stable event ID or idempotency header.",
        ],
        vi: [
          "Snapshot công khai là bằng chứng mã nguồn, không phải chứng nhận ngân hàng, kiểm toán tài chính hay SLA gửi được đo. Giao dịch cục bộ, event ID ổn định và header idempotency không tạo bảo đảm exactly-once.",
        ],
      },
      {
        en: [
          "There is no root README at this SHA. Email-origin naming is explicitly historical context; the article's current mechanisms come from the linked implementation, not an assumed mailbox integration. Secrets, real account data and host administration details are deliberately excluded.",
        ],
        vi: [
          "SHA này không có README tại root. Tên gắn với email chỉ là bối cảnh nguồn gốc; các cơ chế hiện tại trong bài lấy từ triển khai đã dẫn, không suy đoán tích hợp hộp thư. Secret, dữ liệu tài khoản thật và chi tiết quản trị host được chủ động loại khỏi bài.",
        ],
      },
    ],
  },
  {
    slug: "a-single-agent-messenger-automation-system",
    eyebrow: {
      en: "Browser automation · durable coordination",
      vi: "Tự động hóa trình duyệt · điều phối bền vững",
    },
    title: {
      en: "Coordinating one Messenger agent with durable jobs",
      vi: "Điều phối một Messenger agent bằng job bền vững",
    },
    description: {
      en: "PostgreSQL jobs, versioned reply ownership and explicit send uncertainty around a best-effort personal Messenger browser agent.",
      vi: "Job PostgreSQL, quyền phản hồi có phiên bản và trạng thái gửi chưa chắc chắn quanh browser agent Messenger cá nhân theo mô hình best-effort.",
    },
    published: "2026-10-23",
    updated: "2026-10-23",
    readTime: {
      en: "7 min read",
      vi: "8 phút đọc",
    },
    stack: ["TypeScript", "Bun", "PostgreSQL", "Fastify", "Playwright", "Docker"],
    lede: {
      en: [
        "An AI reply is not just generated text. It belongs to a particular inbound version, a conversation whose control may pass to a human, and a browser session that can fail after the send key has already been pressed. The hard part of this project is coordinating those facts without pretending that a personal Messenger page offers the same contract as an official messaging API. PostgreSQL stores work and ownership; a browser agent performs the fragile external action.",
        " The repository describes a Single-Agent system. In the inspected implementation, that should be read as serialized browser sending and explicit reply ownership, not as a theorem that every background task is globally sequential. The core scheduler can run multiple jobs, including media enrichment, while the sender is configured with concurrency one. That narrower interpretation makes the design more useful: examine where ownership is checked, where stale work is cancelled, and where uncertainty is retained instead of retrying an action that may already have reached a customer.",
      ],
      vi: [
        "Một câu trả lời AI không chỉ là văn bản được sinh ra. Nó thuộc về một phiên bản đầu vào cụ thể, một hội thoại có thể chuyển quyền cho con người và một phiên trình duyệt có thể lỗi sau khi phím gửi đã được nhấn. Phần khó của dự án là điều phối những thực tế đó mà không giả định trang Messenger cá nhân cung cấp hợp đồng như API nhắn tin chính thức. PostgreSQL lưu công việc và quyền sở hữu; browser agent thực hiện tác động bên ngoài vốn dễ thay đổi.",
        " Repository mô tả hệ thống Single-Agent. Với triển khai đã đọc, nên hiểu đó là gửi bằng trình duyệt tuần tự và quản lý rõ quyền phản hồi, không phải định lý rằng mọi tác vụ nền đều chạy tuần tự toàn cục. Core scheduler có thể chạy nhiều job, bao gồm làm giàu media, trong khi sender được cấu hình concurrency một. Cách hiểu hẹp hơn làm thiết kế hữu ích hơn: xem quyền được kiểm tra ở đâu, công việc cũ bị hủy lúc nào và chỗ nào giữ lại sự chưa chắc chắn thay vì thử lại hành động có thể đã đến khách hàng.",
      ],
    },
    architecture: [
      "Messenger DOM observation",
      "PostgreSQL inbound + jobs",
      "Debounce / AI policy",
      "Versioned outbound action",
      "Single browser sender",
      "Confirm / review hold",
    ],
    principles: [
      {
        title: {
          en: "Ownership expires; identity must not",
          vi: "Quyền có hạn; định danh phải rõ",
        },
        body: {
          en: "Leases allow recovery, while owner tokens, fencing epochs and inbound versions identify which work is still entitled to proceed.",
          vi: "Lease cho phép phục hồi; owner token, fencing epoch và phiên bản đầu vào xác định công việc nào còn quyền tiếp tục.",
        },
      },
      {
        title: {
          en: "A draft is not a delivered message",
          vi: "Bản nháp chưa phải tin đã gửi",
        },
        body: {
          en: "Generation, outbound intent, the Enter action and observed confirmation are separate phases with different recovery choices.",
          vi: "Sinh câu trả lời, ý định gửi, hành động Enter và xác nhận quan sát được là các phase riêng với cách phục hồi khác nhau.",
        },
      },
      {
        title: {
          en: "Human control invalidates automation",
          vi: "Quyền con người làm mất hiệu lực tự động hóa",
        },
        body: {
          en: "Takeover is represented in durable conversation state and checked again before sending, not merely displayed as a dashboard badge.",
          vi: "Tiếp quản được biểu diễn trong trạng thái hội thoại lưu bền và kiểm tra lại trước gửi, không chỉ hiện như nhãn trên dashboard.",
        },
      },
    ],
    steps: [
      {
        id: "ownership",
        label: {
          en: "01 · Ownership",
          vi: "01 · Quyền xử lý",
        },
        title: {
          en: "Tie each reply to the conversation it actually observed",
          vi: "Gắn câu trả lời với đúng trạng thái đã quan sát",
        },
        summary: {
          en: [
            "The AI handler reads the conversation before generation, compares inboundVersion, checks manual or blocked state, and consults reply control and policy. A queued job can remain perfectly valid as a database row while becoming obsolete as a reply. The code treats those as different questions.",
          ],
          vi: [
            "AI handler đọc hội thoại trước khi sinh câu trả lời, so sánh inboundVersion, kiểm tra manual hoặc blocked, rồi xét reply control và policy. Job trong database có thể vẫn là bản ghi hợp lệ nhưng đã lỗi thời với vai trò câu trả lời. Mã nguồn coi đây là hai câu hỏi khác nhau.",
          ],
        },
        detail: {
          en: [
            "A turn claim supplies ownership and a fencing epoch. The handler carries the inbound version and expected control epoch into created outbound actions and browser jobs, so the later sender has context to reject work that lost permission. It also distinguishes an AI run record from whether its result becomes an action: failed generation creates an incident, SKIP produces no reply, and HANDOFF requests manual control. The important invariant is not that generation cannot overlap another event. It is that a result based on an old conversation must be revalidated before it becomes an external action. The README's absolute race-elimination wording is therefore not adopted here. There are visible guards and recovery mechanisms; this source review is not a proof that every interleaving is impossible.",
          ],
          vi: [
            "Claim turn cung cấp quyền sở hữu và fencing epoch. Handler mang phiên bản đầu vào cùng control epoch dự kiến vào outbound action và browser job được tạo, để sender phía sau có căn cứ từ chối công việc đã mất quyền. Nó cũng phân biệt bản ghi AI run với việc kết quả có trở thành hành động không: sinh lỗi tạo incident, SKIP không trả lời và HANDOFF yêu cầu điều khiển thủ công. Bất biến đáng quan tâm không phải việc sinh câu trả lời không thể trùng thời gian với sự kiện khác. Điều quan trọng là kết quả dựa trên hội thoại cũ phải được xét lại trước khi thành tác động bên ngoài. Vì vậy bài không nhận lại lời khẳng định loại trừ race tuyệt đối trong README. Có các guard và cơ chế phục hồi cụ thể; đọc nguồn không phải chứng minh rằng mọi interleaving đều bất khả thi.",
          ],
        },
        proof: {
          label: "AI version, policy and reply-control gates",
          href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/core/src/jobs/handlers/ai.ts",
        },
      },
      {
        id: "jobs",
        label: {
          en: "02 · Jobs",
          vi: "02 · Job",
        },
        title: {
          en: "Use PostgreSQL for work claims, not just message storage",
          vi: "Dùng PostgreSQL để claim việc, không chỉ lưu tin",
        },
        summary: {
          en: [
            "The job repository claims ready work with SELECT FOR UPDATE SKIP LOCKED and an update that records an owner token, increments fencing_epoch and sets a lease. Heartbeat and completion require the current owner and epoch. Enqueue can receive a transaction and uses an idempotency key to deduplicate intended work.",
          ],
          vi: [
            "Job repository claim việc sẵn sàng bằng SELECT FOR UPDATE SKIP LOCKED cùng update ghi owner token, tăng fencing_epoch và đặt lease. Heartbeat và hoàn tất phải khớp owner cùng epoch hiện tại. Enqueue có thể nhận transaction và dùng idempotency key để khử trùng công việc dự kiến.",
          ],
        },
        detail: {
          en: [
            "This keeps scheduling state inspectable in the same database as conversations without adding Redis or BullMQ. A lease is temporary permission, not proof that a worker is alive forever; reconciliation moves expired work toward recovery or failure according to attempt state. The core scheduler registers debounce, AI, reconciliation, outbox, retention, human fallback and media enrichment handlers. Its configurable concurrency means Single-Agent cannot honestly mean one global job at a time. There is another naming boundary worth preserving: the core outbox handler broadcasts durable events to SSE clients and completes a claimed batch. It is not itself the Messenger sender. Browser delivery lives in outbound actions and browser jobs, so a dashboard event being published must not be counted as customer message delivery. ",
            {
              link: "Core scheduler",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/core/src/jobs/scheduler.ts",
            },
            " · ",
            {
              link: "SSE outbox handler",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/core/src/jobs/handlers/outbox.ts",
            },
          ],
          vi: [
            "Cách này giữ trạng thái lập lịch có thể kiểm tra trong cùng database với hội thoại mà không thêm Redis hoặc BullMQ. Lease là quyền tạm thời, không chứng minh worker còn sống mãi; reconciliation đưa việc hết lease về hướng phục hồi hoặc thất bại theo trạng thái số lần thử. Core scheduler đăng ký handler debounce, AI, reconciliation, outbox, retention, human fallback và media enrichment. Concurrency có thể cấu hình nên Single-Agent không thể được diễn giải trung thực thành chỉ một job toàn cục mỗi lúc. Một ranh giới tên gọi khác cần giữ: outbox handler của core phát sự kiện lưu bền cho SSE client rồi hoàn tất batch đã claim. Nó không phải Messenger sender. Gửi qua trình duyệt nằm ở outbound action và browser job, nên phát một event cho dashboard không được tính là đã gửi tin cho khách hàng. ",
            {
              link: "Core scheduler",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/core/src/jobs/scheduler.ts",
            },
            " · ",
            {
              link: "SSE outbox handler",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/core/src/jobs/handlers/outbox.ts",
            },
          ],
        },
        proof: {
          label: "PostgreSQL job claims, leases and fencing",
          href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/packages/db/src/repository/job-repo.ts",
        },
      },
      {
        id: "browser",
        label: {
          en: "03 · Browser",
          vi: "03 · Trình duyệt",
        },
        title: {
          en: "Give browser fragility an explicit runtime boundary",
          vi: "Đặt phần trình duyệt dễ biến động vào ranh giới riêng",
        },
        summary: {
          en: [
            "The browser-agent entry point initializes the Playwright adapter and sender independently of the core's AI scheduling. Inbound observations are ingested through the conversation repository; duplicate or ineligible input does not simply become another reply. New inbound versions abort stale actions and request typing cancellation locally and through PostgreSQL notification.",
          ],
          vi: [
            "Entry point browser-agent khởi tạo Playwright adapter và sender tách khỏi lập lịch AI của core. Quan sát đầu vào được ingest qua conversation repository; dữ liệu trùng hoặc không đủ điều kiện không mặc nhiên thành câu trả lời mới. Phiên bản đầu vào mới hủy action cũ và yêu cầu ngừng gõ ở tiến trình hiện tại lẫn qua PostgreSQL notification.",
          ],
        },
        detail: {
          en: [
            "The adapter uses a persistent Chromium context and reads Messenger's web interface. It has separate sender and observer state, a send lock, and checks for login requirements, checkpoints, unavailable inboxes and rate limiting. The entry point maps session and degraded-DOM signals into suspended or degraded channel state and incidents instead of continuing as if observation were healthy. This is not an official Meta API contract: DOM identity, rendered text and session continuity remain dependencies outside the application's control. Notifications help react promptly, while durable versions and action state provide the reference after a restart; an in-memory cancellation alone would not be enough. Persisting the browser profile also preserves sensitive authenticated session material, so it should be treated separately from ordinary application output. ",
            {
              link: "Playwright adapter and session state",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/browser-agent/src/messenger-adapter.ts",
            },
          ],
          vi: [
            "Adapter dùng Chromium context bền vững và đọc giao diện web Messenger. Nó có trạng thái sender, observer riêng, send lock và kiểm tra yêu cầu đăng nhập, checkpoint, inbox không truy cập được hoặc rate limit. Entry point chuyển tín hiệu phiên lỗi hay DOM suy giảm thành trạng thái channel bị dừng hoặc degraded cùng incident, thay vì tiếp tục như thể quan sát vẫn tốt. Đây không phải hợp đồng API chính thức của Meta: định danh DOM, văn bản render và tính liên tục của phiên vẫn phụ thuộc bên ngoài ứng dụng. Notification giúp phản ứng nhanh, trong khi version và trạng thái action lưu bền là căn cứ sau restart; chỉ hủy trong bộ nhớ là chưa đủ. Lưu profile trình duyệt còn giữ dữ liệu phiên đã xác thực nhạy cảm, nên phải đối xử khác với đầu ra ứng dụng thông thường. ",
            {
              link: "Playwright adapter và trạng thái phiên",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/browser-agent/src/messenger-adapter.ts",
            },
          ],
        },
        proof: {
          label: "Browser process intake and incident wiring",
          href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/browser-agent/src/index.ts",
        },
      },
      {
        id: "handoff",
        label: {
          en: "04 · Handoff",
          vi: "04 · Chuyển quyền",
        },
        title: {
          en: "Do not retry a message whose send outcome is unknown",
          vi: "Không thử gửi lại khi kết quả gửi chưa rõ",
        },
        summary: {
          en: [
            "The sender uses concurrency one, rechecks channel state, inbound version, human control and reply eligibility, then transitions TYPING to SEND_INTENT with ownership checks immediately before pressing Enter. That transition marks the point where a simple retry becomes dangerous: the external effect may have happened even if confirmation is lost.",
          ],
          vi: [
            "Sender dùng concurrency một, kiểm tra lại channel, phiên bản đầu vào, quyền con người và điều kiện phản hồi, rồi đổi TYPING sang SEND_INTENT có kiểm tra quyền ngay trước khi nhấn Enter. Đây là điểm mà retry đơn giản trở nên nguy hiểm: tác động bên ngoài có thể đã xảy ra dù mất xác nhận.",
          ],
        },
        detail: {
          en: [
            "The adapter verifies an outgoing bubble matching expected text against a pre-send marker and an emptied composer. That is browser-observed evidence, not a server-side delivery receipt or proof the customer read it. Failed verification after Enter leads to SEND_UNCERTAIN and a conversation-level hold and incident, without automatic resend. Human replies observed outside the dashboard also acquire conversation control and cancel AI typing. Reconciliation respects phase differences: stale typing can be cancelled before send intent, whereas stale sending becomes uncertainty. Later customer activity may release the technical review hold, but the reconciler explicitly does not relabel the uncertain action as confirmed. This distinction preserves useful history: conversation progress is evidence that work may resume, not retrospective proof of a particular message's delivery. ",
            {
              link: "Phase-aware reconciliation",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/core/src/jobs/handlers/reconcile.ts",
            },
          ],
          vi: [
            "Adapter xác minh bubble gửi ra khớp văn bản dự kiến dựa vào marker trước gửi và composer đã trống. Đây là bằng chứng quan sát từ trình duyệt, không phải biên nhận phía server hoặc chứng minh khách đã đọc. Xác minh thất bại sau Enter đưa action sang SEND_UNCERTAIN, đặt giữ hội thoại và tạo incident, không tự gửi lại. Phản hồi của người thật được quan sát bên ngoài dashboard cũng nhận quyền hội thoại và hủy AI đang gõ. Reconciliation phân biệt phase: gõ bị kẹt có thể hủy trước ý định gửi, còn gửi bị kẹt thành trạng thái chưa chắc chắn. Hoạt động sau đó của khách có thể gỡ technical review hold, nhưng reconciler chủ động không đổi action chưa rõ thành confirmed. Phân biệt này giữ lịch sử có ích: hội thoại tiến triển là căn cứ để tiếp tục, không phải bằng chứng hồi tố rằng một tin cụ thể đã được giao. ",
            {
              link: "Reconciliation theo phase",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/core/src/jobs/handlers/reconcile.ts",
            },
          ],
        },
        proof: {
          label: "Serialized sender and explicit send uncertainty",
          href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/apps/browser-agent/src/sender-worker.ts",
        },
      },
      {
        id: "limits",
        label: {
          en: "05 · Limits",
          vi: "05 · Giới hạn",
        },
        title: {
          en: "Treat operations and account risk as part of the design",
          vi: "Coi vận hành và rủi ro tài khoản là một phần thiết kế",
        },
        summary: {
          en: [
            "The README explicitly calls personal-account automation experimental and best-effort. It warns that browser automation may violate Meta's Terms of Service and can lead to session invalidation, checkpoints, messaging restrictions or permanent account loss. Serialized sending and pacing do not remove those risks or establish permission to automate.",
          ],
          vi: [
            "README nói rõ tự động hóa tài khoản cá nhân là thử nghiệm và best-effort. Tự động hóa trình duyệt có thể vi phạm Điều khoản Dịch vụ của Meta, gây mất phiên, checkpoint, hạn chế nhắn tin hoặc mất tài khoản vĩnh viễn. Gửi tuần tự và điều chỉnh nhịp không loại bỏ rủi ro hay tạo quyền được tự động hóa.",
          ],
        },
        detail: {
          en: [
            "The documented deployment model separates core and browser-agent updates and preserves an explicit rollback boundary; its shared-edge cutover notes also distinguish application or route rollback from database-schema rollback. Those are documented procedures, not a claim that a rollout here was observed without interruption. The backup script actually invokes pg_dump and gzip and checks that output is nonempty. That is narrower than proving restorability, and it does not back up the authenticated browser profile merely because the profile survives application resets. A useful recovery plan must account for database state and browser session state independently, then re-evaluate jobs whose outside effects may predate the restored database. No throughput, customer-count or delivery-success figures are inferred from test names or architecture. ",
            {
              link: "Database backup script",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/scripts/backup.sh",
            },
          ],
          vi: [
            "Mô hình triển khai được tài liệu hóa tách cập nhật core và browser-agent, giữ ranh giới rollback rõ; ghi chú chuyển sang shared edge cũng phân biệt rollback ứng dụng hoặc route với rollback schema database. Đây là quy trình được ghi lại, không phải khẳng định bài đã quan sát rollout không gián đoạn. Backup script thực sự gọi pg_dump và gzip rồi kiểm tra đầu ra không rỗng. Điều này hẹp hơn chứng minh phục hồi được, và không sao lưu profile đã đăng nhập chỉ vì profile được giữ khi reset ứng dụng. Kế hoạch phục hồi có ích phải xét trạng thái database và phiên trình duyệt độc lập, sau đó đánh giá lại job có tác động bên ngoài có thể xảy ra trước mốc database được khôi phục. Bài không suy ra throughput, số khách hàng hay tỷ lệ giao thành công từ tên test hoặc sơ đồ kiến trúc. ",
            {
              link: "Script backup database",
              href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/scripts/backup.sh",
            },
          ],
        },
        proof: {
          label: "Documented maturity, account risks and operations",
          href: "https://github.com/TheDemonTuan/facebook-messenger-ai-rep/blob/2a642e92938db04cb4fd5421ae547d52f5b2fa2e/README.md",
        },
      },
    ],
    limits: [
      {
        en: [
          "This is personal Messenger browser automation, not an official Meta messaging integration. It is best-effort and depends on changing DOM structure, authenticated sessions, account policy and provider availability. A successful local job cannot guarantee customer delivery or continuous account access.",
        ],
        vi: [
          "Đây là tự động hóa trình duyệt Messenger cá nhân, không phải tích hợp nhắn tin Meta chính thức. Hệ thống là best-effort, phụ thuộc cấu trúc DOM thay đổi, phiên xác thực, chính sách tài khoản và khả năng sẵn sàng của provider. Job cục bộ thành công không bảo đảm khách nhận tin hoặc tài khoản luôn truy cập được.",
        ],
      },
      {
        en: [
          "The linked code and documentation were read at one pinned snapshot. No live account session, checkpoint recovery, production send or restore drill was executed for this article. PostgreSQL fencing and explicit uncertainty improve the model; they do not constitute a proof of race freedom or exactly-once messaging.",
        ],
        vi: [
          "Mã và tài liệu được dẫn đã đọc tại một snapshot cố định. Không thực hiện phiên tài khoản trực tiếp, phục hồi checkpoint, gửi production hoặc diễn tập restore cho bài này. Fencing PostgreSQL và trạng thái chưa chắc chắn làm mô hình rõ hơn; chúng không phải chứng minh không còn race hay nhắn tin exactly-once.",
        ],
      },
    ],
  },
  {
    slug: "monitoring-a-service-with-independent-health-signals",
    eyebrow: {
      en: "Monitoring architecture",
      vi: "Kiến trúc giám sát",
    },
    title: {
      en: "Independent signals for service and host health",
      vi: "Tín hiệu độc lập cho sức khỏe dịch vụ và máy chủ",
    },
    description: {
      en: "How an original Beszel infrastructure integration and an UptimeFlare-derived status service separate host telemetry, heartbeat freshness, external probes, and release ownership.",
      vi: "Cách phần tích hợp hạ tầng Beszel tự xây và dịch vụ trạng thái phát triển từ UptimeFlare tách telemetry máy chủ, độ mới heartbeat, probe bên ngoài và quyền sở hữu bản phát hành.",
    },
    published: "2026-10-23",
    updated: "2026-10-23",
    readTime: {
      en: "7 min read",
      vi: "8 phút đọc",
    },
    stack: [
      "Beszel",
      "Docker Compose",
      "Cloudflare Workers",
      "D1",
      "UptimeFlare",
      "TypeScript",
      "JavaScript",
    ],
    lede: {
      en: [
        "A green status indicator is useful only when its question is precise. A host can have spare memory while an application rejects every request; a dashboard can answer HTTP while its agent has stopped reporting. These repositories deliberately provide several narrower observations instead of one universal health claim. The Beszel integration runs official Hub and Agent images and adds a small heartbeat Worker with its own D1 database. An independently released, UptimeFlare-derived service consumes public health signals and performs external checks. This article follows the source snapshot, not a live availability experiment: the interesting result is the separation of meanings, storage, and ownership, not an invented uptime percentage.",
      ],
      vi: [
        "Một chỉ báo xanh chỉ có ích khi câu hỏi phía sau nó đủ rõ. Máy chủ có thể còn nhiều RAM nhưng ứng dụng từ chối mọi request; dashboard vẫn trả HTTP trong khi agent đã ngừng gửi dữ liệu. Hai repository này chủ động cung cấp nhiều quan sát hẹp thay vì một tuyên bố sức khỏe bao trùm. Phần tích hợp Beszel chạy image Hub và Agent chính thức, đồng thời bổ sung heartbeat Worker nhỏ với database D1 riêng. Dịch vụ phát triển từ UptimeFlare được phát hành độc lập, tiêu thụ tín hiệu sức khỏe công khai và thực hiện kiểm tra bên ngoài. Bài viết lần theo snapshot source, không phải một thí nghiệm đo availability trực tiếp: điểm đáng chú ý là cách tách ý nghĩa, lưu trữ và quyền sở hữu, không phải một tỷ lệ uptime được tự đặt ra.",
      ],
    },
    architecture: [
      "Beszel Hub / Agent",
      "heartbeat Worker",
      "heartbeat D1",
      "public status endpoints",
      "UptimeFlare probes",
      "monitor D1 / status page",
    ],
    principles: [
      {
        title: {
          en: "Name the question",
          vi: "Gọi đúng câu hỏi",
        },
        body: {
          en: "Hub reachability, producer freshness, agent state, and application readiness are different observations. Keep their meanings visible rather than collapsing them into a reassuring green badge.",
          vi: "Khả năng truy cập Hub, độ mới của producer, trạng thái agent và readiness ứng dụng là các quan sát khác nhau. Giữ ý nghĩa của từng tín hiệu thay vì gom vào một badge xanh dễ gây yên tâm sai.",
        },
      },
      {
        title: {
          en: "Minimize the public contract",
          vi: "Thu nhỏ hợp đồng công khai",
        },
        body: {
          en: "The heartbeat consumer needs a health decision, not host metadata. The public response carries a small result while the Worker stores only the fields needed for its policy.",
          vi: "Consumer heartbeat cần quyết định sức khỏe, không cần metadata máy chủ. Response công khai chỉ mang kết quả nhỏ, còn Worker chỉ lưu các trường phục vụ policy.",
        },
      },
      {
        title: {
          en: "Separate release ownership",
          vi: "Tách quyền sở hữu phát hành",
        },
        body: {
          en: "Beszel, its heartbeat service, and the public status consumer have different release and recovery boundaries. Independent pipelines reduce accidental coupling without eliminating shared infrastructure risks.",
          vi: "Beszel, dịch vụ heartbeat và consumer trạng thái công khai có ranh giới phát hành, phục hồi khác nhau. Pipeline riêng giảm phụ thuộc vô tình nhưng không loại bỏ rủi ro từ hạ tầng dùng chung.",
        },
      },
    ],
    steps: [
      {
        id: "layers",
        label: {
          en: "Observation layers",
          vi: "Các tầng quan sát",
        },
        title: {
          en: "Host telemetry is not a public service check",
          vi: "Telemetry máy chủ không phải kiểm tra dịch vụ công khai",
        },
        summary: {
          en: [
            "tuan-beszel is an original infrastructure integration, not an implementation or fork of Beszel. Its documented architecture uses official henrygd/beszel and henrygd/beszel-agent images, with Hub and Agent connected through a shared Unix socket. Beszel supplies the monitoring product; this repository supplies its deployment integration and heartbeat policy.",
          ],
          vi: [
            "tuan-beszel là phần tích hợp hạ tầng tự xây, không phải implementation hay fork của Beszel. Kiến trúc được ghi nhận sử dụng image henrygd/beszel và henrygd/beszel-agent chính thức, nối Hub với Agent qua Unix socket dùng chung. Beszel cung cấp sản phẩm giám sát; repository này cung cấp phần tích hợp triển khai và policy heartbeat.",
          ],
        },
        detail: {
          en: [
            "That distinction matters both technically and editorially. The Hub's ability to serve a request is one signal; whether the expected agent is up is another. The integration README documents a producer cadence of 60 seconds and two public heartbeat decisions, while the separate status repository describes its own external checks. A host resource warning therefore need not mean that the agent is disconnected, and a connected agent does not prove that an unrelated application's business operation succeeds. The status consumer is an additional vantage point rather than a replacement for host telemetry. It still shares dependencies such as Cloudflare and networking, so independent ownership must not be confused with complete failure-domain independence. Attribution belongs in the architecture itself: the consumer derives from ",
            {
              link: "lyc8503/UptimeFlare",
              href: "https://github.com/lyc8503/UptimeFlare",
            },
            ", as its ",
            {
              link: "snapshot README",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/README.md",
            },
            " explicitly states.",
          ],
          vi: [
            "Phân biệt này quan trọng cả về kỹ thuật lẫn cách ghi công. Hub phục vụ được request là một tín hiệu; agent mong đợi có đang up hay không là tín hiệu khác. README tích hợp ghi nhịp producer 60 giây và hai quyết định heartbeat công khai, còn repository trạng thái riêng mô tả các kiểm tra bên ngoài của nó. Vì vậy cảnh báo tài nguyên máy chủ không nhất thiết có nghĩa agent mất kết nối; agent kết nối cũng không chứng minh nghiệp vụ của một ứng dụng khác thành công. Consumer trạng thái bổ sung góc quan sát, không thay thế telemetry máy chủ. Nó vẫn chia sẻ các phụ thuộc như Cloudflare và kết nối mạng, nên không thể đồng nhất quyền sở hữu độc lập với miền lỗi hoàn toàn độc lập. Việc ghi công phải nằm ngay trong kiến trúc: consumer phát triển từ ",
            {
              link: "lyc8503/UptimeFlare",
              href: "https://github.com/lyc8503/UptimeFlare",
            },
            ", như ",
            {
              link: "README tại snapshot",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/README.md",
            },
            " đã nêu rõ.",
          ],
        },
        proof: {
          label: "tuan-beszel · README.md",
          href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/README.md",
        },
      },
      {
        id: "heartbeat",
        label: {
          en: "Producer boundary",
          vi: "Ranh giới producer",
        },
        title: {
          en: "Accept a bounded payload before advancing freshness",
          vi: "Nhận payload có giới hạn trước khi cập nhật độ mới",
        },
        summary: {
          en: [
            "The heartbeat Worker authenticates the push path before reading the body. It checks the configured secret's format, accepts only the expected POST route, limits bytes actually read to 16 KiB, requires JSON, and validates the payload and system counters. A rejected request must not make an old heartbeat appear current.",
          ],
          vi: [
            "Heartbeat Worker xác thực đường push trước khi đọc body. Nó kiểm tra định dạng secret cấu hình, chỉ nhận POST ở route mong đợi, giới hạn lượng byte thực đọc ở 16 KiB, yêu cầu JSON và kiểm tra payload cùng bộ đếm hệ thống. Request bị từ chối không được khiến heartbeat cũ trông như vừa được cập nhật.",
          ],
        },
        detail: {
          en: [
            "After validation, the Worker records Date.now() as the receive time and awaits a prepared D1 upsert before returning 204. The producer's timestamp is a required string but is not the clock used for freshness. That avoids treating a fast or misconfigured producer clock as evidence of recent contact. The upsert keeps the system identifier, receipt time, status, and counters rather than persisting the full message or optional detailed arrays. The ",
            {
              link: "initial migration",
              href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/heartbeat/migrations/0001.sql",
            },
            " makes those fields explicit and constrains counters to nonnegative values. This is a deliberately small state machine: the latest accepted observation replaces the previous one. It is not an append-only event ledger or a history of every heartbeat. Write failure returns an error instead of acknowledging a value that was never stored; availability of the storage layer remains part of the observable path.",
          ],
          vi: [
            "Sau validation, Worker lấy Date.now() làm thời điểm nhận và đợi prepared D1 upsert hoàn tất rồi mới trả 204. Timestamp từ producer bắt buộc phải là chuỗi, nhưng không được dùng làm đồng hồ tính độ mới. Nhờ đó đồng hồ chạy nhanh hoặc cấu hình sai ở producer không trở thành bằng chứng liên lạc gần đây. Upsert giữ mã hệ thống, thời điểm nhận, status và counters thay vì lưu nguyên message hay các mảng chi tiết tùy chọn. ",
            {
              link: "Migration đầu tiên",
              href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/heartbeat/migrations/0001.sql",
            },
            " khai báo rõ các trường đó và ràng buộc counters không âm. Đây là state machine nhỏ có chủ đích: quan sát hợp lệ mới nhất thay thế quan sát trước. Nó không phải event ledger append-only hay lịch sử của mọi heartbeat. Ghi thất bại trả lỗi thay vì xác nhận một giá trị chưa được lưu; tính sẵn sàng của lớp lưu trữ vẫn nằm trong đường quan sát.",
          ],
        },
        proof: {
          label: "heartbeat/src/index.js · push",
          href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/heartbeat/src/index.js",
        },
      },
      {
        id: "consumer",
        label: {
          en: "External consumer",
          vi: "Consumer bên ngoài",
        },
        title: {
          en: "Turn probes into a separate observation history",
          vi: "Biến probe thành lịch sử quan sát riêng",
        },
        summary: {
          en: [
            "The UptimeFlare-derived monitoring Worker reads its own stored compacted state, executes configured probes with bounded concurrency, updates incidents and latency records, and writes its state back to its own D1 binding. That database is not the heartbeat producer's D1 database, and a displayed status is not a direct read of the Beszel payload.",
          ],
          vi: [
            "Monitoring Worker phát triển từ UptimeFlare đọc compacted state do nó lưu, thực thi các probe cấu hình với concurrency có giới hạn, cập nhật incident và bản ghi latency rồi ghi state về D1 binding riêng. Database đó không phải D1 của producer heartbeat, và trạng thái hiển thị không phải lần đọc trực tiếp payload Beszel.",
          ],
        },
        detail: {
          en: [
            "In the scheduled handler, the concurrency limiter is set to five. Results update per-monitor incidents: a transition to down opens an incident, recovery closes it, and a changed error can extend the current incident's reason history. Persisting every successful sample is not assumed: the handler writes when a status changes or its configured write cooldown has elapsed. Consequently probe execution time and the last stored public snapshot are distinct notions of freshness. The ",
            {
              link: "store implementation",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/worker/src/store.ts",
            },
            " validates compacted data before using it and stores the serialized state through prepared statements. The ",
            {
              link: "probe implementation",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/worker/src/monitor.ts",
            },
            " separately checks response codes and optional body markers. Protected checks restrict credential injection to exact reviewed HTTPS targets and use manual redirects. Those controls describe how an observation is obtained; they do not turn a successful HTTP response into proof of a complete business transaction.",
          ],
          vi: [
            "Trong scheduled handler, concurrency limiter được đặt là năm. Kết quả cập nhật incident từng monitor: chuyển sang down mở incident, phục hồi đóng incident, còn thay đổi lỗi có thể bổ sung lịch sử nguyên nhân cho incident hiện tại. Không mặc định rằng mọi sample thành công đều được lưu ngay: handler ghi khi status thay đổi hoặc đã hết khoảng write cooldown được cấu hình. Do đó thời điểm thực hiện probe và snapshot công khai được lưu gần nhất là hai khái niệm độ mới khác nhau. ",
            {
              link: "Implementation lưu trữ",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/worker/src/store.ts",
            },
            " kiểm tra compacted data trước khi dùng, đồng thời lưu state đã serialize qua prepared statements. ",
            {
              link: "Implementation probe",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/worker/src/monitor.ts",
            },
            " kiểm tra riêng response code và body marker tùy chọn. Với protected checks, việc thêm credential bị giới hạn vào đúng target HTTPS đã review và redirect được xử lý ở chế độ manual. Các kiểm soát đó giải thích cách lấy quan sát; chúng không biến HTTP thành công thành bằng chứng cho một giao dịch nghiệp vụ hoàn chỉnh.",
          ],
        },
        proof: {
          label: "worker/src/index.ts · scheduled",
          href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/worker/src/index.ts",
        },
      },
      {
        id: "freshness",
        label: {
          en: "Signal interpretation",
          vi: "Diễn giải tín hiệu",
        },
        title: {
          en: "A recent heartbeat and a healthy system are different predicates",
          vi: "Heartbeat mới và hệ thống khỏe là hai điều kiện khác nhau",
        },
        summary: {
          en: [
            "The public live endpoint asks whether a valid stored observation is no older than 150 seconds. The systems endpoint adds a narrower policy: exactly one system, exactly one up, and no down, paused, or pending systems. Both return a small healthy/down response with no-store caching rather than exposing system details.",
          ],
          vi: [
            "Endpoint live công khai hỏi liệu quan sát hợp lệ đã lưu có tuổi không quá 150 giây. Endpoint systems thêm policy hẹp hơn: đúng một hệ thống, đúng một up, không có hệ thống down, paused hoặc pending. Cả hai trả response healthy/down nhỏ với cache no-store, thay vì công khai chi tiết hệ thống.",
          ],
        },
        detail: {
          en: [
            "The freshness comparison includes the 150-second boundary and rejects a receipt time in the future. Missing rows, invalid stored values, stale data, and read errors produce 503 instead of an optimistic green result. The stored resource status can be warn while both endpoints remain healthy, because these predicates are about recent contact and agent state rather than resource thresholds. Conversely, live may remain healthy while systems is down: that is meaningful information, not an inconsistent dashboard. The ",
            {
              link: "heartbeat tests",
              href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/heartbeat/test/heartbeat.test.js",
            },
            " encode cases for the inclusive boundary, rejected input, write errors, paused systems, and missing or stale state. Reading those tests establishes the intended regression cases, not proof that they were executed for this article. Detection latency also includes producer cadence, scheduling, network delay, and consumer sampling; a 150-second threshold is not a promise of an alert exactly 150 seconds after a failure.",
          ],
          vi: [
            "Phép so sánh độ mới bao gồm biên 150 giây và từ chối thời điểm nhận nằm trong tương lai. Không có row, giá trị đã lưu không hợp lệ, dữ liệu stale hay lỗi đọc đều dẫn tới 503 thay vì một kết quả xanh lạc quan. Resource status lưu trong row có thể là warn trong khi cả hai endpoint vẫn healthy, vì các điều kiện này hỏi về liên lạc gần đây và trạng thái agent chứ không phải ngưỡng tài nguyên. Ngược lại, live vẫn healthy nhưng systems down là thông tin có ý nghĩa, không phải dashboard tự mâu thuẫn. ",
            {
              link: "Các test heartbeat",
              href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/heartbeat/test/heartbeat.test.js",
            },
            " ghi lại tình huống biên bao gồm, input bị từ chối, lỗi ghi, hệ thống paused và state thiếu hoặc stale. Đọc test xác định các trường hợp regression dự kiến, không chứng minh chúng đã chạy cho bài này. Độ trễ phát hiện còn gồm nhịp producer, lịch chạy, mạng và lần lấy mẫu của consumer; ngưỡng 150 giây không phải lời hứa alert xuất hiện đúng 150 giây sau sự cố.",
          ],
        },
        proof: {
          label: "heartbeat/src/index.js · status / isFresh",
          href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/heartbeat/src/index.js",
        },
      },
      {
        id: "ownership",
        label: {
          en: "Release and recovery",
          vi: "Phát hành và phục hồi",
        },
        title: {
          en: "Independent consumers need independent rollback boundaries",
          vi: "Consumer độc lập cần ranh giới rollback riêng",
        },
        summary: {
          en: [
            "The Beszel runbook assigns Hub/Agent deployment and heartbeat deployment to this integration, explicitly excluding the public status page. The status repository documents a separate release artifact and central publishing path. A change to the consumer should not implicitly restart the host monitoring producer or take ownership of its database.",
          ],
          vi: [
            "Runbook Beszel giao việc triển khai Hub/Agent và heartbeat cho phần tích hợp này, đồng thời loại trừ rõ status page công khai. Repository trạng thái mô tả release artifact và đường publish trung tâm riêng. Thay đổi consumer không được ngầm restart producer giám sát máy chủ hay nhận quyền sở hữu database của producer.",
          ],
        },
        detail: {
          en: [
            "Recovery must respect stored data as well as code. The Beszel documentation calls for an off-host backup and an isolated restore exercise; a local backup alone is only a rollback aid. It also warns that reverting an image is safe only when the database schema remains compatible. The ",
            {
              link: "consumer's release documentation",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/README.md",
            },
            " describes selecting exact web and monitor Worker versions, without restoring D1 data or changing scheduling and DNS during an ordinary rollback. Those are documented operational boundaries, not a report that a restore was performed here. The same restraint applies to authorship: official Beszel software remains upstream work, while the integration and heartbeat policy are local work; UptimeFlare remains the status service's upstream. Keeping those distinctions visible makes a source-backed monitoring story more useful than attributing every component, every successful request, or an assumed service-level objective to one repository.",
          ],
          vi: [
            "Phục hồi phải tôn trọng dữ liệu đã lưu bên cạnh code. Tài liệu Beszel yêu cầu backup ngoài máy chủ và diễn tập restore trong môi trường tách biệt; backup cục bộ chỉ hỗ trợ rollback. Tài liệu cũng cảnh báo chỉ quay lại image cũ khi schema database còn tương thích. ",
            {
              link: "Tài liệu phát hành của consumer",
              href: "https://github.com/TheDemonTuan/tuan-uptimeflare/blob/61903d31b84a0865b55751a90d59bcd7e66372e1/README.md",
            },
            " mô tả chọn chính xác phiên bản web Worker và monitor Worker, không restore dữ liệu D1 hay đổi lịch chạy, DNS trong rollback thông thường. Đây là ranh giới vận hành được ghi nhận, không phải báo cáo rằng restore đã được thực hiện ở đây. Cũng phải tiết chế tương tự khi ghi công: phần mềm Beszel chính thức vẫn là công việc upstream, phần tích hợp và policy heartbeat là công việc tại repository này; UptimeFlare vẫn là upstream của dịch vụ trạng thái. Giữ các phân biệt ấy giúp câu chuyện giám sát có dẫn chứng hữu ích hơn việc quy mọi component, mọi request thành công hay một service-level objective giả định về cùng một repository.",
          ],
        },
        proof: {
          label: "tuan-beszel · deployment / rollback documentation",
          href: "https://github.com/TheDemonTuan/tuan-beszel/blob/8f954882bbc59ad61bcb9aef9e6419d0a695b1a3/README.md",
        },
      },
    ],
    limits: [
      {
        en: [
          "These are repository-backed policies, not a current incident report, an uptime measurement, or an SLA. A fresh heartbeat proves only that the Worker accepted a recent observation; it does not exercise an application's complete request path.",
        ],
        vi: [
          "Đây là các policy có source hỗ trợ, không phải báo cáo sự cố hiện tại, phép đo uptime hay SLA. Heartbeat mới chỉ chứng minh Worker đã nhận quan sát gần đây; nó không thực thi toàn bộ đường request của ứng dụng.",
        ],
      },
      {
        en: [
          "Worker, database, DNS, network, and observer failures can affect the signals themselves. Independent deployment ownership improves separation but does not remove correlated failures or guarantee notification delivery.",
        ],
        vi: [
          "Lỗi Worker, database, DNS, mạng và chính observer có thể tác động lên tín hiệu. Quyền triển khai độc lập tăng độ tách biệt nhưng không loại bỏ lỗi tương quan hay bảo đảm thông báo đến nơi.",
        ],
      },
      {
        en: [
          "The Beszel README still describes the repository as private, whereas this source snapshot was publicly readable. That stale visibility wording is not evidence of private access. Administrative procedures, credentials, sensitive host paths, and incident details are intentionally not reproduced.",
        ],
        vi: [
          "README Beszel vẫn mô tả repository là private trong khi snapshot source này đọc được công khai. Câu chữ visibility đã cũ không phải bằng chứng truy cập private. Bài chủ động không chép lại quy trình quản trị, credential, đường host nhạy cảm hay chi tiết sự cố.",
        ],
      },
    ],
  },
  {
    slug: "portfolio-as-a-source-backed-editorial-system",
    eyebrow: {
      en: "Portfolio architecture",
      vi: "Kiến trúc portfolio",
    },
    title: {
      en: "A bilingual portfolio built from evidence, not live counters",
      vi: "Portfolio song ngữ xây từ dẫn chứng, không từ bộ đếm trực tiếp",
    },
    description: {
      en: "Typed bilingual content, explicit project ownership, computed contribution evidence, progressive Three.js enhancement, and a static delivery boundary that stays separate from the shared VPS platform.",
      vi: "Nội dung song ngữ có kiểu, ownership dự án rõ ràng, dẫn chứng contribution được tính từ dữ liệu, Three.js tăng cường dần và ranh giới phân phối static tách khỏi nền tảng VPS dùng chung.",
    },
    published: "2026-10-23",
    updated: "2026-10-24",
    readTime: {
      en: "7 min read",
      vi: "9 phút đọc",
    },
    stack: ["Astro", "TypeScript", "Bun", "Three.js", "Nginx", "Caddy", "Docker", "GitHub Actions"],
    lede: {
      en: [
        "A technical portfolio is an editorial system before it is a visual effect. It decides what counts as original work, which upstream changes belong to history, what a number measures, and how a reader can inspect the evidence. This site keeps those decisions in typed bilingual data and emits ordinary static pages. The Systems Observatory design adds an optional local Three.js scene without moving navigation or project meaning into a canvas. The important boundary is not static versus interesting: it is content that remains usable independently of enhancement, sources that remain inspectable independently of live APIs, and deployment that stays within the repository's actual authority.",
      ],
      vi: [
        "Portfolio kỹ thuật trước hết là một hệ thống biên tập, rồi mới là hiệu ứng thị giác. Nó quyết định đâu là công việc tự xây, thay đổi upstream nào thuộc lịch sử, con số đang đo điều gì và người đọc kiểm tra dẫn chứng bằng cách nào. Site này đặt những quyết định đó trong dữ liệu song ngữ có kiểu và xuất thành trang static thông thường. Thiết kế Systems Observatory bổ sung scene Three.js local tùy điều kiện, không chuyển điều hướng hay ý nghĩa dự án vào canvas. Ranh giới quan trọng không phải static đối lập với thú vị: nội dung phải dùng được độc lập với enhancement, nguồn phải kiểm tra được độc lập với API trực tiếp, và triển khai phải nằm trong thẩm quyền thực sự của repository.",
      ],
    },
    architecture: [
      "typed EN / VI data",
      "shared Astro views",
      "static locale pages",
      "optional local Three.js",
      "Bun build",
      "Nginx",
      "shared Caddy / Tunnel",
    ],
    principles: [
      {
        title: {
          en: "Ownership is content",
          vi: "Ownership là nội dung",
        },
        body: {
          en: "Original projects, maintained forks, upstream-derived integrations, profile metadata, and historical pull requests need different labels. A polished card must not erase those distinctions.",
          vi: "Dự án tự xây, fork đang phát triển, phần tích hợp từ upstream, metadata hồ sơ và pull request lịch sử cần nhãn khác nhau. Card đẹp không được xóa những khác biệt đó.",
        },
      },
      {
        title: {
          en: "Publish a reproducible snapshot",
          vi: "Xuất bản snapshot tái lập được",
        },
        body: {
          en: "Repository research happens during authoring. Builds consume committed data rather than querying GitHub, while source links identify what was actually read and what belongs to an unpublished local change.",
          vi: "Nghiên cứu repository diễn ra khi biên soạn. Build dùng dữ liệu đã commit thay vì truy vấn GitHub; link source chỉ rõ nội dung đã đọc và nội dung thuộc thay đổi local chưa xuất bản.",
        },
      },
      {
        title: {
          en: "Enhance without taking control",
          vi: "Tăng cường mà không chiếm quyền",
        },
        body: {
          en: "Semantic HTML owns reading and navigation. The scene is an optional visual counterpart, with explicit eligibility, pause, failure, and teardown behavior instead of a canvas-only interface.",
          vi: "HTML ngữ nghĩa chịu trách nhiệm đọc và điều hướng. Scene chỉ là phần hình ảnh bổ sung tùy điều kiện, có quy tắc eligibility, pause, lỗi và teardown rõ ràng thay vì giao diện chỉ nằm trong canvas.",
        },
      },
    ],
    steps: [
      {
        id: "content",
        label: {
          en: "Editorial model",
          vi: "Mô hình biên tập",
        },
        title: {
          en: "Represent provenance before presenting projects",
          vi: "Biểu diễn nguồn gốc trước khi trình bày dự án",
        },
        summary: {
          en: [
            "The content model separates a repository catalogue from long-form articles and historical contribution records. PersonalProject carries an ownership kind, upstream URL, evidence URL, and optional related article. Article and ArticleStep hold localized prose and section-level proof links rather than embedding a second content format in page markup.",
          ],
          vi: [
            "Mô hình nội dung tách catalogue repository khỏi bài dài và contribution lịch sử. PersonalProject mang loại ownership, URL upstream, URL dẫn chứng và bài liên quan nếu có. Article và ArticleStep chứa văn bản được bản địa hóa cùng proof link từng mục, thay vì nhúng một định dạng nội dung thứ hai vào markup trang.",
          ],
        },
        detail: {
          en: [
            "This is a practical defense against a common portfolio ambiguity: a repository URL alone says little about authorship. A maintained fork is useful work, but it is not authorship of the entire upstream product. An infrastructure integration can be original while depending on official upstream images. A profile repository is metadata, not a feature-rich application waiting for an invented write-up. Those distinctions belong in data so that the index, selected cards, stack provenance, and scene links can share them. The six scene project identifiers point to catalogue records instead of introducing a second set of titles and URLs inside rendering code. Long-form articles then explain boundaries that a short card cannot: what the source implements, what an ADR merely documents, and which guarantees remain outside the evidence. The existing ",
            {
              link: "article contract",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/data/articles.ts",
            },
            " supports that editorial discipline with a lede, architecture, principles, five ordered sections, and explicit limits; it does not itself certify the truth of a claim.",
          ],
          vi: [
            "Đây là cách xử lý thực tế một điểm nhập nhằng thường gặp ở portfolio: riêng URL repository nói rất ít về quyền tác giả. Duy trì fork là công việc hữu ích, nhưng không phải tự viết toàn bộ sản phẩm upstream. Phần tích hợp hạ tầng có thể là công việc tự xây trong khi vẫn phụ thuộc image chính thức của upstream. Repository hồ sơ chỉ là metadata, không phải ứng dụng nhiều tính năng đang chờ một bài giới thiệu được tưởng tượng ra. Các phân biệt ấy cần nằm trong data để index, card chọn lọc, provenance của stack và link scene dùng chung. Sáu mã dự án cho scene trỏ vào catalogue thay vì tạo bộ title, URL thứ hai trong rendering code. Bài dài tiếp tục giải thích những ranh giới card ngắn không chứa nổi: source triển khai gì, ADR chỉ ghi nhận thiết kế gì và guarantee nào chưa có evidence. ",
            {
              link: "Contract bài viết",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/data/articles.ts",
            },
            " hiện có hỗ trợ kỷ luật biên tập đó bằng lede, kiến trúc, nguyên tắc, năm mục có thứ tự và giới hạn rõ ràng; bản thân kiểu dữ liệu không chứng nhận một claim là đúng.",
          ],
        },
        proof: {
          label: "src/data/personal-work.ts · ownership and evidence",
          href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/data/personal-work.ts",
        },
      },
      {
        id: "locales",
        label: {
          en: "Static editions",
          vi: "Các bản static",
        },
        title: {
          en: "Share views without shipping both languages",
          vi: "Dùng chung view mà không gửi cả hai ngôn ngữ",
        },
        summary: {
          en: [
            "L10n is a readonly record keyed by the supported Lang values. English uses the unprefixed path; Vietnamese uses /vi/. Route wrappers pass a language into shared Astro views, so localization selects the content during static rendering rather than toggling two copies of the page after hydration.",
          ],
          vi: [
            "L10n là readonly record có key theo các giá trị Lang được hỗ trợ. Tiếng Anh dùng đường không prefix; tiếng Việt dùng /vi/. Route wrapper truyền ngôn ngữ vào Astro view dùng chung, vì vậy nội dung được chọn khi render static thay vì bật tắt hai bản sao của trang sau hydration.",
          ],
        },
        detail: {
          en: [
            "localizePath centralizes the locale prefix and trailing slash for app-absolute links. neutralPath removes a known locale prefix, and alternatePath builds the counterpart URL from that neutral path. This keeps a language switch on the same article or contribution instead of sending the reader back to a homepage. The ",
            {
              link: "shared workPaths helper",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/data/routes.ts",
            },
            " generates detail paths from the article and contribution collections for both editions. The ",
            {
              link: "Vietnamese detail wrapper",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/pages/vi/work/%5Bslug%5D.astro",
            },
            " demonstrates the boundary: it chooses localized title and description, sets lang, and delegates the body to a shared view. Technical identifiers, source filenames, and code names can remain stable across editions while the explanation is genuinely translated. This arrangement avoids a client-side translation dependency, but completeness still requires editorial work: a type requiring en and vi cannot detect a shallow translation, misleading terminology, or a link to the wrong evidence.",
          ],
          vi: [
            "localizePath tập trung cách thêm locale prefix và trailing slash cho link tuyệt đối trong ứng dụng. neutralPath bỏ prefix ngôn ngữ đã biết, còn alternatePath tạo URL đối ứng từ đường trung lập đó. Nhờ vậy đổi ngôn ngữ giữ người đọc ở cùng bài hay contribution thay vì đưa họ về homepage. ",
            {
              link: "Helper workPaths dùng chung",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/data/routes.ts",
            },
            " sinh detail path từ tập article và contribution cho cả hai bản. ",
            {
              link: "Detail wrapper tiếng Việt",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/pages/vi/work/%5Bslug%5D.astro",
            },
            " thể hiện ranh giới này: chọn title, description theo ngôn ngữ, đặt lang rồi giao body cho view chung. Mã định danh kỹ thuật, tên file source và tên code có thể giữ ổn định giữa hai bản trong khi phần giải thích phải thực sự được dịch. Cách tổ chức này không cần phụ thuộc dịch ở client, nhưng tính đầy đủ vẫn cần biên tập: kiểu bắt buộc en và vi không phát hiện bản dịch hời hợt, thuật ngữ sai lệch hay link nhầm evidence.",
          ],
        },
        proof: {
          label: "src/data/i18n.ts · locale path helpers",
          href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/data/i18n.ts",
        },
      },
      {
        id: "evidence",
        label: {
          en: "Source discipline",
          vi: "Kỷ luật nguồn",
        },
        title: {
          en: "A snapshot and an aggregate answer different questions",
          vi: "Snapshot và số tổng hợp trả lời hai câu hỏi khác nhau",
        },
        summary: {
          en: [
            "Contribution totals are calculated from the recorded pull requests, not from the current personal repository count or an upstream project's marketing figures. allPullRequests flattens the contribution records; totals reduces their additions, deletions, file counts, and PR counts. Repository inventory is separately dated as an authoring snapshot.",
          ],
          vi: [
            "Tổng contribution được tính từ các pull request đã ghi nhận, không lấy từ số repository cá nhân hiện tại hay số liệu quảng bá của upstream. allPullRequests làm phẳng các contribution record; totals tổng hợp additions, deletions, số file và số PR. Inventory repository được ghi ngày riêng như một snapshot khi biên soạn.",
          ],
        },
        detail: {
          en: [
            "An aggregate is reproducible from its inputs, but its meaning still needs care. Summing files across pull requests counts file changes in those PR records; it is not necessarily the number of distinct paths touched across the whole history. Added lines are not a productivity score, a user count, or evidence of commercial impact. Historical merged work must therefore remain labeled as historical upstream work even when the current project catalogue changes. Source-backed articles add another distinction: implementation claims link to files at the commit that was actually read, while a design described only in a README or ADR remains documented design. No GitHub query is needed in the build or browser to refresh those claims. This portfolio article is the exception to immutable source links because it describes the local cutover itself: links use main file paths until that work has a published commit, rather than attaching a stale SHA to code that did not exist there. A visible snapshot date and honest link scope are more informative than a counter that silently changes after publication.",
          ],
          vi: [
            "Số tổng hợp có thể tái lập từ đầu vào, nhưng ý nghĩa vẫn cần được diễn giải cẩn thận. Cộng số file qua các pull request là đếm thay đổi file trong những PR record đó; chưa chắc là số đường dẫn khác nhau được chạm tới trong toàn bộ lịch sử. Số dòng thêm không phải điểm năng suất, số người dùng hay bằng chứng tác động thương mại. Vì vậy contribution đã merge phải tiếp tục được ghi rõ là công việc upstream lịch sử ngay cả khi catalogue dự án hiện tại thay đổi. Bài có dẫn chứng thêm một phân biệt nữa: claim implementation trỏ tới file tại commit thực sự đã đọc, còn thiết kế chỉ xuất hiện trong README hoặc ADR vẫn chỉ là thiết kế được ghi nhận. Build và browser không cần truy vấn GitHub để cập nhật những claim đó. Bài portfolio này là ngoại lệ với link bất biến vì mô tả chính đợt cutover local: link dùng file path trên main tới khi công việc có commit đã xuất bản, thay vì gắn SHA cũ vào code chưa từng tồn tại ở đó. Ngày snapshot hiển thị rõ cùng phạm vi link trung thực cung cấp nhiều thông tin hơn bộ đếm lặng lẽ thay đổi sau xuất bản.",
          ],
        },
        proof: {
          label: "src/data/contributions.ts · allPullRequests / totals",
          href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/data/contributions.ts",
        },
      },
      {
        id: "enhancement",
        label: {
          en: "Progressive scene",
          vi: "Scene tăng cường dần",
        },
        title: {
          en: "Make the observatory optional before downloading Three.js",
          vi: "Đặt scene ở chế độ tùy chọn trước khi tải Three.js",
        },
        summary: {
          en: [
            "The Systems Observatory enhancement contract starts with static HTML links and a composed SVG fallback. A lightweight custom-element controller owns eligibility and lifecycle; a separate renderer owns Three.js resources. A decorative canvas supplies depth and motion, not the only route to a project or the only copy of its meaning.",
          ],
          vi: [
            "Contract tăng cường Systems Observatory bắt đầu bằng link HTML static và SVG fallback đã được bố cục hoàn chỉnh. Controller custom element nhẹ quản lý eligibility cùng lifecycle; renderer riêng quản lý tài nguyên Three.js. Canvas trang trí bổ sung chiều sâu, chuyển động, không phải đường duy nhất tới dự án hay bản duy nhất chứa ý nghĩa của dự án.",
          ],
        },
        detail: {
          en: [
            "The controller gates the renderer import on a viewport of at least 960 pixels, a fine pointer with hover, no reduced-motion request, no save-data request, and proximity to the viewport. The SVG remains visible until a real first frame succeeds. A user pause, an offscreen scene, or a hidden document stops continuous rendering; theme, highlight, and resize changes still refresh the static frame while paused. Loss of eligibility tears the renderer down, while initialization failure or context loss deliberately returns to a usable static state rather than pretending the scene is ready. Disconnection and pagehide release resources and browser listeners; pageshow re-evaluates eligibility and creates a new renderer when appropriate. These mechanisms are not a claim of universal GPU compatibility. HTML retains focus and links, the controller manages browser events, and the renderer receives project identifiers and colors without fetching repository metadata. Inspect the module boundary alongside the ",
            {
              link: "scene controller",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/scripts/immersive-scene.ts",
            },
            " when reviewing the published implementation.",
          ],
          vi: [
            "Controller chặn import renderer cho tới khi viewport rộng ít nhất 960 pixel, pointer fine có hover, không yêu cầu reduced motion, không yêu cầu save data và scene ở gần viewport. SVG tiếp tục hiện tới khi frame đầu thực sự thành công. Người dùng pause, scene ra ngoài màn hình hoặc document bị ẩn đều dừng render liên tục; thay đổi theme, highlight và resize vẫn cập nhật frame static khi đang pause. Mất eligibility dẫn tới teardown renderer, còn lỗi khởi tạo hay context loss chủ động quay về trạng thái static dùng được thay vì giả scene đã ready. Disconnection và pagehide giải phóng tài nguyên cùng browser listener; pageshow xét lại eligibility và tạo renderer mới khi phù hợp. Những cơ chế này không phải khẳng định tương thích với mọi GPU. HTML giữ focus và link, controller quản lý browser event, renderer nhận mã dự án cùng màu sắc mà không fetch metadata repository. Khi review implementation được xuất bản, cần đối chiếu ranh giới module local với ",
            {
              link: "scene controller",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/scripts/immersive-scene.ts",
            },
            ".",
          ],
        },
        proof: {
          label: "immersive-scene.ts · eligibility and lifecycle",
          href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/src/scripts/immersive-scene.ts",
        },
      },
      {
        id: "delivery",
        label: {
          en: "Build and ingress",
          vi: "Build và ingress",
        },
        title: {
          en: "Use Bun to build; keep production a static boundary",
          vi: "Dùng Bun để build; giữ production ở ranh giới static",
        },
        summary: {
          en: [
            "Bun owns the development and build toolchain, but it is not the production application server. The Dockerfile installs from bun.lock with a frozen dependency graph, builds the Astro site, and copies dist into an unprivileged Nginx image. The runtime serves static files and a small health endpoint.",
          ],
          vi: [
            "Bun phụ trách toolchain phát triển và build, không phải application server production. Dockerfile cài từ bun.lock với dependency graph frozen, build site Astro rồi copy dist vào image Nginx không đặc quyền. Runtime phục vụ file static và health endpoint nhỏ.",
          ],
        },
        detail: {
          en: [
            "The ",
            {
              link: "package scripts",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/package.json",
            },
            " keep Astro-aware checking for .astro files, use Bun's native TypeScript tooling for its supported scope, and retain Playwright and Bash for the browser and deployment behaviors they already exercise. A runtime migration does not justify replacing those suites with a token test. The ",
            {
              link: "deployment workflow",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/.github/workflows/deploy.yml",
            },
            " builds before publishing an image and passes the published digest to deployment. Production ingress remains the shared Cloudflare Tunnel and Caddy topology documented for this portfolio; Compose gives the application a private network alias and publishes no host port. That is not the Traefik blue-green platform described in the separate vps-deploy article, and writing about that platform does not migrate this site onto it. The application repository owns its container delivery, not the shared gateway's entire lifecycle. Local procedural scene assets also avoid a new model, texture, or CDN dependency; the actual response policy remains the authority, not a blanket claim that every external origin is forbidden.",
          ],
          vi: [
            "Các ",
            {
              link: "package script",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/package.json",
            },
            " giữ checker hiểu Astro cho file .astro, dùng công cụ TypeScript native của Bun trong phạm vi được hỗ trợ và giữ Playwright, Bash cho hành vi browser, triển khai mà các suite đó đang kiểm tra. Đổi runtime không phải lý do thay chúng bằng test tượng trưng. ",
            {
              link: "Workflow triển khai",
              href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/.github/workflows/deploy.yml",
            },
            " build trước khi publish image và chuyển digest đã publish sang bước deployment. Ingress production vẫn là topology Cloudflare Tunnel và Caddy dùng chung được ghi nhận cho portfolio; Compose cấp network alias riêng cho ứng dụng và không publish host port. Đây không phải nền tảng blue-green Traefik trong bài vps-deploy riêng, và viết về nền tảng đó không có nghĩa site được chuyển sang nó. Repository ứng dụng sở hữu đường phân phối container của mình, không sở hữu toàn bộ lifecycle gateway dùng chung. Asset scene procedural local cũng tránh thêm phụ thuộc model, texture hay CDN; response policy thực tế mới là nguồn có thẩm quyền, không phải tuyên bố bao quát rằng mọi external origin đều bị cấm.",
          ],
        },
        proof: {
          label: "Dockerfile · Bun builder / Nginx runtime",
          href: "https://github.com/TheDemonTuan/tuan-portfolio/blob/main/Dockerfile",
        },
      },
    ],
    limits: [
      {
        en: [
          "This article reports the content and delivery architecture and states the approved enhancement contract. It does not supply measured JavaScript bytes, Lighthouse scores, frame rates, or evidence that all browsers and GPUs satisfy that contract. Such results require the separate implementation verification.",
        ],
        vi: [
          "Bài ghi nhận kiến trúc nội dung, phân phối và nêu contract enhancement đã duyệt. Bài không cung cấp số đo byte JavaScript, điểm Lighthouse, frame rate hay bằng chứng mọi browser, GPU đều đáp ứng contract. Những kết quả đó cần đợt kiểm chứng implementation riêng.",
        ],
      },
      {
        en: [
          "Main-path source links describe the portfolio cutover rather than a frozen published revision. The monitoring and application articles use pinned upstream snapshots; this local article must not borrow an old portfolio SHA for files added during the redesign.",
        ],
        vi: [
          "Link source dùng main path mô tả đợt cutover portfolio, không phải revision xuất bản đã đóng băng. Bài giám sát và ứng dụng dùng snapshot source đã pin; bài local này không được mượn SHA portfolio cũ cho file được thêm trong redesign.",
        ],
      },
      {
        en: [
          "Typed data improves consistency, not factual correctness by itself. Review still has to check authorship, translation quality, source accessibility, documented-versus-implemented boundaries, and the distinction between historical PR totals and current personal projects.",
        ],
        vi: [
          "Dữ liệu có kiểu tăng tính nhất quán, không tự bảo đảm sự thật. Review vẫn phải kiểm tra quyền tác giả, chất lượng dịch, khả năng truy cập source, ranh giới thiết kế được ghi nhận với implementation và khác biệt giữa tổng PR lịch sử với dự án cá nhân hiện tại.",
        ],
      },
    ],
  },
];

export function articleBySlug(slug: string): Article {
  const article = articles.find((entry) => entry.slug === slug);
  if (!article) throw new Error(`Unknown article slug: ${slug}`);
  return article;
}
