import { test, expect, Page, Locator } from "@playwright/test";

const FRONTEND_URL = "http://localhost:5173";

// Helper function to ensure page is fully loaded before interactions
const ensurePageLoaded = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
  // Small additional wait to ensure all JS has executed
  await page.waitForTimeout(process.env.CI ? 3000 : 2000);
};

// Helper function for stable button clicks
const safeClick = async (locator: Locator) => {
  // First ensure the element is visible and attached
  await locator.waitFor({ state: "visible" });
  await locator.waitFor({ state: "attached" });

  // Add a small delay for stability
  await locator.page().waitForTimeout(500);

  // Use force: true in CI to bypass potential detachment issues
  await locator.click({ force: process.env.CI ? true : false });
};

test("should be able to register sucessfully", async ({ page }) => {
  const userNumber = Math.floor(Math.random() * 9999);

  // access the register page from the sign in page
  await page.goto(FRONTEND_URL);
  await ensurePageLoaded(page);

  // Use the safe click helper for more stability
  const signInButton = page.getByRole("button", { name: "Sign In" }).nth(0);
  // await expect(signInButton).toBeVisible();
  await safeClick(signInButton);

  // Continue with the rest of the test
  await safeClick(page.getByRole("link", { name: "Create an account here" }));
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();

  // success on correct completion of form
  await page.locator("[name=email]").fill(`${userNumber}@email.com`);
  await page.locator("[name=name]").fill(`User ${userNumber}`);
  await page.locator("[name=password]").fill("Password?123");
  await page.locator("[name=confirmPassword]").fill("Password?123");
  await safeClick(page.getByRole("button", { name: "Register" }));

  // check assertion by appropriate UI change
  await expect(page.getByText("registered")).toBeVisible();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Go to Kanban" })
  ).toBeVisible();
});

test("should allow user to sign in", async ({ page }) => {
  // get sign in button & expect correct heading
  await page.goto(FRONTEND_URL);
  await ensurePageLoaded(page);

  const signInButton = page.getByRole("button", { name: "Sign In" }).nth(0);
  await expect(signInButton).toBeVisible();
  await safeClick(signInButton);

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // fill fields & click login
  await page.locator("[name=racfid]").fill("J000001");
  await page.locator("[name=password]").fill("Password?123");
  await safeClick(page.getByRole("button", { name: "Sign In" }).nth(1));

  // check assertion for successful sign in by UI change
  await expect(page.getByText("Signed in")).toBeVisible();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Go to Kanban" })
  ).toBeVisible();
});

test("should allow user to sign out", async ({ page }) => {
  // sign in
  await page.goto(FRONTEND_URL);
  await ensurePageLoaded(page);

  await safeClick(page.getByRole("button", { name: "Sign In" }).nth(0));
  await page.locator("[name=racfid]").fill("J000001");
  await page.locator("[name=password]").fill("Password?123");
  await safeClick(page.getByRole("button", { name: "Sign In" }).nth(1));
  await expect(page.getByText("Signed in")).toBeVisible();

  // sign out
  await safeClick(page.locator("svg.lucide-user"));
  await safeClick(page.getByRole("button", { name: "Sign Out" }));

  // check assertion by appropriate UI change
  await expect(page.getByText("Signed out")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign In" }).nth(0)
  ).toBeVisible();
});
