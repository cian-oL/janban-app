import { test, expect, Page, Locator } from "@playwright/test";
import { setupClerkTestingToken } from "@clerk/testing/playwright";
import "dotenv/config";

// Helper function to ensure page is fully loaded before interactions
const ensurePageLoaded = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
};

const generateRandomPassword = (passwordLength: number = 12): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";

  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < passwordLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

test("Should be able to register sucessfully", async ({ page }) => {
  const userNumber = Math.floor(Math.random() * 9999);
  const password = generateRandomPassword();

  await page.goto("/");
  await setupClerkTestingToken({ page });
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
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByTestId("go-to-kanban-btn")).toBeVisible();
});

test("Should allow user to sign in from HomePage", async ({ page }) => {
  const email = process.env.CLERK_USER_EMAIL as string;
  const password = process.env.CLERK_USER_PASSWORD as string;

  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  // Get sign in button & expect correct heading
  const signInButton = page.getByTestId("sign-in-tile-sign-in-btn");
  await expect(signInButton).toBeVisible();
  await signInButton.click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // fill fields & click login
  await page.locator("[id=identifier-field]").fill(email);
  await page.locator("[name=password]").fill(password);
  await page.locator("[data-localization-key=formButtonPrimary]").click();

  // check assertion for successful sign in by UI change
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByTestId("go-to-kanban-btn")).toBeVisible();
});

test("Should allow user to sign in from Header button", async ({ page }) => {
  const email = process.env.CLERK_USER_EMAIL as string;
  const password = process.env.CLERK_USER_PASSWORD as string;

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
  await page.locator("[id=identifier-field]").fill(email);
  await page.locator("[name=password]").fill(password);
  await page.locator("[data-localization-key=formButtonPrimary]").click();

  // check assertion for successful sign in by UI change
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByTestId("go-to-kanban-btn")).toBeVisible();
});

test("Should allow user to sign out", async ({ page }) => {
  const email = process.env.CLERK_USER_EMAIL as string;
  const password = process.env.CLERK_USER_PASSWORD as string;

  await page.goto("/");
  if (process.env.CI) {
    await ensurePageLoaded(page);
  }

  // Sign in
  await page.getByTestId("header-sign-in-link").click();
  await page.locator("[id=identifier-field]").fill(email);
  await page.locator("[name=password]").fill(password);
  await page.locator("[data-localization-key=formButtonPrimary]").click();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();

  // Sign out
  await page.locator("svg.lucide-user").click();
  await page.getByTestId("sign-out-btn").click();

  // Check assertion by appropriate UI change
  await expect(page.getByText("sign in or register")).toBeVisible();
  await expect(page.getByTestId("header-sign-in-link")).toBeVisible();
});
