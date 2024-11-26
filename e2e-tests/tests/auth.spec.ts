import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test("should allow user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  // get sign in button & expect correct heading
  await page.getByRole("button", { name: "Sign In" }).nth(0).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // fill fields & click login
  await page.locator("[name=racfid]").fill("J900000");
  await page.locator("[name=password]").fill("Password?123");
  await page.getByRole("button", { name: "Sign In" }).nth(1).click();

  // check assertion for successful sign in by UI change
  await expect(page.getByText("Signed in")).toBeVisible();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByText("Kanban Menu")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Go to Kanban" })
  ).toBeVisible();
});
