import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";

const noindexMeta = /<meta\s+name="robots"\s+content="[^"]*\bnoindex\b[^"]*"/i;

function htmlFileOf(pathname, dir) {
  const path = pathname.replace(/^\/+|\/+$/g, "");
  const lastSegment = path.split("/").pop() ?? "";
  if (lastSegment.includes(".")) {
    // robots.txt などの HTML でないページは対象外
    return lastSegment.endsWith(".html") ? new URL(path, dir) : undefined;
  }

  const candidates =
    path === ""
      ? [new URL("index.html", dir)]
      : [new URL(`${path}/index.html`, dir), new URL(`${path}.html`, dir)];
  const file = candidates.find((candidate) => existsSync(candidate));
  if (!file) {
    throw new Error(`Built HTML for page "/${path}" was not found`);
  }
  return file;
}

/**
 * ビルドした HTML に robots の noindex があるページを集め、sitemap から外せるようにする。
 * @astrojs/sitemap より前に integrations に並べ、`isIndexable` を sitemap の filter に渡す。
 */
export function noindexPages() {
  const noindexUrls = new Set();
  let siteUrl;

  return {
    integration: {
      name: "noindex-pages",
      hooks: {
        "astro:config:done": ({ config }) => {
          if (!config.site) {
            throw new Error("noindex-pages requires the `site` option");
          }
          siteUrl = new URL(config.base, config.site);
        },
        "astro:build:done": async ({ dir, pages }) => {
          noindexUrls.clear();
          for (const { pathname } of pages) {
            const file = htmlFileOf(pathname, dir);
            if (!file) continue;

            const html = await readFile(file, "utf8");
            const headEnd = html.indexOf("</head>");
            if (headEnd === -1) {
              throw new Error(`Built HTML ${file.pathname} has no </head>`);
            }
            const head = html.slice(0, headEnd);
            if (noindexMeta.test(head)) {
              noindexUrls.add(
                new URL(pathname.replace(/^\/+/, ""), siteUrl).href,
              );
            }
          }
        },
      },
    },
    isIndexable: (url) => !noindexUrls.has(url),
  };
}
