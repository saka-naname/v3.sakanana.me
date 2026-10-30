import { expect, test } from "@playwright/test";

test("すべてのカードで代表画像の内容と説明を隠し、詳細へ移動する", async ({
  page,
}) => {
  await page.goto("/image-warning-test/");
  const cards = page.getByRole("region", { name: "カードの表示" });
  await expect(
    cards.getByRole("img", { name: "結末が分かる画像の説明" }),
  ).toHaveCount(0);
  await expect(
    cards.getByRole("img", { name: "画像に関する注意" }),
  ).toHaveCount(5);
  await expect(cards.getByRole("button", { name: "画像を表示" })).toHaveCount(
    0,
  );
  await cards.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/works\/image-warning-test\/$/);
});

test("Works詳細では警告の有無にかかわらずOGP画像を指定しない", async ({
  page,
}) => {
  for (const slug of ["image-warning-test", "yoru-note"]) {
    await page.goto(`/works/${slug}/`);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary",
    );
  }
});
