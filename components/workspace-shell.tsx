"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  DataConnected,
  Locked,
} from "@carbon/icons-react";
import { modeLabels } from "@/lib/investigation";
import { useInvestigation } from "@/lib/use-investigation";
import { Brand } from "./site-header";

const steps = [
  {
    id: "plan",
    label: "定义主张",
    shortLabel: "定义",
    href: "/investigations",
  },
  {
    id: "live",
    label: "角色调查",
    shortLabel: "调查",
    href: "/investigations/workbench",
  },
  {
    id: "findings",
    label: "证据账本",
    shortLabel: "证据",
    href: "/investigations/evidence",
  },
  {
    id: "actions",
    label: "下一步",
    shortLabel: "跟进",
    href: "/investigations/next",
  },
] as const;

type StepId = (typeof steps)[number]["id"];

export function WorkspaceShell({
  activeStep,
  title,
  description,
  children,
}: {
  activeStep: StepId;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { record, isHydrated } = useInvestigation();

  return (
    <main className="workspace" id="main-content">
      <header className="workspace-header">
        <Brand />
        <div className="workspace-case-title">
          <span>{record?.subject || "新调查"}</span>
          <small>
            {!isHydrated
              ? "正在读取本地草稿"
              : record
                ? modeLabels[record.mode]
                : "尚未创建草稿"}
          </small>
        </div>
        <div className="workspace-header-meta">
          <span className="secured-label">
            <Locked size={14} aria-hidden />
            {record?.runtime.storage === "volatile_server"
              ? "临时服务端账本"
              : "浏览器证据账本"}
          </span>
          <Link className="exit-link" href="/">
            <ArrowLeft size={16} aria-hidden />
            返回首页
          </Link>
        </div>
      </header>

      <div className="case-disclosure">
        <DataConnected size={15} aria-hidden />
        <p>
          策略草案不代表已经发送。界面只把用户确认录入的回执计入证据。
        </p>
      </div>

      <nav className="workflow-nav" aria-label="Investigation workflow">
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
                <span>{step.label}</span>
                <small>{step.shortLabel}</small>
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
          <h1>{title}</h1>
        </div>
        <p>{description}</p>
      </section>

      {children}
    </main>
  );
}
