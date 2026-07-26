import type { Metadata } from "next";
import {
  Analytics,
  Building,
  DataConnected,
  IbmWatsonDiscovery,
  ShoppingCatalog,
  UserMultiple,
} from "@carbon/icons-react";
import { demoCase } from "@/lib/demo-data";
import { PlanGate } from "@/components/plan-gate";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "Mission plan",
  description:
    "Review and authorize a bounded synthetic diligence mission for Morrow Coffee.",
};

const channels = [
  {
    key: "storefront",
    title: "Storefront",
    count: 320,
    body: "Availability and operating-state checks across declared locations.",
    icon: Building,
    agent: "Geo Observer",
  },
  {
    key: "demand",
    title: "Synthetic consumer",
    count: 256,
    body: "Stratified consumer journeys across district, time and persona.",
    icon: ShoppingCatalog,
    agent: "Demand Observer",
  },
  {
    key: "support",
    title: "Digital channel",
    count: 192,
    body: "Operating-state comparison across three simulated listing channels.",
    icon: DataConnected,
    agent: "Channel Auditor",
  },
  {
    key: "staffing",
    title: "Staffing",
    count: 128,
    body: "Aggregate shift capacity without personal employee information.",
    icon: UserMultiple,
    agent: "Operations Observer",
  },
  {
    key: "supply",
    title: "Supply",
    count: 128,
    body: "Capacity inference from licensed, synthetic replenishment records.",
    icon: Analytics,
    agent: "Supply Observer",
  },
];

function formatClaim(value: number, unit: string) {
  if (value >= 1_000_000) {
    return `¥${(value / 1_000_000).toFixed(2)}m`;
  }
  if (unit === "元") {
    return `¥${value.toFixed(1)}`;
  }
  return value.toLocaleString("en-US");
}

export default function MissionPlanPage() {
  return (
    <WorkspaceShell
      activeStep="plan"
      title="Review the mission before agents act."
      description="The supervisor has translated the investment memo into testable claims and a bounded evidence plan. No probe runs until a human approves it."
    >
      <div className="plan-layout">
        <div className="plan-main">
          <section className="panel claims-panel" aria-labelledby="claims-title">
            <div className="panel-heading">
              <div>
                <p className="mono-label">CLAIM COMPILER / OUTPUT 04</p>
                <h2 id="claims-title">Material claims under test</h2>
              </div>
              <span className="panel-tag">High materiality</span>
            </div>
            <div className="claims-table" role="table" aria-label="Claims under test">
              <div className="claim-row claim-header" role="row">
                <span role="columnheader">Claim</span>
                <span role="columnheader">Reported</span>
                <span role="columnheader">Period</span>
                <span role="columnheader">Test</span>
              </div>
              {demoCase.claims.map((claim) => (
                <div className="claim-row" role="row" key={claim.id}>
                  <span role="cell">{claim.label}</span>
                  <strong role="cell">
                    {formatClaim(claim.claimedValue, claim.unit)}
                    {claim.unit !== "元" && (
                      <small className="unit">{claim.unit}</small>
                    )}
                  </strong>
                  <span className="mono-value" role="cell">
                    {claim.period}
                  </span>
                  <span className="test-status" role="cell">
                    Five-way cross-check
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel channels-panel" aria-labelledby="channels-title">
            <div className="panel-heading">
              <div>
                <p className="mono-label">MISSION ORCHESTRATOR / PLAN 01</p>
                <h2 id="channels-title">Five evidence categories</h2>
              </div>
              <span className="panel-stat">
                <strong>1,024</strong> planned probe quota
              </span>
            </div>
            <div className="channel-list">
              {channels.map(
                ({ key, title, count, body, icon: Icon, agent }, index) => (
                  <article className="channel-row" key={key}>
                    <span className="channel-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="channel-icon">
                      <Icon size={20} aria-hidden />
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                      <small>{agent}</small>
                    </div>
                    <strong>{count}</strong>
                  </article>
                ),
              )}
            </div>
          </section>

          <section className="methodology-note" aria-label="Methodology note">
            <IbmWatsonDiscovery size={24} aria-hidden />
            <div>
              <strong>The high policy band requires category diversity.</strong>
              <p>
                The verifier will not label a claim supported or contradicted
                until at least two evidence categories agree. Numerical
                calculations are deterministic under seed 240727 for this code
                version.
              </p>
            </div>
          </section>
        </div>

        <PlanGate />
      </div>
    </WorkspaceShell>
  );
}
