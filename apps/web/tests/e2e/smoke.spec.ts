import { expect, test } from "@playwright/test";

test("landing page renders core content @smoke", async ({ page }) => {
  test.setTimeout(20_000);

  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
    timeout: 15_000,
  });

  expect(response?.ok()).toBeTruthy();

  await expect(page).toHaveTitle(/SaaS Recipes/i);
  await expect(page.getByRole("main")).toBeVisible();
});
