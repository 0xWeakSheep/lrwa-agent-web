import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckmarkFilled,
  DataReference,
  DecisionTree,
  Locked,
  PlayFilledAlt,
} from "@carbon/icons-react";
import { demoCase } from "@/lib/demo-data";
import { SiteHeader } from "@/components/site-header";
import { StoreField } from "@/components/store-field";
import { SyntheticLabel } from "@/components/synthetic-label";

export const metadata: Metadata = {
  title: "Live Real-World Assurance",
  description:
    "A governed agent system for testing business claims against auditable reality signals.",
};

const missionSteps = [
  {
    number: "01",
    title: "Compile the claim",
    body: "Convert an investment memo into measurable claims, materiality and falsification tests.",
    icon: DataReference,
  },
  {
    number: "02",
    title: "Observe independently",
    body: "Dispatch bounded synthetic probes across storefront, demand, supply and operations.",
    icon: DecisionTree,
  },
  {
    number: "03",
    title: "Challenge the result",
    body: "Trace every finding to evidence, test rival hypotheses and request the next proof.",
    icon: CheckmarkFilled,
  },
];

export default function Home() {
  return (
    <main className="marketing-page">
      <SiteHeader />

      <section className="hero section-pad" aria-labelledby="hero-title">
        <div className="hero-copy">
          <SyntheticLabel />
          <p className="eyebrow">Live Real-World Assurance</p>
          <h1 id="hero-title">Test the world behind the spreadsheet.</h1>
          <p className="hero-deck">
            Autonomous agents turn business claims into auditable reality
            checks with explicit uncertainty.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" href="/cases/morrow-coffee">
              Run simulated diligence
              <ArrowRight size={20} aria-hidden />
            </Link>
            <Link className="quiet-link" href="/cases/morrow-coffee/live">
              <PlayFilledAlt size={18} aria-hidden />
              Watch the mission
            </Link>
          </div>
          <div className="hero-guardrail">
            <Locked size={16} aria-hidden />
            <span>
              Fictional company. Synthetic evidence. No live merchant contact.
            </span>
          </div>
        </div>

        <div className="hero-product" aria-label="LRWA product preview">
          <div className="preview-topline">
            <div>
              <span className="mono-label">CASE 01 / SERIES A</span>
              <h2>Morrow Coffee</h2>
            </div>
            <span className="preview-state">
              <span aria-hidden />
              Reality twin complete
            </span>
          </div>
          <div className="preview-grid">
            <div className="preview-map">
              <StoreField stores={demoCase.stores} compact />
            </div>
            <div className="preview-reading">
              <p className="mono-label">CLAIM UNDER TEST</p>
              <p className="preview-claim">June GMV ¥3.33m</p>
              <div className="preview-estimate">
                <span>Observed estimate</span>
                <strong>¥1.92m</strong>
                <small>90% interval ¥1.72m to ¥2.14m</small>
              </div>
              <div className="confidence-track" aria-label="Confidence 88%">
                <span style={{ width: "88%" }} />
              </div>
              <div className="preview-foot">
                <span>1,024 probes</span>
                <span>5 evidence families</span>
                <span>88% confidence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="System properties">
        <p>Bounded missions</p>
        <p>Human approval gates</p>
        <p>Evidence lineage</p>
        <p>Deterministic replay</p>
      </section>

      <section className="method section-pad" aria-labelledby="method-title">
        <div className="section-intro">
          <p className="eyebrow">From assertion to action</p>
          <h2 id="method-title">A verification loop, not another report.</h2>
          <p>
            LRWA keeps the claim, mission, evidence and decision linked so an
            investor can challenge the conclusion and run the next test.
          </p>
        </div>
        <div className="method-grid">
          {missionSteps.map(({ number, title, body, icon: Icon }) => (
            <article className="method-step" key={number}>
              <div className="method-number">{number}</div>
              <Icon size={24} aria-hidden />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="governance section-pad" aria-labelledby="governance-title">
        <div className="governance-mark">
          <Locked size={32} aria-hidden />
        </div>
        <div>
          <p className="eyebrow">Designed for accountable autonomy</p>
          <h2 id="governance-title">Observe within declared boundaries.</h2>
        </div>
        <p>
          Missions use simulated, licensed, public or customer-authorized
          sources. Automated identity stays disclosed, sensitive actions require
          approval and every artifact carries a permission label and content
          hash.
        </p>
        <Link className="text-link" href="/cases/morrow-coffee">
          Inspect the policy gate
          <ArrowRight size={18} aria-hidden />
        </Link>
      </section>

      <footer className="site-footer section-pad">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span>LRWA</span>
        </div>
        <p>OpenArena BUIDL_QUESTS 2026 demo</p>
        <p>All displayed companies and evidence are fictional.</p>
      </footer>
    </main>
  );
}
