import type { Metadata } from "next";
import { InvestigationBrief } from "@/components/investigation-brief";
import { WorkspaceShell } from "@/components/workspace-shell";
import { bilingual, chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: chooseLocale(
      locale,
      "Define an investigation claim",
      "定义调查主张",
    ),
    description: chooseLocale(
      locale,
      "Start with a falsifiable commercial claim and design role-based inquiry paths.",
      "从一个可被证伪的商业主张开始设计角色化调查路径。",
    ),
  };
}

export default function MissionPlanPage() {
  return (
    <WorkspaceShell
      activeStep="plan"
      title={bilingual(
        "Define what must be true first.",
        "先定义什么必须是真的。",
      )}
      description={bilingual(
        "Enter the subject and a critical claim. The system creates role paths for review, but it does not access external platforms or prefill results.",
        "输入调查对象和关键主张。系统只生成待审核的角色路径，不会自动访问外部平台，也不会预填任何结果。",
      )}
    >
      <InvestigationBrief />
    </WorkspaceShell>
  );
}
