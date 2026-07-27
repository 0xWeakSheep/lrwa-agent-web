import type { Metadata } from "next";
import { SimulationLab } from "@/components/simulation-lab";
import { WorkspaceShell } from "@/components/workspace-shell";
import { bilingual, chooseLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";
import scenario from "@/lib/simulation-scenario.json";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: chooseLocale(locale, "Simulation lab", "模拟实验"),
    description: chooseLocale(
      locale,
      "Replay a multi-stage investigation method with a real public subject and synthetic personas. All external actions remain zero.",
      "用内置真实对象和合成人物，逐步回放多阶段调查方法。所有外部动作均为零。",
    ),
  };
}

export default async function SimulationPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedPhase =
    typeof params.start === "string" ? params.start : undefined;
  const initialPhaseId = scenario.phases.some(
    (phase) => phase.id === requestedPhase,
  )
    ? requestedPhase
    : undefined;

  return (
    <WorkspaceShell
      activeStep="simulation"
      caseMetaOverride={bilingual(
        "Built-in method lab · 0 real outreach actions",
        "内置方法实验 · 0 次真实外联",
      )}
      caseTitleOverride={bilingual(
        "Starbucks stores associated with Shanghai Jing'an Kerry Centre",
        scenario.subject,
      )}
      disclosureOverride={bilingual(
        "This page only replays a local sandbox process. Personas, inquiry drafts, and response branches are synthetic; nothing was sent to a store or customer service.",
        "当前页面只回放本地沙盒流程。人物、问句与响应分支均为合成内容，未向任何门店或客服发送。",
      )}
      storageLabelOverride={bilingual(
        "Isolated sandbox · no evidence writes",
        "独立沙盒 · 不写入证据",
      )}
      title={bilingual(
        "See every decomposition, persona, and probe.",
        "看见每一次拆解、分身与追问。",
      )}
      description={bilingual(
        "Start with real public clues, then inspect how twelve synthetic personas form inquiry waves, response branches, and an evidence gate. You control playback; the lab connects to no external platform.",
        "从真实公开线索出发，逐步查看十二个合成人物如何形成询问波次、响应分支和证据门槛。你控制播放；实验不连接任何外部平台。",
      )}
    >
      <SimulationLab
        initialPhaseId={initialPhaseId}
        key={initialPhaseId ?? "input"}
      />
    </WorkspaceShell>
  );
}
