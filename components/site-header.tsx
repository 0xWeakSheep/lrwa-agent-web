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
        <a href="#method-title">Method</a>
        <a href="#governance-title">Governance</a>
        <Link href="/cases/morrow-coffee">Open demo</Link>
      </nav>
    </header>
  );
}
