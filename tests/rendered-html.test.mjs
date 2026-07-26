import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderedHtml(pathname) {
  const response = await render(pathname);
  assert.equal(response.status, 200, `${pathname} should return 200`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("server-renders the LRWA landing page and disclosure", async () => {
  const html = await renderedHtml("/");
  assert.match(html, /<title>Live Real-World Assurance \| LRWA<\/title>/i);
  assert.match(html, /Verify the world/);
  assert.match(html, /behind the numbers/);
  assert.match(html, /Run the demo/);
  assert.match(html, /Fictional case/);
  assert.match(html, /evidence categories/);
  assert.match(html, /lrwa-cinematic-hero\.webp/);
  assert.match(html, /brand-symbol/);
  assert.match(html, /lrwa-evidence-table\.webp/);
  assert.doesNotMatch(html, /Compile the claim|Observe within declared boundaries/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("server-renders the complete case workflow", async () => {
  const routes = [
    [
      "/cases/morrow-coffee",
      /Review the mission before agents act/,
      /Start synthetic mission/,
    ],
    [
      "/cases/morrow-coffee/live",
      /Watch the estimate change as evidence arrives/,
      /Synthetic observation field/,
    ],
    [
      "/cases/morrow-coffee/findings",
      /A conclusion you can inspect and challenge/,
      /Challenge the conclusion/,
    ],
    [
      "/cases/morrow-coffee/actions",
      /Close the uncertainty that changes the decision/,
      /Evidence requests/,
    ],
  ];

  for (const [pathname, title, marker] of routes) {
    const html = await renderedHtml(pathname);
    assert.match(html, title);
    assert.match(html, marker);
    assert.match(html, /Synthetic demo data/);
    assert.match(html, /fictional company/i);
  }
});

test("removes starter assets and prohibited separator glyphs", async () => {
  const [packageJson, sourceFiles] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    Promise.all(
      [
        "../app/page.tsx",
        "../app/layout.tsx",
        "../app/cases/morrow-coffee/page.tsx",
        "../app/cases/morrow-coffee/live/page.tsx",
        "../components/plan-gate.tsx",
        "../components/workspace-shell.tsx",
        "../components/live-mission.tsx",
        "../components/findings-workspace.tsx",
        "../components/decision-actions.tsx",
        "../lib/demo-data.ts",
      ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
    ),
  ]);

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  const visibleCopy = sourceFiles.join("\n");
  assert.doesNotMatch(visibleCopy, /[—–]/);
  assert.doesNotMatch(
    visibleCopy,
    /independent evidence|independent observation|independentSourceCount|source independence|logic-distinct|source score|1,024 entries|1,024 probes|观察任务|\bintervals?\b|90% scenario|source confidence|evidence confidence/i,
  );
  await assert.rejects(
    access(new URL("../app/_sites-preview", import.meta.url)),
  );
  await access(new URL("../app/icon.svg", import.meta.url));
  await access(new URL("../public/lrwa-mark.svg", import.meta.url));
  await access(new URL("README.md", projectRoot));
});

test("recomputes every fallback receipt content hash", async () => {
  const fixture = JSON.parse(
    await readFile(new URL("../lib/demo-evidence.json", import.meta.url), "utf8"),
  );
  assert.equal(fixture.length, 5);
  for (const receipt of fixture) {
    const { hash, ...payload } = receipt;
    const recomputed = createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");
    assert.equal(hash, `sha256:${recomputed}`);
  }
});

test("subscribes to every task-policy lifecycle event", async () => {
  const liveMission = await readFile(
    new URL("../components/live-mission.tsx", import.meta.url),
    "utf8",
  );
  assert.match(liveMission, /"TOOL_POLICY_CHECKED"/);
  assert.match(liveMission, /"AGENT_TASK_COMPLETED"/);
  assert.doesNotMatch(liveMission, /type === "AGENT_DISPATCHED"/);
});
