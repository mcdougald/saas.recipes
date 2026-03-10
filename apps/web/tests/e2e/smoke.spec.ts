import { expect, test } from "@playwright/test";

test("landing page renders core content @smoke", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/SaaS Recipes/i);
  await expect(page.getByRole("main")).toBeVisible();
});
