import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand-lockup" href="/" aria-label="LRWA home">
      <span className="brand-symbol" aria-hidden>
        <svg fill="none" viewBox="0 0 100 100">
          <path d="M50 12L70 76.72L30 76.72Z" />
          <path d="M88 32L15 70V42Z" />
        </svg>
      </span>
      <span>LRWA</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Primary navigation">
        <Link href="/cases/morrow-coffee/live">Live mission</Link>
        <Link href="/cases/morrow-coffee/findings">Evidence</Link>
      </nav>
    </header>
  );
}
