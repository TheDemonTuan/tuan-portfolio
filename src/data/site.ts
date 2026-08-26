import type { L10n } from "./i18n";

export interface ContactLink {
  readonly id: "email" | "github" | "linkedin" | "cv";
  readonly label: L10n;
  readonly value: L10n;
  readonly href: string | null;
  readonly icon: "mail" | "github" | "linkedin" | "download";
  readonly external: boolean;
}

/**
 * The address is stored split so no crawlable `mailto:` string exists in the
 * static HTML; `ContactList` reassembles it in the browser.
 */
const EMAIL = { user: "leanhthu2603", domain: "gmail.com" } as const;

export interface CvFile {
  readonly href: string;
  readonly updated: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly shortName: string;
  readonly initials: string;
  readonly handle: string;
  readonly origin: string;
  readonly github: string;
  readonly email: { readonly user: string; readonly domain: string };
  /** Set when the URL exists. `null` means the entry is not rendered at all. */
  readonly linkedin: string | null;
  /** Set once a PDF is dropped into `public/`. `null` hides the button. */
  readonly cv: CvFile | null;
  readonly coords: string;
  readonly timezone: string;
  readonly location: L10n;
  readonly role: L10n;
  readonly availability: L10n;
  readonly languages: L10n;
}

export const site: SiteConfig = {
  name: "Nguyễn Viết Tuấn",
  shortName: "Tuấn",
  initials: "NVT",
  handle: "TheDemonTuan",
  origin: "https://tuannguyenviet.site",
  github: "https://github.com/TheDemonTuan",
  email: EMAIL,
  linkedin: null,
  cv: null,
  coords: "21.0285° N / 105.8542° E",
  timezone: "UTC+7",
  location: { en: "Hanoi, Vietnam", vi: "Hà Nội, Việt Nam" } satisfies L10n,
  role: { en: "Backend developer", vi: "Lập trình viên backend" } satisfies L10n,
  availability: {
    en: "Open to backend and platform work",
    vi: "Đang tìm cơ hội backend và platform",
  } satisfies L10n,
  languages: {
    en: "Vietnamese (native), English (professional)",
    vi: "Tiếng Việt (bản ngữ), tiếng Anh (công việc)",
  } satisfies L10n,
};

export const emailAddress = `${EMAIL.user}@${EMAIL.domain}`;

export function contactLinks(): readonly ContactLink[] {
  const links: ContactLink[] = [
    {
      id: "email",
      label: { en: "Email", vi: "Email" },
      value: { en: emailAddress, vi: emailAddress },
      href: null, // assembled client-side
      icon: "mail",
      external: false,
    },
    {
      id: "github",
      label: { en: "GitHub", vi: "GitHub" },
      value: { en: `@${site.handle}`, vi: `@${site.handle}` },
      href: site.github,
      icon: "github",
      external: true,
    },
  ];

  if (site.linkedin) {
    links.push({
      id: "linkedin",
      label: { en: "LinkedIn", vi: "LinkedIn" },
      value: { en: "Profile", vi: "Hồ sơ" },
      href: site.linkedin,
      icon: "linkedin",
      external: true,
    });
  }

  if (site.cv) {
    links.push({
      id: "cv",
      label: { en: "Résumé", vi: "Hồ sơ năng lực" },
      value: { en: `PDF · ${site.cv.updated}`, vi: `PDF · ${site.cv.updated}` },
      href: site.cv.href,
      icon: "download",
      external: false,
    });
  }

  return links;
}
