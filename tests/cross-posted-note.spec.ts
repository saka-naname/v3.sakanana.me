import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

// tests/run.mjs が src/content/test/notes/ のノートを読み込んで本番ビルドした結果を読む
const buildRoot = process.env.TEST_BUILD_ROOT;
const site = "https://sakanana.me";

function builtFile(path: string): string {
  if (!buildRoot) throw new Error("Run browser tests with `npm test`.");
  return readFileSync(join(buildRoot, path), "utf8");
}

function headOf(pathname: string) {
  const html = builtFile(join("dist", pathname, "index.html"));
  const head = html.slice(0, html.indexOf("</head>"));
  const attribute = (pattern: RegExp) =>
    [...head.matchAll(pattern)].map((match) => match[1]);
  return {
    robots: attribute(/<meta name="robots" content="([^"]*)"/g),
    canonical: attribute(/<link rel="canonical" href="([^"]*)"/g),
    ogUrl: attribute(/<meta property="og:url" content="([^"]*)"/g),
  };
}

function sitemapUrls(): string[] {
  const dist = join(buildRoot ?? "", "dist");
  const files = readdirSync(dist).filter((name) =>
    /^sitemap-\d+\.xml$/.test(name),
  );
  expect(files.length).toBeGreaterThan(0);
  return files.flatMap((name) =>
    [...builtFile(join("dist", name)).matchAll(/<loc>([^<]*)<\/loc>/g)].map(
      (match) => match[1],
    ),
  );
}

test.describe("転載ノート", () => {
  test("詳細ページは noindex で、canonical を出さず、og:url は自身の URL", () => {
    expect(headOf("notes/cross-posted-note-test")).toEqual({
      robots: ["noindex"],
      canonical: [],
      ogUrl: [`${site}/notes/cross-posted-note-test/`],
    });
  });

  test("sitemap に含まれない", () => {
    expect(sitemapUrls()).not.toContain(
      `${site}/notes/cross-posted-note-test/`,
    );
  });

  for (const [name, missing] of [
    ["url-only", "medium"],
    ["medium-only", "url"],
  ]) {
    test(`originalArticle の ${missing} がないとコンテンツの検証で失敗する（${name}）`, () => {
      const results = JSON.parse(builtFile("invalid-notes.json"));
      const result = results[name];
      expect(result.status).not.toBe(0);
      expect(result.output).toContain("does not match collection schema");
      expect(result.output).toContain(`originalArticle.${missing}`);
    });
  }
});

// 転載ノートでないノートと、ほかのページ
const regularPages = [
  "notes/regular-note-test/",
  "",
  "notes/",
  "works/",
  "about/",
];

test.describe("転載ノートでないページ", () => {
  for (const pathname of regularPages) {
    test(`/${pathname} は canonical と og:url が自身の URL で、noindex を出さない`, () => {
      const url = `${site}/${pathname}`;
      expect(headOf(pathname)).toEqual({
        robots: [],
        canonical: [url],
        ogUrl: [url],
      });
    });
  }

  test("sitemap に含まれる", () => {
    const urls = sitemapUrls();
    for (const pathname of regularPages) {
      expect(urls).toContain(`${site}/${pathname}`);
    }
  });
});
