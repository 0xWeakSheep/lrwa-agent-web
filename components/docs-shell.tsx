import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import type { DocsDocumentVariant } from "@/lib/docs-content";
import type { Locale } from "@/lib/i18n";

interface DocsShellProps {
  children: ReactNode;
  locale: Locale;
  variant?: "index" | DocsDocumentVariant;
}

export function DocsShell({
  children,
  locale,
  variant = "index",
}: DocsShellProps) {
  const isZh = locale === "zh";

  return (
    <div className={`docs-root docs-root--${variant}`}>
      <SiteHeader />
      <div className="docs-backdrop" aria-hidden />
      <main className="docs-main" id="main-content">
        <header className="docs-subnav">
          <Link className="docs-subnav-title" href="/docs">
            {isZh ? "项目文档" : "Docs"}
          </Link>
          <nav
            aria-label={isZh ? "文档导航" : "Documentation navigation"}
            className="docs-subnav-links"
          >
            <Link
              aria-current={variant === "business-plan" ? "page" : undefined}
              href="/docs/business-plan"
            >
              {isZh ? "商业计划书" : "Business plan"}
            </Link>
            <Link
              aria-current={variant === "whitepaper" ? "page" : undefined}
              href="/docs/whitepaper"
            >
              {isZh ? "白皮书" : "Whitepaper"}
            </Link>
          </nav>
        </header>
        {children}
      </main>
    </div>
  );
}
