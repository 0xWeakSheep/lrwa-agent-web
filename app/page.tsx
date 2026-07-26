import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayFilledAlt } from "@carbon/icons-react";
import { Brand, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Live Real-World Assurance",
  description:
    "Governed agents test business claims against auditable signals from the real world.",
};

const proofPoints = [
  { value: "1,024", label: "planned probe quota" },
  { value: "5", label: "evidence categories" },
  { value: "SHA-256", label: "artifact lineage" },
  { value: "1", label: "separate demo gate" },
];

const missionSteps = [
  {
    index: "01",
    label: "Compile",
    title: "Turn the claim into observables.",
    detail: "Scope, quota, sources and permissions.",
  },
  {
    index: "02",
    label: "Cross-check",
    title: "Let evidence categories disagree.",
    detail: "Trace every receipt to method and hash.",
  },
  {
    index: "03",
    label: "Challenge",
    title: "Replay the strongest alternative.",
    detail: "Keep the demo interaction gate visible.",
  },
];

export default function Home() {
  return (
    <main className="marketing-page" id="main-content">
      <SiteHeader />

      <section className="cinematic-hero" aria-labelledby="hero-title">
        <div className="cinematic-media" aria-hidden="true">
          <Image
            alt=""
            className="cinematic-image"
            fill
            priority
            sizes="100vw"
            src="/lrwa-cinematic-hero.webp"
            unoptimized
          />
        </div>

        <div className="cinematic-hero-inner">
          <div className="cinematic-copy">
            <h1 id="hero-title">
              Verify the world
              <span>behind the numbers.</span>
            </h1>
            <p className="cinematic-deck">
              Governed agents test business claims against auditable signals
              from the real world.
            </p>
            <div className="cinematic-actions">
              <Link
                className="cinematic-primary"
                href="/cases/morrow-coffee"
              >
                Run the demo
                <ArrowRight size={20} aria-hidden />
              </Link>
              <Link
                className="cinematic-secondary"
                href="/cases/morrow-coffee/live"
              >
                <PlayFilledAlt size={18} aria-hidden />
                Watch mission
              </Link>
            </div>
            <p className="cinematic-disclosure">
              Fictional case. Synthetic evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="cinematic-proof" aria-label="Demo proof points">
        <div className="cinematic-proof-inner">
          {proofPoints.map((proof) => (
            <div key={proof.label}>
              <strong>{proof.value}</strong>
              <span>{proof.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cinematic-method" aria-labelledby="method-title">
        <div className="cinematic-method-intro">
          <p className="cinematic-section-label">MISSION LOGIC / 01</p>
          <h2 id="method-title">
            A claim becomes
            <span>a bounded test.</span>
          </h2>
          <p>
            The model explains. Deterministic code measures. Every uncertainty
            ends as a concrete evidence request.
          </p>
        </div>

        <div className="cinematic-method-steps">
          {missionSteps.map((step) => (
            <article key={step.index}>
              <div>
                <span>{step.index}</span>
                <small>{step.label}</small>
              </div>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cinematic-field" aria-labelledby="field-title">
        <Image
          alt="Fictional evidence workspace with maps, storefront records and observation markers"
          className="cinematic-field-image"
          fill
          sizes="(max-width: 680px) 100vw, 1280px"
          src="/lrwa-evidence-table.webp"
          unoptimized
        />
        <div className="cinematic-field-shade" aria-hidden />
        <div className="cinematic-field-copy">
          <p className="cinematic-section-label">MORROW COFFEE / FICTIONAL</p>
          <h2 id="field-title">See the evidence converge.</h2>
          <dl className="cinematic-field-stats" aria-label="Demo result">
            <div>
              <dt>Claim</dt>
              <dd>¥3.33m</dd>
            </div>
            <div>
              <dt>Estimate</dt>
              <dd>¥1.92m</dd>
            </div>
            <div>
              <dt>Heuristic score</dt>
              <dd>0.88</dd>
            </div>
          </dl>
          <p className="cinematic-field-note">
            Five aggregate receipts. One fixed scenario band. No fraud
            accusation.
          </p>
          <Link
            className="cinematic-primary cinematic-field-link"
            href="/cases/morrow-coffee/findings"
          >
            Inspect the finding
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="cinematic-footer">
        <Brand />
        <p>OpenArena BUIDL_QUESTS 2026</p>
        <p>Live Real-World Assurance</p>
      </footer>
    </main>
  );
}
