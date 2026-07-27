import type { Metadata } from "next";
import { MissionWorkbench } from "@/components/mission-workbench";
import { WorkspaceShell } from "@/components/workspace-shell";
import { bilingual, chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: chooseLocale(
      locale,
      "Role investigation workbench",
      "角色调查任务台",
    ),
    description: chooseLocale(
      locale,
      "Review multi-role, multi-stage inquiries and record evidence receipts actually obtained.",
      "审核多角色、多阶段询问，并记录实际获得的证据回执。",
    ),
  };
}

export default function LiveMissionPage() {
  return (
    <WorkspaceShell
      activeStep="live"
      title={bilingual(
        "Give every role a bounded path to investigate.",
        "让每个角色完成一次有边界的深挖。",
      )}
      description={bilingual(
        "Review the opening inquiry, follow-up rule, and evidence requirement. Copying is not sending; only receipts you confirm and enter can reach the ledger.",
        "审核首轮询问、继续追问和证据要求。复制不等于发送，只有你确认来源并录入的用户回执才会进入账本。",
      )}
    >
      <MissionWorkbench />
    </WorkspaceShell>
  );
}
