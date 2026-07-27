import type { Metadata } from "next";
import { InvestigationBrief } from "@/components/investigation-brief";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "定义调查主张",
  description: "从一个可被证伪的商业主张开始设计角色化调查路径。",
};

export default function MissionPlanPage() {
  return (
    <WorkspaceShell
      activeStep="plan"
      title="先定义什么必须是真的。"
      description="输入调查对象和关键主张。系统只生成待审核的角色路径，不会自动访问外部平台，也不会预填任何结果。"
    >
      <InvestigationBrief />
    </WorkspaceShell>
  );
}
