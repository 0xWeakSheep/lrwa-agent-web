import type { Metadata } from "next";
import { DocsDocument } from "@/components/docs-document";
import { getWhitepaperContent } from "@/lib/docs-content";
import { chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: chooseLocale(locale, "Product whitepaper", "产品白皮书"),
    description: chooseLocale(
      locale,
      "The LRWA method for role-based commercial investigation, evidence provenance, and decision-first reporting.",
      "LRWA 关于多角色商业调查、证据来源与结论优先报告的方法说明。",
    ),
  };
}

export default async function WhitepaperPage() {
  const locale = await getRequestLocale();

  return (
    <DocsDocument content={getWhitepaperContent(locale)} locale={locale} />
  );
}
