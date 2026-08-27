import type { L10n } from "./i18n";

/** Chrome strings only. Page prose lives in `src/data/copy/`. */
export const ui = {
  skipToContent: { en: "Skip to content", vi: "Bỏ qua đến nội dung" },
  mainNav: { en: "Main navigation", vi: "Điều hướng chính" },
  home: { en: "Home", vi: "Trang chủ" },
  backToTop: { en: "Back to top", vi: "Lên đầu trang" },
  themeToLight: { en: "Switch to the light edition", vi: "Chuyển sang bản nền sáng" },
  themeToDark: { en: "Switch to the dark edition", vi: "Chuyển sang bản nền tối" },
  light: { en: "Light", vi: "Sáng" },
  dark: { en: "Dark", vi: "Tối" },
  switchLanguage: { en: "Đọc bằng tiếng Việt", vi: "Read this in English" },
  asOf: { en: "as of", vi: "tính đến" },
  merged: { en: "Merged", vi: "Đã merge" },
  viewPullRequest: { en: "View the pull request", vi: "Xem pull request" },
  readTheWork: { en: "Read the write-up", vi: "Đọc phân tích" },
  allContributions: { en: "All contributions", vi: "Toàn bộ đóng góp" },
  previous: { en: "Previous", vi: "Trước" },
  next: { en: "Next", vi: "Tiếp" },
  nav: {
    work: { en: "Notes / Work", vi: "Bài viết / Dự án" },
    about: { en: "About", vi: "Giới thiệu" },
    colophon: { en: "Colophon", vi: "Kỹ thuật" },
  },
  table: {
    pr: { en: "PR", vi: "PR" },
    merged: { en: "Merged", vi: "Merge" },
    area: { en: "Area", vi: "Mảng" },
    change: { en: "Change", vi: "Thay đổi" },
    diff: { en: "Diff", vi: "Diff" },
    files: { en: "Files", vi: "File" },
    link: { en: "Link", vi: "Link" },
  },
  sections: {
    context: { en: "Context", vi: "Bối cảnh" },
    problem: { en: "What was broken", vi: "Cái gì đã hỏng" },
    change: { en: "The change", vi: "Thay đổi" },
    impact: { en: "Why it matters", vi: "Vì sao nó quan trọng" },
    evidence: { en: "Evidence", vi: "Bằng chứng" },
  },
} as const satisfies Record<string, L10n | Record<string, L10n>>;
