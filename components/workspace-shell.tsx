import Link from "next/link";
import {
  ArrowLeft,
  Checkmark,
  ChevronRight,
  Locked,
} from "@carbon/icons-react";
import { Brand } from "./site-header";
import { SyntheticLabel } from "./synthetic-label";

const steps = [
  {
    id: "plan",
    label: "Mission plan",
    shortLabel: "Plan",
    href: "/cases/morrow-coffee",
  },
  {
    id: "live",
    label: "Live mission",
    shortLabel: "Live",
    href: "/cases/morrow-coffee/live",
  },
  {
    id: "findings",
    label: "Findings",
    shortLabel: "Findings",
    href: "/cases/morrow-coffee/findings",
  },
  {
    id: "actions",
    label: "Decision actions",
    shortLabel: "Actions",
    href: "/cases/morrow-coffee/actions",
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
  const activeIndex = steps.findIndex((step) => step.id === activeStep);

  return (
    <main className="workspace">
      <header className="workspace-header">
        <Brand />
        <div className="workspace-case-title">
          <span>Morrow Coffee</span>
          <small>Series A diligence</small>
        </div>
        <div className="workspace-header-meta">
          <span className="secured-label">
            <Locked size={14} aria-hidden />
            Bounded sandbox
          </span>
          <Link className="exit-link" href="/">
            <ArrowLeft size={16} aria-hidden />
            Exit case
          </Link>
        </div>
      </header>

      <div className="case-disclosure">
        <SyntheticLabel compact />
        <p>
          This workspace uses a fictional company and illustrative evidence.
          It does not identify or assess any real business.
        </p>
      </div>

      <nav className="workflow-nav" aria-label="Investigation workflow">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = index < activeIndex;
          return (
            <Link
              aria-current={isActive ? "step" : undefined}
              className={isActive ? "active" : isComplete ? "complete" : ""}
              href={step.href}
              key={step.id}
            >
              <span className="step-index">
                {isComplete ? (
                  <Checkmark size={14} aria-label="Complete" />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
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
          <p className="eyebrow">Case 01 / Morrow Coffee</p>
          <h1>{title}</h1>
        </div>
        <p>{description}</p>
      </section>

      {children}
    </main>
  );
}
