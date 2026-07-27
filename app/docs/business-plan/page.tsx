import type { Metadata } from "next";
import { DocsDocument } from "@/components/docs-document";
import { getBusinessPlanContent } from "@/lib/docs-content";
import { chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: chooseLocale(locale, "Business plan", "商业计划书"),
    description: chooseLocale(
      locale,
      "LRWA's commercial thesis, target users, product status, business model hypotheses, and operating risks.",
      "LRWA 的商业逻辑、目标用户、产品状态、商业模式假设与运营风险。",
    ),
  };
}

export default async function BusinessPlanPage() {
  const locale = await getRequestLocale();

  return (
    <DocsDocument
      content={getBusinessPlanContent(locale)}
      locale={locale}
    />
  );
}
