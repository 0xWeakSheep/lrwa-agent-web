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
  { value: "1,024", label: "bounded probes" },
  { value: "5", label: "independent evidence families" },
  { value: "SHA-256", label: "artifact lineage" },
  { value: "1", label: "human-approved replay" },
];

export default function Home() {
  return (
    <main className="marketing-page">
      <SiteHeader />

      <section className="cinematic-hero" aria-labelledby="hero-title">
        <div className="cinematic-media" aria-hidden="true">
          <Image
            alt=""
            className="cinematic-image"
            fill
            priority
            sizes="100vw"
            src="/lrwa-cinematic-hero.png"
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

      <footer className="cinematic-footer">
        <Brand />
        <p>OpenArena BUIDL_QUESTS 2026</p>
        <p>Live Real-World Assurance</p>
      </footer>
    </main>
  );
}
