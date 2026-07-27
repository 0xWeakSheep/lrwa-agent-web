import type { Metadata } from "next";
import { EvidenceRoom } from "@/components/evidence-room";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "证据账本",
  description: "只展示用户实际录入的证据，并在证据不足时锁住结论。",
};

export default function FindingsPage() {
  return (
    <WorkspaceShell
      activeStep="findings"
      title="证据先于结论。"
      description="这里不播放合成结果。来源、时间、回执原文和内容哈希都来自当前调查的实际录入；没有回执时，界面保持为空。"
    >
      <EvidenceRoom />
    </WorkspaceShell>
  );
}
