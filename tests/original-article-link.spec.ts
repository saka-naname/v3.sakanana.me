import { expect, type Page, test } from "@playwright/test";

// tests/run.mjs が src/content/test/notes/valid/ のノートを読み込んで dev サーバーを起動する
const crossPostedNote = "/notes/cross-posted-note-test/";
const regularNote = "/notes/regular-note-test/";
const originalUrl = "https://zenn.dev/example/articles/cross-posted-note-test";
const noticeText = "この記事は Zenn でも読めます";
const noticeLinkName = "Zenn で読む";

const noticeOf = (page: Page) =>
  page.getByRole("complementary", { name: "ほかの媒体" });

test.describe("転載ノートの詳細ページ", () => {
  test("ヘッダーと本文のあいだに、原本記事を読める媒体とリンクを出す", async ({
    page,
  }) => {
    await page.goto(crossPostedNote);
    const notice = noticeOf(page);

    await expect(notice.getByText(noticeText)).toBeVisible();
    const link = notice.getByRole("link", { name: noticeLinkName });
    await expect(link).toHaveAttribute("href", originalUrl);
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("枠はヘッダーのあと、本文の前にあり、本文の外にある", async ({
    page,
  }) => {
    await page.goto(crossPostedNote);
    const order = await page.evaluate(() =>
      [...document.querySelectorAll(".note-detail > *")].map((element) =>
        element.matches("header")
          ? "header"
          : element.matches('aside[aria-label="ほかの媒体"]')
            ? "notice"
            : element.matches("[data-note-body]")
              ? "body"
              : null,
      ),
    );
    expect(order.filter(Boolean)).toEqual(["header", "notice", "body"]);
  });

  test("枠の文言に「転載」「原本記事」を使わない", async ({ page }) => {
    await page.goto(crossPostedNote);
    const notice = noticeOf(page);
    await expect(notice).not.toContainText("転載");
    await expect(notice).not.toContainText("原本記事");
  });

  test("狭い画面幅では横スクロールを出さずに文とリンクが折り返す", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(crossPostedNote);
    const notice = noticeOf(page);
    const text = await notice.getByText(noticeText).boundingBox();
    const link = await notice
      .getByRole("link", { name: noticeLinkName })
      .boundingBox();
    expect(text && link && link.y >= text.y + text.height).toBe(true);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("転載ノートでないノートの詳細ページ", () => {
  test("原本記事への枠を出さない", async ({ page }) => {
    await page.goto(regularNote);
    await expect(page.locator("[data-note-body]")).toBeVisible();
    await expect(noticeOf(page)).toHaveCount(0);
  });
});

test.describe("Notes の一覧", () => {
  for (const [name, pathname] of [
    ["Notes の一覧", "/notes/"],
    ["ホームの最新ノート欄", "/"],
  ]) {
    test(`${name}では、転載ノートを他のノートと区別せず詳細ページへリンクする`, async ({
      page,
    }) => {
      await page.goto(pathname);
      const item = page.locator(".note-list-item", {
        has: page.locator(`a[href="${crossPostedNote}"]`),
      });
      const regularItem = page.locator(".note-list-item", {
        has: page.locator(`a[href="${regularNote}"]`),
      });
      await expect(item).toHaveCount(1);
      await expect(regularItem).toHaveCount(1);

      await expect(item.getByRole("link")).toHaveCount(1);
      await expect(item).not.toContainText("Zenn");
      await expect(page.locator(`a[href="${originalUrl}"]`)).toHaveCount(0);

      // 転載ノートと通常のノートで、項目の要素の並びが同じ
      const shape = (locator: typeof item) =>
        locator.evaluate((element) =>
          [element, ...element.querySelectorAll("*")]
            .map((node) => `${node.tagName}.${node.className}`)
            .join(" "),
        );
      expect(await shape(item)).toBe(await shape(regularItem));
    });
  }
});
