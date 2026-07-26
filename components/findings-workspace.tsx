"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, InlineLoading } from "@carbon/react";
import {
  ArrowRight,
  CheckmarkFilled,
  ChevronRight,
  DataReference,
  Renew,
  WarningAlt,
} from "@carbon/icons-react";
import { demoCase } from "@/lib/demo-data";
import {
  replayInvestigation,
  type ReplayFinding,
} from "@/lib/api";
import type { EvidenceArtifact } from "@/lib/types";

type ReplayState = "idle" | "proposed" | "running" | "complete";

const channelLabels: Record<EvidenceArtifact["channel"], string> = {
  storefront: "Storefront",
  demand: "Demand",
  support: "Digital channel",
  supply: "Supply chain",
  staffing: "Staffing",
};

const canonicalReplay: ReplayFinding = {
  estimatedValue: 2_400_000,
  lowerBound: 2_115_600,
  upperBound: 2_717_800,
  gapPercent: 27.9,
  confidence: 0.82,
};

function formatMillions(value: number) {
  return `¥${(value / 1_000_000).toFixed(2)}m`;
}

export function FindingsWorkspace() {
  const [selectedId, setSelectedId] = useState(demoCase.evidence[0]?.id ?? "");
  const [replayState, setReplayState] = useState<ReplayState>("idle");
  const [replayFinding, setReplayFinding] =
    useState<ReplayFinding>(canonicalReplay);
  const selectedEvidence = useMemo(
    () =>
      demoCase.evidence.find((evidence) => evidence.id === selectedId) ??
      demoCase.evidence[0],
    [selectedId],
  );

  async function runReplay() {
    setReplayState("running");
    const investigationId =
      window.localStorage.getItem("lrwa-investigation-id") ??
      "demo-investigation";
    const replay = await replayInvestigation(investigationId, 0.2);
    setReplayFinding(replay.finding);
    window.localStorage.setItem("lrwa-replay-complete", "true");
    window.setTimeout(() => setReplayState("complete"), 620);
  }

  const comparisonEstimate =
    replayState === "complete"
      ? replayFinding.estimatedValue
      : demoCase.finding.estimatedValue;
  const comparisonLower =
    replayState === "complete"
      ? replayFinding.lowerBound
      : demoCase.finding.lowerBound;
  const comparisonUpper =
    replayState === "complete"
      ? replayFinding.upperBound
      : demoCase.finding.upperBound;
  const comparisonGap =
    replayState === "complete"
      ? replayFinding.gapPercent / 100
      : demoCase.finalMetrics.realityGap;
  const comparisonConfidence =
    replayState === "complete"
      ? replayFinding.confidence
      : demoCase.finding.confidence;

  return (
    <div className="findings-layout">
      <section className="finding-summary">
        <div className="verdict-block">
          <span className="verdict-icon">
            <WarningAlt size={24} aria-hidden />
          </span>
          <div>
            <p className="mono-label">FINDING 01 / HIGH MATERIALITY</p>
            <span className="verdict-label">Claim not supported</span>
          </div>
        </div>
        <h2>{demoCase.finding.headline}</h2>
        <p className="finding-lead">
          Five evidence categories place June GMV below the company claim.
          This is a synthetic diligence signal, not a finding of misconduct.
        </p>
        <div className="finding-stat-grid">
          <div>
            <span>Company claim</span>
            <strong>{formatMillions(demoCase.finding.claimedValue)}</strong>
          </div>
          <div className="accent-stat">
            <span>{replayState === "complete" ? "Replayed estimate" : "Observed estimate"}</span>
            <strong>{formatMillions(comparisonEstimate)}</strong>
          </div>
          <div>
            <span>Fixed scenario band</span>
            <strong>
              {formatMillions(comparisonLower)} to {formatMillions(comparisonUpper)}
            </strong>
          </div>
          <div>
            <span>Reality gap</span>
            <strong>{(comparisonGap * 100).toFixed(1)}%</strong>
          </div>
        </div>

        <div className="comparison-chart" aria-label="Claim and estimate comparison">
          <div className="comparison-row">
            <span>Claim</span>
            <div>
              <i style={{ width: "100%" }} />
            </div>
            <strong>¥3.33m</strong>
          </div>
          <div className="comparison-row observed">
            <span>{replayState === "complete" ? "Replay" : "Estimate"}</span>
            <div>
              <i
                style={{
                  width: `${(comparisonEstimate / 3_330_000) * 100}%`,
                }}
              />
              <b
                className="range-start"
                style={{
                  left: `${(comparisonLower / 3_330_000) * 100}%`,
                }}
              />
              <b
                className="range-end"
                style={{
                  left: `${(comparisonUpper / 3_330_000) * 100}%`,
                }}
              />
            </div>
            <strong>{formatMillions(comparisonEstimate)}</strong>
          </div>
          <div className="comparison-scale">
            <span>¥0</span>
            <span>¥1m</span>
            <span>¥2m</span>
            <span>¥3.33m</span>
          </div>
        </div>

        <div className="confidence-explainer">
          <div>
            <span>Heuristic policy score</span>
            <strong>{comparisonConfidence.toFixed(2)}</strong>
          </div>
          <p>
            This rule-based score combines category coverage and agreement. It
            is not a calibrated probability, fraud finding or audit opinion.
          </p>
        </div>
      </section>

      <section className="evidence-workbench" aria-labelledby="evidence-title">
        <div className="panel-heading">
          <div>
            <p className="mono-label">EVIDENCE LEDGER / 05 ARTIFACTS</p>
            <h2 id="evidence-title">Trace the conclusion to source</h2>
          </div>
          <span className="panel-tag">SIMULATED</span>
        </div>

        <div className="evidence-grid">
          <div className="evidence-list" role="list">
            {demoCase.evidence.map((evidence) => (
              <button
                aria-pressed={selectedId === evidence.id}
                className={selectedId === evidence.id ? "selected" : ""}
                key={evidence.id}
                onClick={() => setSelectedId(evidence.id)}
                type="button"
              >
                <span className={`stance-mark ${evidence.stance}`} aria-hidden />
                <div>
                  <small>{channelLabels[evidence.channel]}</small>
                  <strong>{evidence.title}</strong>
                  <span>{evidence.confidence.toFixed(2)} source score</span>
                </div>
                <ChevronRight size={16} aria-hidden />
              </button>
            ))}
          </div>

          {selectedEvidence && (
            <article className="evidence-detail">
              <div className="evidence-detail-head">
                <DataReference size={24} aria-hidden />
                <div>
                  <p className="mono-label">{selectedEvidence.id}</p>
                  <h3>{selectedEvidence.title}</h3>
                </div>
              </div>
              <p className="evidence-summary">{selectedEvidence.summary}</p>
              <dl>
                <div>
                  <dt>Permission</dt>
                  <dd>
                    <span className="permission-tag">
                      {selectedEvidence.permission}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{selectedEvidence.sourceLabel}</dd>
                </div>
                <div>
                  <dt>Collected</dt>
                  <dd>
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Shanghai",
                    }).format(new Date(selectedEvidence.observedAt))}
                  </dd>
                </div>
                <div>
                  <dt>Agent</dt>
                  <dd>{selectedEvidence.agent}</dd>
                </div>
                <div>
                  <dt>Tool call</dt>
                  <dd className="mono-value">{selectedEvidence.tool}</dd>
                </div>
                <div>
                  <dt>Linked claim</dt>
                  <dd className="mono-value">{selectedEvidence.claimId}</dd>
                </div>
                <div className="hash-row">
                  <dt>Content hash</dt>
                  <dd className="mono-value">{selectedEvidence.hash}</dd>
                </div>
              </dl>
            </article>
          )}
        </div>
      </section>

      <section className="challenge-panel" aria-labelledby="challenge-title">
        <div className="challenge-copy">
          <span className="challenge-icon">
            <Renew size={22} aria-hidden />
          </span>
          <div>
            <p className="mono-label">SKEPTIC AGENT / COUNTERFACTUAL</p>
            <h2 id="challenge-title">Challenge the conclusion</h2>
            <p>
              Test whether an unobserved corporate-order channel equal to 20%
              of disclosed demand could explain the gap.
            </p>
          </div>
        </div>

        {replayState === "idle" && (
          <Button
            kind="secondary"
            onClick={() => setReplayState("proposed")}
            renderIcon={ArrowRight}
          >
            Inspect hypothesis
          </Button>
        )}

        {replayState === "proposed" && (
          <div className="hypothesis-gate">
            <div>
              <span>Added demand allowance</span>
              <strong>20%</strong>
            </div>
            <div>
              <span>Evidence mutation</span>
              <strong>None</strong>
            </div>
            <div>
              <span>Original seed</span>
              <strong>Locked</strong>
            </div>
            <Button kind="primary" onClick={runReplay} renderIcon={Renew}>
              Run deterministic replay
            </Button>
          </div>
        )}

        {replayState === "running" && (
          <InlineLoading description="Replaying under the alternate hypothesis" />
        )}

        {replayState === "complete" && (
          <div className="replay-result">
            <CheckmarkFilled size={20} aria-hidden />
            <div>
              <strong>Gap narrows, conclusion remains unsupported.</strong>
              <p>
                Estimate rises to {formatMillions(replayFinding.estimatedValue)}
                {" "}and the policy score falls to{" "}
                {replayFinding.confidence.toFixed(2)}. The remaining{" "}
                {replayFinding.gapPercent.toFixed(1)}% gap is still material.
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="workspace-next">
        <div>
          <p className="mono-label">NEXT / DECISION ACTIONS</p>
          <strong>Turn uncertainty into exact evidence requests.</strong>
        </div>
        <Link className="primary-link" href="/cases/morrow-coffee/actions">
          Build the action queue
          <ArrowRight size={20} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
