import type { Metadata } from "next";
import { DecisionActions } from "@/components/decision-actions";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "下一步核验",
  description: "把尚未解决的不确定性变成下一轮具体证据动作。",
};

export default function ActionsPage() {
  return (
    <WorkspaceShell
      activeStep="actions"
      title="让每个缺口变成下一步动作。"
      description="产品不会停在一份静态研报。角色没有执行、回执没有收到或来源尚未复核时，下一轮任务会保持清晰可见。"
    >
      <DecisionActions />
    </WorkspaceShell>
  );
}
