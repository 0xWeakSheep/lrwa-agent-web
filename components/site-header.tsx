"use client";

import Link from "next/link";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "./locale-provider";

export function Brand() {
  return (
    <Link className="brand-lockup" href="/" aria-label="LRWA home">
      <span className="brand-symbol" aria-hidden>
        <svg fill="none" viewBox="0 0 100 100">
          <path d="M50 12L70 76.72L30 76.72Z" />
          <path d="M88 32L15 70V42Z" />
        </svg>
      </span>
      <span>LRWA</span>
    </Link>
  );
}

export function SiteHeader() {
  const { choose } = useI18n();

  return (
    <header className="site-header">
      <Brand />
      <nav aria-label={choose("Primary navigation", "主导航")}>
        <LanguageToggle compact />
        <Link href="/#method">{choose("Method", "方法")}</Link>
        <Link href="/#boundaries">{choose("Boundaries", "边界")}</Link>
        <Link href="/investigations">
          {choose("Start investigation", "发起调查")}
        </Link>
      </nav>
    </header>
  );
}
