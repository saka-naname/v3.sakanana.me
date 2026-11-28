import { expect, test } from "@playwright/test";

// tests/run.mjs が src/content/test/notes/valid/ のノートを読み込んで dev サーバーを起動する
const noteWithCode = "/notes/regular-note-test/";

test.describe("コードブロックのコピーボタン", () => {
  test("コードブロックを横にスクロールしても、ボタンは右上から動かない", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(noteWithCode);
    const pre = page.locator("[data-note-body] pre").first();
    const button = page.getByRole("button", { name: "コードをコピー" }).first();
    await expect(button).toBeAttached();

    const offsets = async () => {
      const preBox = await pre.boundingBox();
      const buttonBox = await button.boundingBox();
      if (!preBox || !buttonBox) throw new Error("box not found");
      return {
        right: preBox.x + preBox.width - (buttonBox.x + buttonBox.width),
        top: buttonBox.y - preBox.y,
      };
    };

    const before = await offsets();
    const scrolled = await pre.evaluate((element) => {
      if (element.scrollWidth <= element.clientWidth) return false;
      element.scrollLeft = element.scrollWidth;
      return element.scrollLeft > 0;
    });
    expect(scrolled).toBe(true);

    const after = await offsets();
    expect(after.right).toBeCloseTo(before.right, 0);
    expect(after.top).toBeCloseTo(before.top, 0);
    // 右上の隅にある
    expect(before.right).toBeGreaterThanOrEqual(0);
    expect(before.right).toBeLessThan(16);
    expect(before.top).toBeGreaterThanOrEqual(0);
    expect(before.top).toBeLessThan(16);
  });
});
