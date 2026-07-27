"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  DataConnected,
  Locked,
} from "@carbon/icons-react";
import { modeLabels, type InvestigationMode } from "@/lib/investigation";
import type { BilingualCopy } from "@/lib/i18n";
import { useInvestigation } from "@/lib/use-investigation";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "./locale-provider";
import { Brand } from "./site-header";

const steps = [
  {
    id: "plan",
    label: { en: "Define claim", zh: "定义主张" },
    shortLabel: { en: "Define", zh: "定义" },
    href: "/investigations",
  },
  {
    id: "live",
    label: { en: "Role inquiry", zh: "角色调查" },
    shortLabel: { en: "Inquire", zh: "调查" },
    href: "/investigations/workbench",
  },
  {
    id: "findings",
    label: { en: "Evidence ledger", zh: "证据账本" },
    shortLabel: { en: "Evidence", zh: "证据" },
    href: "/investigations/evidence",
  },
  {
    id: "actions",
    label: { en: "Next actions", zh: "下一步" },
    shortLabel: { en: "Follow up", zh: "跟进" },
    href: "/investigations/next",
  },
] as const;

const modeLabelsEn: Record<InvestigationMode, string> = {
  assisted_live: "Human-assisted investigation",
  authorized_connector: "Authorized data connection",
  simulation_lab: "Method simulation",
};

type StepId = (typeof steps)[number]["id"];
type ActiveStepId = StepId | "simulation";

export function WorkspaceShell({
  activeStep,
  title,
  description,
  caseTitleOverride,
  caseMetaOverride,
  storageLabelOverride,
  disclosureOverride,
  children,
}: {
  activeStep: ActiveStepId;
  title: BilingualCopy;
  description: BilingualCopy;
  caseTitleOverride?: BilingualCopy;
  caseMetaOverride?: BilingualCopy;
  storageLabelOverride?: BilingualCopy;
  disclosureOverride?: BilingualCopy;
  children: React.ReactNode;
}) {
  const { choose } = useI18n();
  const { record, isHydrated } = useInvestigation();
  const isSimulation = activeStep === "simulation";
  const localized = (copy: BilingualCopy) => choose(copy.en, copy.zh);

  return (
    <main className="workspace" id="main-content">
      <header className="workspace-header">
        <Brand />
        <div className="workspace-case-title">
          <span>
            {caseTitleOverride
              ? localized(caseTitleOverride)
              : record?.subject || choose("New investigation", "新调查")}
          </span>
          <small>
            {caseMetaOverride
              ? localized(caseMetaOverride)
              : !isHydrated
                ? choose("Reading local draft", "正在读取本地草稿")
                : record
                  ? choose(modeLabelsEn[record.mode], modeLabels[record.mode])
                  : choose("No draft created", "尚未创建草稿")}
          </small>
        </div>
        <div className="workspace-header-meta">
          <span className="secured-label">
            <Locked size={14} aria-hidden />
            {storageLabelOverride
              ? localized(storageLabelOverride)
              : record?.runtime.storage === "volatile_server"
                ? choose("Temporary server ledger", "临时服务端账本")
                : choose("Browser evidence ledger", "浏览器证据账本")}
          </span>
          <Link className="exit-link" href="/">
            <ArrowLeft size={16} aria-hidden />
            {choose("Back home", "返回首页")}
          </Link>
        </div>
      </header>

      <div className={`case-disclosure${isSimulation ? " simulation" : ""}`}>
        <DataConnected size={15} aria-hidden />
        <p>
          {disclosureOverride
            ? localized(disclosureOverride)
            : choose(
                "A strategy draft does not mean anything was sent. Only user-confirmed receipts enter the evidence ledger.",
                "策略草案不代表已经发送。界面只把用户确认录入的回执计入证据。",
              )}
        </p>
        <LanguageToggle compact />
        <Link
          aria-current={isSimulation ? "page" : undefined}
          className="case-simulation-link"
          href={
            isSimulation
              ? "/investigations/simulation"
              : "/investigations/example"
          }
        >
          {isSimulation
            ? choose("Viewing simulation", "正在查看模拟实验")
            : choose("View simulation", "查看模拟实验")}
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>

      <nav
        className="workflow-nav"
        aria-label={choose("Investigation workflow", "调查工作流")}
      >
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          return (
            <Link
              aria-current={isActive ? "step" : undefined}
              className={isActive ? "active" : ""}
              href={step.href}
              key={step.id}
            >
              <span className="step-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="step-label">
                <span>{choose(step.label.en, step.label.zh)}</span>
                <small>{choose(step.shortLabel.en, step.shortLabel.zh)}</small>
              </span>
              {index < steps.length - 1 && (
                <ChevronRight
                  className="workflow-chevron"
                  size={16}
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>

      <section className="workspace-title">
        <div>
          <p className="eyebrow">EVIDENCE MISSION</p>
          <h1>{localized(title)}</h1>
        </div>
        <p>{localized(description)}</p>
      </section>

      {children}
    </main>
  );
}
