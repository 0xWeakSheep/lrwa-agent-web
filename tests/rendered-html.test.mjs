import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

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

test("server-renders the evidence operations landing page", async () => {
  const html = await renderedHtml("/");
  assert.match(html, /<title>Evidence Operations \| LRWA<\/title>/i);
  assert.match(html, /别只让 AI 分析/);
  assert.match(html, /让它去求证/);
  assert.match(html, /发起调查/);
  assert.match(html, /没有可追溯回执，就不生成结论/);
  assert.match(html, /方法预览 · 尚未执行/);
  assert.match(html, /lrwa-cinematic-hero\.webp/);
  assert.match(html, /lrwa-evidence-table\.webp/);
  assert.match(html, /brand-symbol/);
  assert.doesNotMatch(html, /1,024|¥3\.33m|¥1\.92m|0\.88/);
  assert.doesNotMatch(html, /Run the demo|Mission complete|Morrow Coffee/);
});

test("server-renders every honest-state workflow route", async () => {
  const routes = [
    [
      "/investigations",
      /先定义什么必须是真的/,
      /正在读取本地调查草稿/,
    ],
    [
      "/investigations/workbench",
      /让每个角色完成一次有边界的深挖/,
      /正在读取调查任务/,
    ],
    [
      "/investigations/evidence",
      /证据先于结论/,
      /正在校验证据账本/,
    ],
    [
      "/investigations/next",
      /让每个缺口变成下一步动作/,
      /正在读取跟进动作/,
    ],
  ];

  for (const [pathname, title, marker] of routes) {
    const html = await renderedHtml(pathname);
    assert.match(html, title);
    assert.match(html, marker);
    assert.match(html, /策略草案不代表已经发送/);
    assert.doesNotMatch(
      html,
      /Synthetic demo data|fictional company|Mission complete|1,024/,
    );
  }

  const retiredRoute = await render("/cases/morrow-coffee");
  assert.equal(retiredRoute.status, 404);
});

test("keeps truthful state boundaries in the active product source", async () => {
  const activeFiles = await Promise.all(
    [
      "../app/page.tsx",
      "../app/layout.tsx",
      "../app/investigations/page.tsx",
      "../app/investigations/workbench/page.tsx",
      "../app/investigations/evidence/page.tsx",
      "../app/investigations/next/page.tsx",
      "../components/workspace-shell.tsx",
      "../components/investigation-brief.tsx",
      "../components/mission-workbench.tsx",
      "../components/evidence-room.tsx",
      "../components/decision-actions.tsx",
      "../components/landing-role-stage.tsx",
      "../lib/investigation.ts",
      "../lib/evidence-api.ts",
      "../lib/use-investigation.ts",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const visibleCopy = activeFiles.join("\n");

  assert.doesNotMatch(visibleCopy, /[—–]/);
  assert.doesNotMatch(
    visibleCopy,
    /1,024|3_330_000|1_920_000|completedProbes|finalMetrics|Morrow Coffee|晨潮咖啡/,
  );
  assert.match(visibleCopy, /没有可追溯回执，就不生成结论/);
  assert.match(visibleCopy, /复制不代表已经发送/);
  assert.match(visibleCopy, /外部连接/);
  assert.match(visibleCopy, /未配置/);
  assert.match(visibleCopy, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(visibleCopy, /window\.confirm/);
  assert.match(visibleCopy, /userConfirmedExternalSend/);
  assert.match(visibleCopy, /userConfirmedSource/);
  assert.match(visibleCopy, /hasReceiptWithoutConfirmedContact/);
  assert.match(visibleCopy, /server_sync_failed/);
  assert.match(visibleCopy, /server_sync_unknown/);
});

test("removes the scripted-completion fallback from the frontend", async () => {
  const removedFiles = [
    "../components/live-mission.tsx",
    "../components/findings-workspace.tsx",
    "../components/plan-gate.tsx",
    "../lib/demo-data.ts",
    "../lib/demo-evidence.json",
    "../lib/api.ts",
  ];
  for (const path of removedFiles) {
    await assert.rejects(access(new URL(path, import.meta.url)));
  }
});

test("does not probe a reviewer's localhost from the public deployment", async () => {
  const source = await readFile(
    new URL("../lib/evidence-api.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /CONFIGURED_API_URL/);
  assert.match(source, /window\.location\.hostname/);
  assert.match(source, /return null/);
  assert.doesNotMatch(
    source,
    /process\.env\.NEXT_PUBLIC_LRWA_API_URL \|\| LOCAL_API_URL/,
  );
});

test("keeps the supplied geometric mark in the app and browser tab", async () => {
  await access(new URL("../app/icon.svg", import.meta.url));
  await access(new URL("../public/favicon.svg", import.meta.url));
  await access(new URL("../public/lrwa-mark.svg", import.meta.url));

  const layout = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );
  const header = await readFile(
    new URL("../components/site-header.tsx", import.meta.url),
    "utf8",
  );
  assert.match(layout, /\/icon\.svg/);
  assert.match(layout, /\/favicon\.svg/);
  assert.match(header, /M50 12L70 76\.72L30 76\.72Z/);
});
