import type { L10n } from "./i18n";

export type RichNode =
  string | { readonly code: string } | { readonly link: string; readonly href: string };

export type RichText = readonly RichNode[];

export type Area = "streaming" | "runtime" | "build";

export interface PullRequest {
  readonly number: number;
  /** Commit-style title, shown verbatim in both languages. */
  readonly title: string;
  readonly mergedAt: string;
  readonly additions: number;
  readonly deletions: number;
  readonly files: number;
}

export interface Contribution {
  readonly slug: string;
  readonly area: Area;
  readonly prs: readonly PullRequest[];
  readonly headline: L10n;
  readonly summary: L10n;
  readonly tech: readonly string[];
  readonly context: L10n<RichText>;
  readonly problem: L10n<RichText>;
  readonly change: L10n<RichText>;
  readonly impact: L10n<RichText>;
  readonly evidence: readonly L10n<RichText>[];
  readonly takeaway: L10n;
  readonly excerpt?: { readonly caption: L10n; readonly body: string };
}

export const OMNIROUTE = {
  name: "OmniRoute",
  repo: "diegosouzapw/OmniRoute",
  url: "https://github.com/diegosouzapw/OmniRoute",
  license: "MIT",
  language: "TypeScript",
  stars: 55917,
  forks: 7688,
  contributors: "450+",
  /** Counts are stamped, never fetched at build time, so builds stay reproducible. */
  statsAsOf: "2026-08-26",
  description: {
    en: "An AI gateway that puts a single endpoint in front of hundreds of model providers.",
    vi: "Một AI gateway đặt một endpoint duy nhất trước hàng trăm nhà cung cấp mô hình.",
  } satisfies L10n,
} as const;

export function prUrl(number: number): string {
  return `${OMNIROUTE.url}/pull/${number}`;
}

export const AREA_LABEL: Readonly<Record<Area, L10n>> = {
  streaming: { en: "Streaming", vi: "Streaming" },
  runtime: { en: "Runtime", vi: "Runtime" },
  build: { en: "Build", vi: "Build" },
};

const REQUIRE_BETTER_SQLITE = 'require("better-sqlite3")';
const NEW_URL_WORKER = 'new URL("compressionWorker.js", import.meta.url)';

export const contributions: readonly Contribution[] = [
  {
    slug: "sse-ingest-byte-budget",
    area: "streaming",
    prs: [
      {
        number: 11548,
        title:
          "fix(sse): scale chat admission by ingest byte budget instead of a fixed request count",
        mergedAt: "2026-08-26",
        additions: 1340,
        deletions: 279,
        files: 18,
      },
    ],
    headline: {
      en: "A fixed limit is a lie about capacity",
      vi: "Một giới hạn cố định là một lời nói dối về tài nguyên",
    },
    summary: {
      en: "Replaced a hardcoded in-flight request cap with a memory-derived byte budget, ending the 503 storms that hit coding agents running requests in parallel.",
      vi: "Thay hạn mức request cố định bằng ngân sách byte suy ra từ bộ nhớ thật, chấm dứt cơn bão 503 với các coding agent chạy request song song.",
    },
    tech: ["TypeScript", "SSE", "Backpressure", "cgroups", "Observability"],
    context: {
      en: [
        "OmniRoute admits chat requests through a gate before it reads the request body, so an overloaded host sheds work early instead of running out of memory mid-stream. That gate lives in ",
        { code: "chatBodyAdmission.ts" },
        " and guards every chat route, including ",
        { code: "/v1/messages" },
        ".",
      ],
      vi: [
        "OmniRoute cho request chat đi qua một cổng kiểm soát trước khi đọc body, để một máy quá tải loại bớt việc từ sớm thay vì hết bộ nhớ giữa chừng. Cổng đó nằm trong ",
        { code: "chatBodyAdmission.ts" },
        " và bảo vệ mọi route chat, bao gồm ",
        { code: "/v1/messages" },
        ".",
      ],
    },
    problem: {
      en: [
        "The gate capped heavyweight requests by a fixed count — ",
        { code: "OMNIROUTE_CHAT_MAX_HEAVY_IN_FLIGHT" },
        ", default ",
        { code: "1" },
        " — with no awareness of resource pressure whatsoever. It rejected a second concurrent request on a host with gigabytes of free memory. When coding agents fanned out across subagents sharing one API key, effective concurrency collapsed to roughly one: requests hung, retried, then came back ",
        { code: "503 chat_admission_busy" },
        ".",
      ],
      vi: [
        "Cổng này giới hạn request nặng theo một con số cố định — ",
        { code: "OMNIROUTE_CHAT_MAX_HEAVY_IN_FLIGHT" },
        ", mặc định ",
        { code: "1" },
        " — hoàn toàn không biết gì về áp lực tài nguyên. Nó từ chối request thứ hai ngay trên máy còn trống hàng gigabyte bộ nhớ. Khi các coding agent toả ra nhiều subagent dùng chung một API key, concurrency thực tế sụp về khoảng một: request treo, retry, rồi nhận về ",
        { code: "503 chat_admission_busy" },
        ".",
      ],
    },
    change: {
      en: [
        "A new module derives an ingest byte budget from the process's real memory ceiling — the V8 heap limit, or the tighter container limit via ",
        { code: "process.constrainedMemory()" },
        ". It scales itself from a 512 MB container to a multi-gigabyte desktop with no environment tuning. The byte gate is layered on top of the old counter rather than replacing it, so the legacy cap now binds only when its variable is set explicitly. Admission also consults live resource pressure: normal admits within budget after a short bounded wait, high honours the full queue wait, and critical sheds immediately with a distinct ",
        { code: "503 resource_pressure" },
        " before a single byte is ingested.",
      ],
      vi: [
        "Một module mới suy ra ngân sách byte từ trần bộ nhớ thật của tiến trình — giới hạn heap của V8, hoặc giới hạn container chặt hơn qua ",
        { code: "process.constrainedMemory()" },
        ". Nó tự co giãn từ container 512 MB tới máy để bàn nhiều gigabyte mà không cần chỉnh biến môi trường. Cổng byte được chồng lên bộ đếm cũ thay vì thay thế nó, nên hạn mức cũ giờ chỉ có hiệu lực khi biến của nó được đặt tường minh. Việc nạp request còn tham chiếu áp lực tài nguyên theo thời gian thực: mức bình thường cho qua trong ngân sách sau một khoảng chờ ngắn có giới hạn, mức cao tôn trọng trọn thời gian chờ hàng đợi, còn mức nguy cấp loại bỏ ngay với ",
        { code: "503 resource_pressure" },
        " riêng biệt, trước khi nạp một byte nào.",
      ],
    },
    impact: {
      en: [
        "Parallel agent traffic is admitted up to what the host can actually hold, and the gate's own state is exposed at ",
        { code: "GET /api/monitoring/health" },
        " — inflight bytes, the budget, where the budget came from, and the current pressure severity — so operators can read the limiter instead of guessing at it. Six operator documents that had told people to hand-tune the count cap were corrected in the same change.",
      ],
      vi: [
        "Lưu lượng agent song song được nạp tới đúng mức máy thật sự chịu được, và trạng thái của chính cổng đó được expose tại ",
        { code: "GET /api/monitoring/health" },
        " — số byte đang xử lý, ngân sách, nguồn gốc ngân sách, và mức áp lực hiện tại — để người vận hành đọc được bộ giới hạn thay vì phải đoán. Sáu tài liệu vận hành từng hướng dẫn chỉnh tay hạn mức đã được sửa trong cùng thay đổi này.",
      ],
    },
    evidence: [
      {
        en: [
          "A regression test reproduces the reported storm under the old gate — 1 admitted, 7 shed out of 8 concurrent requests — and then proves it is gone.",
        ],
        vi: [
          "Một regression test tái hiện đúng cơn bão đã báo cáo dưới cổng cũ — 1 được nạp, 7 bị loại trên 8 request song song — rồi chứng minh nó đã biến mất.",
        ],
      },
      {
        en: [
          "Every existing admission-controller test keeps its original constructor and an unlimited default budget, so the change is additive and none of them needed editing.",
        ],
        vi: [
          "Mọi test sẵn có của admission controller giữ nguyên constructor cũ và ngân sách mặc định không giới hạn, nên thay đổi là additive và không test nào phải sửa.",
        ],
      },
    ],
    takeaway: {
      en: "Measure the thing that is actually scarce, not the thing that is easy to count.",
      vi: "Hãy đo thứ thật sự khan hiếm, đừng đo thứ dễ đếm.",
    },
  },

  {
    slug: "bun-napi-abort",
    area: "runtime",
    prs: [
      {
        number: 11468,
        title: "fix(bun): use native bun:sqlite during startup to avoid N-API crash",
        mergedAt: "2026-08-25",
        additions: 77,
        deletions: 1,
        files: 5,
      },
      {
        number: 11470,
        title: "fix(docker-bun): make Bun image install and SQLite startup reliable",
        mergedAt: "2026-08-25",
        additions: 23,
        deletions: 12,
        files: 2,
      },
      {
        number: 11482,
        title: "fix(docker-bun): strip Node SQLite addon from runtime",
        mergedAt: "2026-08-25",
        additions: 32,
        deletions: 0,
        files: 3,
      },
    ],
    headline: {
      en: "A crash JavaScript cannot catch",
      vi: "Một cú crash mà JavaScript không bắt được",
    },
    summary: {
      en: "Traced an ARM64 Bun container that aborted before boot down to a single native addon, then made the broken state impossible to ship rather than merely survivable.",
      vi: "Truy vết một container Bun ARM64 chết trước khi boot về đúng một native addon, rồi làm cho trạng thái hỏng đó không thể lọt vào artifact, thay vì chỉ sống sót qua nó.",
    },
    tech: ["Bun", "N-API", "SQLite", "Docker", "ARM64", "Linux"],
    excerpt: {
      caption: {
        en: "The container's last words",
        vi: "Những dòng cuối cùng của container",
      },
      body: "Panic: NAPI FATAL ERROR: Error::New napi_get_last_error_info\nBun has crashed\nAborted (core dumped)\nExit code 134",
    },
    context: {
      en: [
        "OmniRoute already prefers Bun's built-in ",
        { code: "bun:sqlite" },
        " driver when it runs under Bun — that choice lives in ",
        { code: "driverFactory.ts" },
        ". The bootstrap code that runs before the database layer initialises did not know about it.",
      ],
      vi: [
        "OmniRoute vốn đã ưu tiên driver ",
        { code: "bun:sqlite" },
        " có sẵn của Bun khi chạy dưới Bun — lựa chọn đó nằm trong ",
        { code: "driverFactory.ts" },
        ". Phần code bootstrap chạy trước khi tầng cơ sở dữ liệu khởi tạo lại không biết điều đó.",
      ],
    },
    problem: {
      en: [
        "On Linux ARM64, the credential check in ",
        { code: "bootstrap-env.mjs" },
        " ran before the main driver initialised and called ",
        { code: REQUIRE_BETTER_SQLITE },
        ". Loading that native Node-API binary under Bun triggered a fatal N-API abort. A native abort is not a JavaScript exception: ",
        { code: "try/catch" },
        " cannot trap it, and the process dies before the server exists. There is no error handler to write, anywhere.",
      ],
      vi: [
        "Trên Linux ARM64, đoạn kiểm tra credential trong ",
        { code: "bootstrap-env.mjs" },
        " chạy trước khi driver chính khởi tạo và gọi ",
        { code: REQUIRE_BETTER_SQLITE },
        ". Nạp binary Node-API đó dưới Bun kích hoạt một abort N-API chí mạng. Abort ở tầng native không phải exception của JavaScript: ",
        { code: "try/catch" },
        " không bắt được, và tiến trình chết trước khi server tồn tại. Không có chỗ nào để viết error handler cả.",
      ],
    },
    change: {
      en: [
        "First, isolate the culprit. Probing every native addon against the exact failing image cleared ",
        { code: "keytar" },
        ", ",
        { code: "onnxruntime-node" },
        ", ",
        { code: "sqlite-vec" },
        ", ",
        { code: "tls-client-node" },
        ", ",
        { code: "wreq-js" },
        " and ",
        { code: "sharp" },
        " — only ",
        { code: "better-sqlite3" },
        " reproduced the abort. Then three layers of fix: the bootstrap paths use ",
        { code: "bun:sqlite" },
        " directly when ",
        { code: "process.versions.bun" },
        " is set; the Bun image's install and startup were made reliable; and every traced or vendored copy of the addon is removed after standalone assembly, with the image build failing outright if a ",
        { code: "better_sqlite3.node" },
        " binary survives.",
      ],
      vi: [
        "Trước hết, khoanh vùng thủ phạm. Thử từng native addon trên đúng image bị lỗi đã loại trừ ",
        { code: "keytar" },
        ", ",
        { code: "onnxruntime-node" },
        ", ",
        { code: "sqlite-vec" },
        ", ",
        { code: "tls-client-node" },
        ", ",
        { code: "wreq-js" },
        " và ",
        { code: "sharp" },
        " — chỉ ",
        { code: "better-sqlite3" },
        " tái hiện được abort. Sau đó là ba lớp sửa: các đường bootstrap dùng thẳng ",
        { code: "bun:sqlite" },
        " khi ",
        { code: "process.versions.bun" },
        " được đặt; phần install và startup của Bun image được làm cho đáng tin cậy; và mọi bản sao vendored hay traced của addon bị xoá sau khi assembly, kèm việc build image thất bại thẳng nếu còn sót binary ",
        { code: "better_sqlite3.node" },
        ".",
      ],
    },
    impact: {
      en: [
        "The ARM64 Bun image boots. Behaviour under Node.js is unchanged — ",
        { code: "better-sqlite3" },
        " is still the driver there. And because the build now fails on a leftover binary, this particular crash cannot reach a registry again: a runtime abort was converted into a build error.",
      ],
      vi: [
        "Image Bun ARM64 boot được. Hành vi dưới Node.js không đổi — ",
        { code: "better-sqlite3" },
        " vẫn là driver ở đó. Và vì build giờ thất bại khi còn sót binary, đúng cú crash này không thể lọt lên registry lần nữa: một abort lúc chạy đã được chuyển thành một lỗi lúc build.",
      ],
    },
    evidence: [
      {
        en: ["A build test fails before the fix and passes after it."],
        vi: ["Một build test thất bại trước khi sửa và thành công sau khi sửa."],
      },
      {
        en: [
          "Production ARM64 evidence: the final image booted, ",
          { code: "/healthz" },
          " passed, and a blue/green deployment completed with no ",
          { code: "NAPI FATAL ERROR" },
          ".",
        ],
        vi: [
          "Bằng chứng từ production ARM64: image cuối boot thành công, ",
          { code: "/healthz" },
          " pass, và một lượt deploy blue/green hoàn tất, không còn ",
          { code: "NAPI FATAL ERROR" },
          ".",
        ],
      },
      {
        en: [
          "A regression test verifies the runtime loader prefers ",
          { code: "bun:sqlite" },
          " under Bun without loading the Node addon at all.",
        ],
        vi: [
          "Một regression test xác nhận runtime loader ưu tiên ",
          { code: "bun:sqlite" },
          " dưới Bun mà hoàn toàn không nạp addon của Node.",
        ],
      },
    ],
    takeaway: {
      en: "Do not patch where it crashes. Make the crashing state impossible to build.",
      vi: "Đừng vá ở chỗ nó crash. Hãy làm cho trạng thái crash không thể build ra được.",
    },
  },

  {
    slug: "bundler-resolution",
    area: "build",
    prs: [
      {
        number: 11364,
        title:
          "fix(compression): use pathToFileURL for workerUrl to prevent bundler resolution failure",
        mergedAt: "2026-08-24",
        additions: 5,
        deletions: 3,
        files: 2,
      },
      {
        number: 11471,
        title:
          "build(bun): allow Turbopack bundler flag on Bun 1.4+ with configurable Webpack fallback",
        mergedAt: "2026-08-25",
        additions: 26,
        deletions: 5,
        files: 4,
      },
    ],
    headline: {
      en: "Five lines, two systems disagreeing",
      vi: "Năm dòng, hai hệ thống hiểu sai nhau",
    },
    summary: {
      en: "A production build failed on a worker file that does not exist at build time. The patch is small because the diagnosis was not.",
      vi: "Một bản build production thất bại vì một file worker không tồn tại lúc build. Bản vá nhỏ, vì phần chẩn đoán thì không.",
    },
    tech: ["Next.js", "Webpack", "Turbopack", "Worker threads", "Node.js", "Bun"],
    context: {
      en: [
        "The compression worker pool spawns Node worker threads and needs a file URL pointing at the worker script. The idiomatic way to write that is ",
        { code: NEW_URL_WORKER },
        ".",
      ],
      vi: [
        "Compression worker pool sinh ra các worker thread của Node và cần một file URL trỏ tới script worker. Cách viết thông dụng là ",
        { code: NEW_URL_WORKER },
        ".",
      ],
    },
    problem: {
      en: [
        "Webpack and Turbopack scan source statically during ",
        { code: "next build" },
        " and treat that exact expression as a static asset or worker import. At build time only the TypeScript source exists — there is no ",
        { code: "compressionWorker.js" },
        " yet — so both bundlers fail resolution and the Docker builder stops with ",
        { code: "Module not found" },
        ". The code is correct at runtime and wrong at build time, which is why it reads as a non-bug right up until the build breaks.",
      ],
      vi: [
        "Webpack và Turbopack quét source một cách tĩnh trong lúc ",
        { code: "next build" },
        " và coi đúng biểu thức đó là một static asset hoặc worker import. Lúc build chỉ có source TypeScript — chưa hề có ",
        { code: "compressionWorker.js" },
        " — nên cả hai bundler đều fail resolution và Docker builder dừng với ",
        { code: "Module not found" },
        ". Đoạn code đúng lúc chạy và sai lúc build, nên nó trông như không phải lỗi cho tới đúng lúc build vỡ.",
      ],
    },
    change: {
      en: [
        "Build the file URL dynamically with ",
        { code: "pathToFileURL(join(dir, ...))" },
        ". The bundlers can no longer intercept it statically, while Node's worker loader resolves exactly the same path at runtime. A companion change lets the Turbopack flag be used on Bun 1.4 and later, with a configurable Webpack fallback for anything older.",
      ],
      vi: [
        "Dựng file URL một cách động bằng ",
        { code: "pathToFileURL(join(dir, ...))" },
        ". Các bundler không còn chặn tĩnh được nữa, trong khi worker loader của Node vẫn resolve đúng đường dẫn đó lúc chạy. Một thay đổi đi kèm cho phép dùng cờ Turbopack trên Bun 1.4 trở lên, với fallback Webpack cấu hình được cho các phiên bản cũ hơn.",
      ],
    },
    impact: {
      en: [
        "Production builds pass under Webpack, Turbopack and the Docker builder, without changing what the worker pool does at runtime.",
      ],
      vi: [
        "Các bản build production chạy được dưới Webpack, Turbopack và Docker builder, mà không thay đổi hành vi lúc chạy của worker pool.",
      ],
    },
    evidence: [
      {
        en: [
          "Verified against a Next.js production build and reconciled with the upstream release branch.",
        ],
        vi: [
          "Đã kiểm chứng trên một bản build production của Next.js và hoà hợp với nhánh release của upstream.",
        ],
      },
    ],
    takeaway: {
      en: "The smallest diffs are the expensive ones. They sit where two systems disagree.",
      vi: "Những diff nhỏ nhất là những diff đắt nhất. Chúng nằm đúng chỗ hai hệ thống hiểu sai nhau.",
    },
  },
];

export interface FlatPullRequest extends PullRequest {
  readonly slug: string;
  readonly area: Area;
}

export const allPullRequests: readonly FlatPullRequest[] = contributions
  .flatMap((c) => c.prs.map((pr) => ({ ...pr, slug: c.slug, area: c.area })))
  .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt) || b.number - a.number);

export const totals = allPullRequests.reduce(
  (acc, pr) => ({
    prs: acc.prs + 1,
    files: acc.files + pr.files,
    additions: acc.additions + pr.additions,
    deletions: acc.deletions + pr.deletions,
  }),
  { prs: 0, files: 0, additions: 0, deletions: 0 },
);

export function contributionBySlug(slug: string): Contribution {
  const found = contributions.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown contribution slug: ${slug}`);
  return found;
}

/** Combined diff for a contribution that bundles several pull requests. */
export function contributionDiff(contribution: Contribution): {
  additions: number;
  deletions: number;
  files: number;
} {
  return contribution.prs.reduce(
    (acc, pr) => ({
      additions: acc.additions + pr.additions,
      deletions: acc.deletions + pr.deletions,
      files: acc.files + pr.files,
    }),
    { additions: 0, deletions: 0, files: 0 },
  );
}

/** Ordered neighbours for the prev/next footer on a detail page. */
export function contributionNeighbours(slug: string): {
  previous: Contribution | null;
  next: Contribution | null;
} {
  const index = contributions.findIndex((c) => c.slug === slug);
  return {
    previous: index > 0 ? contributions[index - 1]! : null,
    next: index < contributions.length - 1 ? contributions[index + 1]! : null,
  };
}
