import type { Metadata } from "next";
import { DecisionActions } from "@/components/decision-actions";
import { WorkspaceShell } from "@/components/workspace-shell";
import { bilingual, chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: chooseLocale(locale, "Next verification actions", "下一步核验"),
    description: chooseLocale(
      locale,
      "Turn unresolved uncertainty into concrete evidence actions for the next round.",
      "把尚未解决的不确定性变成下一轮具体证据动作。",
    ),
  };
}

export default function ActionsPage() {
  return (
    <WorkspaceShell
      activeStep="actions"
      title={bilingual(
        "Turn every gap into a next action.",
        "让每个缺口变成下一步动作。",
      )}
      description={bilingual(
        "The product does not stop at a static report. When a role has not acted, a receipt has not arrived, or a source still needs review, the next task remains visible.",
        "产品不会停在一份静态研报。角色没有执行、回执没有收到或来源尚未复核时，下一轮任务会保持清晰可见。",
      )}
    >
      <DecisionActions />
    </WorkspaceShell>
  );
}
