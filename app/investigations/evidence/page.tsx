import type { Metadata } from "next";
import { EvidenceRoom } from "@/components/evidence-room";
import { WorkspaceShell } from "@/components/workspace-shell";
import { bilingual, chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: chooseLocale(locale, "Evidence ledger", "证据账本"),
    description: chooseLocale(
      locale,
      "Show only evidence entered by the user and keep conclusions locked when evidence is insufficient.",
      "只展示用户实际录入的证据，并在证据不足时锁住结论。",
    ),
  };
}

export default function FindingsPage() {
  return (
    <WorkspaceShell
      activeStep="findings"
      title={bilingual("Evidence before conclusions.", "证据先于结论。")}
      description={bilingual(
        "No synthetic result is played here. Sources, timestamps, receipt text, and content hashes come from actual entries in this investigation; without receipts, the interface stays empty.",
        "这里不播放合成结果。来源、时间、回执原文和内容哈希都来自当前调查的实际录入；没有回执时，界面保持为空。",
      )}
    >
      <EvidenceRoom />
    </WorkspaceShell>
  );
}
