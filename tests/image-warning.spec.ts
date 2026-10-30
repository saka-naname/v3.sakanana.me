import { expect, test } from "@playwright/test";

test("警告画像は表示ボタンを押すまで内容と画像説明を隠す", async ({
  page,
}, testInfo) => {
  await page.goto("/works/image-warning-test/");
  const gallery = page.getByRole("region", {
    name: "画像警告のテスト作品の画像",
  });
  await expect(gallery.getByText("作品の結末を含みます。")).toBeVisible();
  await gallery.screenshot({ path: testInfo.outputPath("warning.png") });
  await expect(
    gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toHaveCount(0);
  await gallery
    .getByRole("button", { name: "画像を表示", exact: true })
    .first()
    .click();
  await expect(
    gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toBeVisible();
  await expect(gallery.getByRole("button", { name: "隠す" })).toBeFocused();
  await gallery.screenshot({ path: testInfo.outputPath("revealed.png") });
});

test("再び隠す操作とサムネイルが連動し、画像を切り替えても解除状態を保持する", async ({
  page,
}) => {
  await page.goto("/works/image-warning-test/");
  const gallery = page.getByRole("region", {
    name: "画像警告のテスト作品の画像",
  });
  const first = gallery.getByRole("button", {
    name: "1枚目を表示",
    exact: true,
  });
  await gallery
    .getByRole("button", { name: "画像を表示", exact: true })
    .click();
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await expect(
    first.getByRole("img", { name: "画像に関する注意" }),
  ).toHaveCount(0);
  await gallery
    .getByRole("button", { name: "2枚目を表示", exact: true })
    .click();
  await expect(
    gallery.getByRole("img", { name: "警告のない画像の説明" }),
  ).toBeVisible();
  await first.click();
  await expect(
    gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toBeVisible();
  await gallery.getByRole("button", { name: "隠す" }).click();
  await expect(
    gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toHaveCount(0);
  await expect(
    gallery.getByRole("button", { name: "画像を表示", exact: true }),
  ).toBeFocused();
  await expect(
    gallery
      .getByRole("button", { name: "1枚目を表示（画像に関する注意）" })
      .getByRole("img", { name: "画像に関する注意" }),
  ).toBeVisible();
  await gallery
    .getByRole("button", { name: "3枚目を表示（画像に関する注意）" })
    .click();
  await expect(
    gallery.getByText("内容を確認してから表示してください。"),
  ).toBeVisible();
  await expect(
    gallery.getByRole("img", { name: "別の警告画像の説明" }),
  ).toHaveCount(0);
});

test("再読み込みと履歴からの再訪問では警告に戻る", async ({ page }) => {
  await page.goto("/works/image-warning-test/");
  const gallery = page.getByRole("region", {
    name: "画像警告のテスト作品の画像",
  });
  await gallery
    .getByRole("button", { name: "画像を表示", exact: true })
    .click();
  await page.reload();
  await expect(
    gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toHaveCount(0);
  await gallery
    .getByRole("button", { name: "画像を表示", exact: true })
    .click();
  await page.goto("/works/");
  await page.goBack();
  await expect(
    gallery.getByRole("button", { name: "画像を表示", exact: true }),
  ).toBeVisible();
  await expect(
    gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toHaveCount(0);
});

test("画像が1枚でも警告をキーボードで解除・再表示できる", async ({ page }) => {
  await page.goto("/image-warning-test/");
  const gallery = page.getByRole("region", { name: "画像が1枚のギャラリー" });
  const reveal = gallery.getByRole("button", {
    name: "画像を表示",
    exact: true,
  });
  await expect(
    gallery.getByText("内容を確認してから表示してください。"),
  ).toBeVisible();
  await reveal.focus();
  await page.keyboard.press("Enter");
  const hide = gallery.getByRole("button", { name: "隠す" });
  await expect(hide).toBeFocused();
  await expect(
    gallery.getByRole("img", { name: "別の警告画像の説明" }),
  ).toBeVisible();
  await page.keyboard.press("Space");
  await expect(reveal).toBeFocused();
  await expect(
    gallery.getByRole("img", { name: "別の警告画像の説明" }),
  ).toHaveCount(0);
  await expect(
    gallery.getByRole("button", { name: "次の画像を表示" }),
  ).toHaveCount(0);
});

test("左右キーやドラッグによる移動では警告を解除しない", async ({ page }) => {
  await page.goto("/works/image-warning-test/");
  const gallery = page.getByRole("region", {
    name: "画像警告のテスト作品の画像",
  });
  await page.getByRole("link", { name: "WORKS", exact: true }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowRight");
  await expect(
    gallery.getByRole("button", { name: "2枚目を表示", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowRight");
  await expect(
    gallery.getByRole("button", { name: "3枚目を表示（画像に関する注意）" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    gallery.getByRole("img", { name: "別の警告画像の説明" }),
  ).toHaveCount(0);

  await gallery
    .getByRole("button", { name: "1枚目を表示（画像に関する注意）" })
    .click();
  const slide = gallery.getByRole("group", { name: "1 / 3", exact: true });
  await slide.scrollIntoViewIfNeeded();
  await expect(slide).toBeInViewport({ ratio: 0.99 });
  const box = await slide.boundingBox();
  if (!box) throw new Error("Slide is not visible");
  await page.mouse.move(box.x + box.width - 24, box.y + box.height / 4);
  await page.mouse.down();
  await page.mouse.move(box.x + 24, box.y + box.height / 4, { steps: 12 });
  await page.mouse.up();
  await expect(
    gallery.getByRole("button", { name: "2枚目を表示", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await gallery
    .getByRole("button", { name: "1枚目を表示（画像に関する注意）" })
    .click();
  await expect(
    gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toHaveCount(0);
});

test.describe("JavaScriptなし", () => {
  test.use({ javaScriptEnabled: false });

  test("画像と説明を隠したまま、操作ボタンの代わりに案内を表示する", async ({
    page,
  }) => {
    await page.goto("/works/image-warning-test/");
    const gallery = page.getByRole("region", {
      name: "画像警告のテスト作品の画像",
    });
    await expect(gallery.locator("noscript p").first()).toBeVisible();
    await expect(
      gallery.getByRole("button", { name: "画像を表示", exact: true }),
    ).toHaveCount(0);
    await expect(
      gallery.getByRole("img", { name: "結末が分かる画像の説明" }),
    ).toHaveCount(0);
  });
});
