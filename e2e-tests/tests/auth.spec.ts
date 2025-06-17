import { test, expect, Page, Locator } from "@playwright/test";

// Helper function to ensure page is fully loaded before interactions
const ensurePageLoaded = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
};

test("should be able to register sucessfully", async ({ page }) => {
  const userNumber = Math.floor(Math.random() * 9999);

  // access the register page from the sign in page
  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  // Use the safe click helper for more stability
  const signInButton = page.getByTestId("header-sign-in-link");
  await expect(signInButton).toBeVisible();
  await signInButton.click();

  // Continue with the rest of the test
  await page.getByTestId("create-account-link").click();
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();

  // success on correct completion of form
  await page.locator("[name=email]").fill(`${userNumber}@email.com`);
  await page.locator("[name=name]").fill(`User ${userNumber}`);
  await page.locator("[name=password]").fill("Password?123");
  await page.locator("[name=confirmPassword]").fill("Password?123");
  await page.getByTestId("profile-form-submit-btn").click();

  // check assertion by appropriate UI change
  await expect(page.getByText("registered")).toBeVisible();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByTestId("go-to-kanban-btn")).toBeVisible();
});

test("should allow user to sign in", async ({ page }) => {
  // get sign in button & expect correct heading
  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  const signInButton = page.getByTestId("header-sign-in-link");
  await expect(signInButton).toBeVisible();
  await signInButton.click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // fill fields & click login
  await page.locator("[name=racfid]").fill("J000001");
  await page.locator("[name=password]").fill("Password?123");
  await page.getByTestId("sign-in-btn").click();

  // check assertion for successful sign in by UI change
  await expect(page.getByText("Signed in")).toBeVisible();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByTestId("go-to-kanban-btn")).toBeVisible();
});

test("should allow user to sign out", async ({ page }) => {
  // sign in
  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  await page.getByTestId("header-sign-in-link").click();
  await page.locator("[name=racfid]").fill("J000001");
  await page.locator("[name=password]").fill("Password?123");
  await page.getByTestId("sign-in-btn").click();
  await expect(page.getByText("Signed in")).toBeVisible();

  // sign out
  await page.locator("svg.lucide-user").click();
  await page.getByTestId("sign-out-btn").click();

  // check assertion by appropriate UI change
  await expect(page.getByText("Signed out")).toBeVisible();
  await expect(page.getByTestId("header-sign-in-link")).toBeVisible();
});
