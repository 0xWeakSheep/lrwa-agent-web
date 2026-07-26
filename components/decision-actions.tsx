"use client";

import { useState } from "react";
import { Button, Checkbox, InlineNotification } from "@carbon/react";
import {
  CheckmarkFilled,
  DocumentDownload,
  Locked,
  SendAlt,
} from "@carbon/icons-react";
import { demoCase } from "@/lib/demo-data";

const actions = [
  {
    id: "pos",
    priority: "P0",
    owner: "Deal team",
    title: demoCase.finding.nextActions[0],
    rationale: "Directly tests transaction volume across high, median and low-signal stores.",
    closes: "GMV recognition and store-level throughput",
  },
  {
    id: "corporate",
    priority: "P0",
    owner: "Finance",
    title: demoCase.finding.nextActions[1],
    rationale: "Resolves the strongest alternative hypothesis raised by the Skeptic Agent.",
    closes: "Unobserved corporate-order share",
  },
  {
    id: "field",
    priority: "P1",
    owner: "Operating partner",
    title: demoCase.finding.nextActions[2],
    rationale: "Confirms whether repeated inactive signals represent closures or temporary outages.",
    closes: "Nine store-status exceptions",
  },
  {
    id: "valuation",
    priority: "P1",
    owner: "Investment lead",
    title: demoCase.finding.nextActions[3],
    rationale: "Keeps the committee decision robust while source documents are outstanding.",
    closes: "Downside exposure at observed revenue",
  },
];

export function DecisionActions() {
  const [selected, setSelected] = useState<string[]>(["pos", "corporate", "field"]);
  const [packaged, setPackaged] = useState(false);

  function toggleAction(id: string, checked: boolean) {
    setSelected((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((item) => item !== id),
    );
  }

  function packageRequest() {
    setPackaged(true);
    window.setTimeout(() => setPackaged(false), 3600);
  }

  return (
    <div className="actions-layout">
      <section className="decision-posture">
        <div>
          <p className="mono-label">DECISION POSTURE / CONDITIONAL HOLD</p>
          <h2>Pause for targeted evidence, not a broader memo.</h2>
          <p>
            The current signals do not support June GMV as disclosed. Three
            bounded requests can resolve the largest uncertainties before the
            investment committee.
          </p>
        </div>
        <div
          className="posture-meter"
          aria-label="Committee readiness: primary records outstanding"
        >
          <span>Committee readiness</span>
          <strong>Not ready</strong>
          <small>Primary records outstanding</small>
        </div>
      </section>

      <div className="actions-main-grid">
        <section className="action-queue panel" aria-labelledby="queue-title">
          <div className="panel-heading">
            <div>
              <p className="mono-label">SUPERVISOR / REQUEST QUEUE</p>
              <h2 id="queue-title">Evidence requests</h2>
            </div>
            <span className="panel-stat">
              <strong>{selected.length}</strong> selected
            </span>
          </div>

          <div className="action-list">
            {actions.map((action) => (
              <article key={action.id}>
                <Checkbox
                  checked={selected.includes(action.id)}
                  id={`action-${action.id}`}
                  labelText=""
                  onChange={(_, state) => toggleAction(action.id, state.checked)}
                />
                <span className="priority-label">{action.priority}</span>
                <div>
                  <h3>{action.title}</h3>
                  <p>{action.rationale}</p>
                  <dl>
                    <div>
                      <dt>Owner</dt>
                      <dd>{action.owner}</dd>
                    </div>
                    <div>
                      <dt>Uncertainty closed</dt>
                      <dd>{action.closes}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>

          <div className="queue-actions">
            <Button
              disabled={selected.length === 0}
              kind="primary"
              onClick={packageRequest}
              renderIcon={SendAlt}
            >
              Package selected requests
            </Button>
            <Button
              kind="ghost"
              onClick={() => window.print()}
              renderIcon={DocumentDownload}
            >
              Print decision brief
            </Button>
          </div>

          {packaged && (
            <InlineNotification
              kind="success"
              lowContrast
              hideCloseButton
              title="Request package ready"
              subtitle={`${selected.length} requests were assembled in this local demo. No message was sent.`}
            />
          )}
        </section>

        <aside className="scenario-panel panel" aria-labelledby="scenario-title">
          <div className="panel-heading">
            <div>
              <p className="mono-label">ILLUSTRATIVE SENSITIVITY</p>
              <h2 id="scenario-title">Decision range</h2>
            </div>
          </div>
          <div className="scenario-table" role="table" aria-label="Illustrative revenue scenarios">
            <div role="row">
              <span role="columnheader">Scenario</span>
              <span role="columnheader">June GMV</span>
              <span role="columnheader">vs claim</span>
            </div>
            <div role="row">
              <span role="cell">Observed base</span>
              <strong role="cell">¥1.92m</strong>
              <span role="cell" className="negative-value">
                -42.3%
              </span>
            </div>
            <div role="row">
              <span role="cell">20% group-order replay</span>
              <strong role="cell">¥2.40m</strong>
              <span role="cell" className="negative-value">
                -27.9%
              </span>
            </div>
            <div role="row">
              <span role="cell">Company claim</span>
              <strong role="cell">¥3.33m</strong>
              <span role="cell">Reference</span>
            </div>
          </div>
          <div className="scenario-note">
            <Locked size={18} aria-hidden />
            <p>
              These values belong only to the fictional Morrow Coffee sandbox
              and are not an investment recommendation.
            </p>
          </div>
        </aside>
      </div>

      <section className="audit-package" aria-labelledby="package-title">
        <div>
          <CheckmarkFilled size={24} aria-hidden />
          <div>
            <p className="mono-label">AUDIT PACKAGE / READY</p>
            <h2 id="package-title">The investigation stays reproducible.</h2>
          </div>
        </div>
        <dl>
          <div>
            <dt>Seed</dt>
            <dd>240727</dd>
          </div>
          <div>
            <dt>Parameterized probe quota</dt>
            <dd>1,024 planned units</dd>
          </div>
          <div>
            <dt>Evidence lineage</dt>
            <dd>5 content-hashed receipts</dd>
          </div>
          <div>
            <dt>Replay lineage</dt>
            <dd>1 linked hypothesis</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
