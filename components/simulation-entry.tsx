"use client";

import Link from "next/link";
import { ArrowRight, Locked } from "@carbon/icons-react";
import { useI18n } from "@/components/locale-provider";
import { localizeScenario } from "@/lib/simulation-copy";
import scenario from "@/lib/simulation-scenario.json";

export function SimulationEntry({ compact = false }: { compact?: boolean }) {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);

  return (
    <section
      className={`simulation-entry${compact ? " compact" : ""}`}
      aria-labelledby={compact ? undefined : "simulation-entry-title"}
      aria-label={
        compact ? choose("Built-in simulation lab", "内置模拟实验") : undefined
      }
    >
      <div className="simulation-entry-mark" aria-hidden>
        <span>LAB</span>
        <strong>{scenario.metrics.simulatedPersonas}</strong>
      </div>
      <div className="simulation-entry-copy">
        <p>
          {choose(
            "BUILT-IN SANDBOX · NO EXTERNAL CONNECTION",
            "BUILT-IN SANDBOX · 未连接外部平台",
          )}
        </p>
        <h2 id={compact ? undefined : "simulation-entry-title"}>
          {compact
            ? choose("Open the built-in simulation", "查看内置模拟实验")
            : localizedScenario.subject}
        </h2>
        <span>
          {choose(
            `${scenario.metrics.simulatedPersonas} synthetic personas · ${scenario.metrics.simulatedDrafts} unsent questions · 0 real outreach actions`,
            `${scenario.metrics.simulatedPersonas} 个合成人物 · ${scenario.metrics.simulatedDrafts} 条未发送问句 · 0 次真实外联`,
          )}
        </span>
      </div>
      <div className="simulation-entry-boundary">
        <Locked size={16} aria-hidden />
        <span>
          {choose(
            "The real evidence ledger stays empty",
            "真实证据账本保持为空",
          )}
        </span>
      </div>
      <Link className="simulation-entry-link" href="/investigations/example">
        {choose("View the full walkthrough", "查看全过程")}
        <ArrowRight size={18} aria-hidden />
      </Link>
    </section>
  );
}
