# LRWA Agent Web

LRWA, Live Real-World Assurance, is an OpenArena BUIDL_QUESTS 2026 demo for
turning business claims into bounded and auditable reality-verification
missions.

The demo follows a fictional Series A diligence case for Morrow Coffee. It
coordinates specialist agents across storefront, consumer, digital-channel,
staffing and supply-chain signals, then links every conclusion to synthetic
evidence, uncertainty and a deterministic replay.

> All companies, stores, events and evidence displayed in this project are
> fictional and illustrative. The demo does not contact real merchants, place
> real orders, scrape live platforms or process personal information.

## Public demo and reviewer materials

- Product demo: https://lrwa-agent-web.cheeky-angel-7701.chatgpt.site
- 90-second film: https://raw.githubusercontent.com/0xWeakSheep/lrwa-agent-web/main/public/materials/LRWA_OpenArena_Demo_90s.mp4
- Seed deck: https://raw.githubusercontent.com/0xWeakSheep/lrwa-agent-web/main/public/materials/LRWA_Seed_Deck.pdf
- Agent backend: https://github.com/0xWeakSheep/lrwa-agent

## Demo flow

1. Review four material business claims and a 1,024-unit planned probe quota.
2. Start the synthetic mission through the explicit demo interaction gate.
3. Watch the Reality Twin mission through the backend SSE stream or local
   deterministic fallback.
4. Inspect the GMV finding and trace it through five evidence artifacts.
5. Inspect a 20% corporate-order counterfactual and run the same-seed replay.
6. Turn remaining uncertainty into targeted evidence requests.

## Routes

- `/` product story and live product preview
- `/cases/morrow-coffee` mission plan and approval gate
- `/cases/morrow-coffee/live` agent mission control
- `/cases/morrow-coffee/findings` evidence ledger and skeptic replay
- `/cases/morrow-coffee/actions` decision action queue

## Run locally

Requirements:

- Node.js 22.13 or newer
- The LRWA NestJS API, optional for connected mode

```bash
npm install
cp .env.example .env.local
npm run dev
```

The frontend runs at `http://localhost:3000`. The example environment points to
the API at `http://localhost:3001/v1`.

To demo without the API, remove `NEXT_PUBLIC_API_BASE_URL` from `.env.local`.
The app then runs locally with the same seed, values and visible `Deterministic
local fallback` runtime label. A deployed build never attempts to call
localhost unless that URL was explicitly configured.

## API integration

The approval gate drives the full backend lifecycle:

```text
POST /v1/demo/cases
POST /v1/investigations/:id/plan
POST /v1/investigations/:id/approve
POST /v1/investigations/:id/start
GET  /v1/investigations/:id/events
POST /v1/investigations/:id/replay
GET  /v1/investigations/:id/findings
```

The replay submits `{ "corporateOrderShare": 0.2 }` and reads the resulting GMV
finding from the API. Local fallback uses the same canonical result: ¥2.40m,
¥2.12m to ¥2.72m scenario band, 27.9% gap and a 0.82 heuristic policy score.

## Technical shape

- Next.js 16 and React 19
- TypeScript with strict mode
- Carbon components and Carbon icons
- Server-rendered route shells with focused client interaction islands
- EventSource integration with a deterministic offline fallback
- Accessible, responsive dark intelligence-terminal interface

No separate AI repository is required for the demo. Agent roles, guardrails,
seeded evidence generation, statistics and event orchestration live in the
NestJS backend so the audit trail remains in one place.

## Verification

```bash
npm run lint
npm run typecheck
npm test
```

`npm test` creates a production build and verifies all five rendered routes,
synthetic-data disclosures and starter-code removal.

See [ASSET_CREDITS.md](./ASSET_CREDITS.md) for generated-asset provenance and
third-party license acknowledgements.
