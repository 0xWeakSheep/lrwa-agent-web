import type { Metadata } from "next";
import { MissionWorkbench } from "@/components/mission-workbench";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "角色调查任务台",
  description: "审核多角色、多阶段询问，并记录实际获得的证据回执。",
};

export default function LiveMissionPage() {
  return (
    <WorkspaceShell
      activeStep="live"
      title="让每个角色完成一次有边界的深挖。"
      description="审核首轮询问、继续追问和证据要求。复制不等于发送，只有你确认来源并录入的用户回执才会进入账本。"
    >
      <MissionWorkbench />
    </WorkspaceShell>
  );
}
