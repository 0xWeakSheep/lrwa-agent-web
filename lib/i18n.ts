export const SUPPORTED_LOCALES = ["en", "zh"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export interface BilingualCopy {
  en: string;
  zh: string;
}

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "lrwa-locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function localeHtmlLang(locale: Locale): "en" | "zh-CN" {
  return locale === "zh" ? "zh-CN" : "en";
}

export function chooseLocale<T>(locale: Locale, en: T, zh: T): T {
  return locale === "zh" ? zh : en;
}

export function bilingual(en: string, zh: string): BilingualCopy {
  return { en, zh };
}
