import { test, expect, Page, Locator } from "@playwright/test";

// Helper function to ensure page is fully loaded before interactions
const ensurePageLoaded = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
};

const generateRandomPassword: string = () => {
  return "password";
};

test("Should be able to register sucessfully", async ({ page }) => {
  const userNumber = Math.floor(Math.random() * 9999);
  const password = generateRandomPassword();

  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  // Access the register page from the HomePage's SignInTile
  const registerButton = page.getByTestId("sign-in-tile-register-btn");
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByTestId("auth-form-register")).toBeVisible();

  // Success on correct completion of form
  await page.locator("[id=firstName-field]").fill("John");
  await page.locator("[id=lastName-field]").fill("Doe");
  await page.locator("[id=emailAddress-field]").fill(`${userNumber}@email.com`);
  await page.locator("[id=password-field]").fill(password);
  await page.locator("[data-localization-key=formButtonPrimary]").click();

  // Check assertion by appropriate UI change
  await expect(page.getByText("registered")).toBeVisible();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByTestId("go-to-kanban-btn")).toBeVisible();
});

test("Should allow user to sign in from HomePage", async ({ page }) => {
  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  // Get sign in button & expect correct heading
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

test("Should allow user to sign in from Header button", async ({ page }) => {
  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  await page.getByTestId("header-sign-in-link").click();
});

test("Should allow user to sign out", async ({ page }) => {
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
