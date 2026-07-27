const LRWA_MARK_SVG = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M50 12L70 76.72L30 76.72Z"
    fill="#0D0D0F"
    stroke="#F4F3EF"
    stroke-width="3"
    stroke-linejoin="miter"
    stroke-linecap="square"
  />
  <path
    d="M88 32L15 70V42Z"
    fill="#0D0D0F"
    stroke="#F4F3EF"
    stroke-width="3"
    stroke-linejoin="miter"
    stroke-linecap="square"
  />
</svg>`;

export function GET() {
  return new Response(LRWA_MARK_SVG, {
    headers: {
      "Cache-Control":
        "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      "Content-Disposition": 'inline; filename="lrwa-logo.svg"',
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
