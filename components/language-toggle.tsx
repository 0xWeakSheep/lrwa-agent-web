"use client";

import { useI18n } from "./locale-provider";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { choose, locale, setLocale } = useI18n();
  const nextLocale = locale === "en" ? "zh" : "en";
  const nextLabel = choose("中文", "English");
  const accessibleLabel = choose(
    "Switch interface language to Chinese",
    "将界面语言切换为英文",
  );

  return (
    <button
      aria-label={accessibleLabel}
      aria-pressed={locale === "zh"}
      className={`language-toggle${compact ? " compact" : ""}`}
      onClick={() => setLocale(nextLocale)}
      title={accessibleLabel}
      type="button"
    >
      <span aria-hidden>{nextLabel}</span>
    </button>
  );
}
