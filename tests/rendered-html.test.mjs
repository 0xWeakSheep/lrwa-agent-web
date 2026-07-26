import assert from "node:assert/strict";
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
  assert.match(html, /Test the world behind the spreadsheet/);
  assert.match(html, /Run simulated diligence/);
  assert.match(html, /Fictional company/);
  assert.match(html, /5 evidence families/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("server-renders the complete case workflow", async () => {
  const routes = [
    [
      "/cases/morrow-coffee",
      /Review the mission before agents act/,
      /Approve and run mission/,
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
        "../components/workspace-shell.tsx",
        "../components/live-mission.tsx",
        "../components/findings-workspace.tsx",
        "../components/decision-actions.tsx",
        "../lib/demo-data.ts",
      ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
    ),
  ]);

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(sourceFiles.join("\n"), /[—–]/);
  await assert.rejects(
    access(new URL("../app/_sites-preview", import.meta.url)),
  );
  await access(new URL("README.md", projectRoot));
});
