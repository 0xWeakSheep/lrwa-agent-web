# LRWA Agent Web

LRWA is an evidence-operations prototype for commercial diligence. It turns
one business claim into role-based inquiry strategies, staged follow-ups,
traceable receipts and the next evidence request.

The product starts empty. It does not claim to have investigated a company,
contacted a merchant or connected to an external platform.

## Current product flow

1. Define the subject and one falsifiable business claim.
2. Select buyer, supplier, peer and skeptic perspectives.
3. Review the opening question, follow-up rule, requested receipt and identity
   boundary for each role.
4. Copy a strategy or confirm an action that the user performed through an
   authorized channel. The server never sends merely because a plan exists.
5. Manually record a user-submitted receipt. The server computes a SHA-256
   content hash when connected; browser-only mode is labeled separately.
6. Keep the conclusion locked until more than one role has actual receipts.
7. Turn every unresolved route into a concrete next action.

Strategy drafts never count as sent messages. Copied text never counts as an
external action. Only user-confirmed receipts appear in the evidence ledger.

## Routes

- `/` product story, role-method preview and operating boundaries
- `/investigations` claim definition and role plan
- `/investigations/workbench` staged role workbench
- `/investigations/evidence` truthful evidence ledger
- `/investigations/next` next evidence requests

The retired fictional-case routes return `404`. The interface no longer
contains a prefilled sample-company case.

## Local state

The frontend first writes to the NestJS evidence-operations API. The current
API uses volatile in-memory storage, so a backend restart removes its records.
The browser keeps the current snapshot under `lrwa-investigation-v2`.

- If the API is unreachable, the UI explicitly enters browser-only mode.
- A hosted build with no configured API address immediately enters
  browser-only mode and never probes the reviewer's own `localhost`.
- A later sync failure is shown as `server_sync_failed`; it is never presented
  as a successful server action.
- If a request was sent but its response was lost, the UI records
  `server_sync_unknown` and does not claim that the server failed or
  automatically repeat an external action.
- No Meituan, Google or other external data connector is configured.
- No automatic platform query is performed.
- No synthetic result is inserted when an API is unavailable.
- Clearing browser storage removes the local snapshot and browser-only data.
- Browser-only records are plaintext device-local prototype data. Do not enter
  credentials, personal information or unauthorized sensitive material.

Both storage modes are suitable for a prototype only. Production use needs
authentication, encrypted server-side storage, role permissions, retention
controls and a complete provenance model.

## Run locally

Requirements:

- Node.js 22.13 or newer

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

Start the NestJS service from the sibling `lrwa-agent` repository at
`http://localhost:3001/v1`, then configure:

```dotenv
NEXT_PUBLIC_LRWA_API_URL=http://localhost:3001/v1
```

`NEXT_PUBLIC_LRWA_API_URL` is only a public service address. DeepSeek and
connector credentials stay in the backend.

## Deploy the frontend to Vercel

The repository keeps `npm run build` for the Vinext/Cloudflare target.
`vercel.json` overrides Vercel with the native Next.js build:

```bash
npm run build:vercel
```

Use the `Next.js` framework preset and leave **Output Directory** empty so
Vercel uses the framework default `.next` output. Configure the public backend
address at build time:

```dotenv
NEXT_PUBLIC_LRWA_API_URL=https://lrwa-api.43-130-230-4.sslip.io/v1
```

Do not place DeepSeek or connector credentials in Vercel or any
`NEXT_PUBLIC_*` variable. Changing the public API address requires a new
deployment because Next.js embeds it in the browser bundle during the build.

## DeepSeek planning boundary

DeepSeek is opt-in in the claim form. When enabled, the subject, claim and
optional source note are sent through the backend to generate draft inquiry
language. The returned provenance states whether the model ran live or the
backend used a local fallback.

DeepSeek cannot mark a mission as contacted, write a receipt, create a metric,
or unlock a conclusion. Those state changes require a user-confirmed action or
a user-submitted receipt.

## Future integrations

Real connectors must be implemented server-side. API keys and partner secrets
must never be placed in `NEXT_PUBLIC_*` variables or browser storage.

Each connector should expose explicit loading, empty, permission, rate-limit
and error states. A failed connector must stay failed until the user chooses a
different source. It must never silently substitute a scripted result.

The public demo intentionally has no remote API address. Do not expose the
unauthenticated prototype backend or attach a live model key to a public
endpoint.

## Technical shape

- Next.js 16 and React 19
- TypeScript strict mode
- Carbon components and icons
- Vinext and Vite for Cloudflare-compatible builds
- NestJS evidence-operations API with browser-only fallback
- Explicit planning, storage and hash-authority provenance labels
- Responsive dark editorial interface using the supplied LRWA mark

## Verification

```bash
npm run lint
npm run typecheck
npm test
```

The test suite builds the production worker, renders all five routes, verifies
the supplied logo assets, checks that the old scripted-completion fallback is
absent and guards the hosted API fallback boundary.

See [ASSET_CREDITS.md](./ASSET_CREDITS.md) for generated-asset provenance.
