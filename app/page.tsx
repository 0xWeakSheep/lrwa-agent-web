import type { Metadata } from "next";
import { HomeExperience } from "@/components/home-experience";
import { chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: chooseLocale(locale, "Field Evidence Operations", "主动证据调查"),
    description: chooseLocale(
      locale,
      "Role-based AI agents turn missing commercial facts into fieldwork, traceable probes, and auditable evidence.",
      "让多角色 Agent 把缺失的商业事实变成调查任务、可追溯追问和可审计证据。",
    ),
  };
}

export default function Home() {
  return <HomeExperience />;
}
