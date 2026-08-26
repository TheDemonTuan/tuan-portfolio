export const LANGS = ["en", "vi"] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

/** A value that exists in both languages. */
export type L10n<T = string> = Readonly<Record<Lang, T>>;

export function t<T>(value: L10n<T>, lang: Lang): T {
  return value[lang];
}

export const LOCALE_TAG: L10n = { en: "en-US", vi: "vi-VN" };

export const OG_LOCALE: L10n = { en: "en_US", vi: "vi_VN" };

export const LANG_LABEL: L10n = { en: "English", vi: "Tiếng Việt" };

/**
 * Turn an app-absolute path into its localized form. Every internal href goes
 * through here so the trailing slash and the `/vi` prefix are never hand-typed.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.endsWith("/") ? path : `${path}/`;
  return lang === DEFAULT_LANG ? clean : `/${lang}${clean}`;
}

/** Strip any known locale prefix, returning the canonical English path. */
export function neutralPath(pathname: string): string {
  const clean = pathname.endsWith("/") ? pathname : `${pathname}/`;
  for (const lang of LANGS) {
    if (lang === DEFAULT_LANG) continue;
    if (clean === `/${lang}/`) return "/";
    if (clean.startsWith(`/${lang}/`)) return clean.slice(lang.length + 1);
  }
  return clean;
}

/** The counterpart of the current URL in the other language. */
export function alternatePath(pathname: string, target: Lang): string {
  return localizePath(neutralPath(pathname), target);
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "vi" : "en";
}
