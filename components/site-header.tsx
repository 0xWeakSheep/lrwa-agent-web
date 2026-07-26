import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand-lockup" href="/" aria-label="LRWA home">
      <span className="brand-mark" aria-hidden>
        <i />
        <i />
        <i />
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
