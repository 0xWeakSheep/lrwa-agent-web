import type { Metadata } from "next";
import { InvestigationBrief } from "@/components/investigation-brief";
import { WorkspaceShell } from "@/components/workspace-shell";
import { bilingual, chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";
import scenario from "@/lib/simulation-scenario.json";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: chooseLocale(
      locale,
      "Built-in investigation example",
      "内置调查示例",
    ),
    description: chooseLocale(
      locale,
      "Review a real subject prefilled in the interface, then step through the complete simulation.",
      "查看已经填入前端的真实调查对象，然后逐步进入完整模拟流程。",
    ),
  };
}

export default function BuiltInExamplePage() {
  return (
    <WorkspaceShell
      activeStep="plan"
      caseMetaOverride={bilingual(
        "Built-in interface example · prefilled",
        "内置前端示例 · 已预填",
      )}
      caseTitleOverride={bilingual(
        "Starbucks stores associated with Shanghai Jing'an Kerry Centre",
        scenario.subject,
      )}
      disclosureOverride={bilingual(
        "The example is prefilled below. Next only enters a local simulation and will not access stores, customer service, or external platforms.",
        "示例内容已经填入下方表单。点击下一步只进入本地模拟，不会访问门店、客服或外部平台。",
      )}
      storageLabelOverride={bilingual(
        "Example input · not written to the ledger",
        "示例输入 · 尚未写入账本",
      )}
      title={bilingual(
        "Everything is prefilled. Continue when ready.",
        "内容已经填好，直接看下一步。",
      )}
      description={bilingual(
        "Confirm the real subject, claim, and public sources, then step through persona fan-out, inquiry waves, response branches, and the evidence gate.",
        "先确认真实对象、待验证命题和公开来源，再点击下一步逐屏查看人物分身、询问波次、响应分支与证据门槛。",
      )}
    >
      <InvestigationBrief forceExample />
    </WorkspaceShell>
  );
}
