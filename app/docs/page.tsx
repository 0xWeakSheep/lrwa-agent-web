import type { Metadata } from "next";
import { DocsIndex } from "@/components/docs-index";
import { chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: chooseLocale(locale, "Company documents", "项目文档"),
    description: chooseLocale(
      locale,
      "Read the LRWA business plan and product whitepaper.",
      "阅读 LRWA 商业计划书与产品白皮书。",
    ),
  };
}

export default async function DocsPage() {
  const locale = await getRequestLocale();
  return <DocsIndex locale={locale} />;
}
