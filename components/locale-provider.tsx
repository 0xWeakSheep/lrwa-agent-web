"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  isLocale,
  localeHtmlLang,
  type Locale,
} from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  choose: <T>(en: T, zh: T) => T;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [, startTransition] = useTransition();

  const choose = useCallback(
    <T,>(en: T, zh: T): T => (locale === "zh" ? zh : en),
    [locale],
  );

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (!isLocale(nextLocale)) {
        return;
      }

      setLocaleState(nextLocale);
      document.documentElement.lang = localeHtmlLang(nextLocale);

      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;

      startTransition(() => {
        router.refresh();
      });
    },
    [router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ choose, locale, setLocale }),
    [choose, locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return context;
}
