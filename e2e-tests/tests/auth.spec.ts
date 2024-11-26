import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test("should allow user to sign in", async ({ page }) => {
  // get sign in button & expect correct heading
  await page.goto(UI_URL);
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

test("should be able to register sucessfully", async ({ page }) => {
  // generate random user racfid to avoid duplicate registration error
  const testRacfid = `J${Math.floor(
    Math.random() * 99996 + 900002
  ).toString()}`;

  // access the register page from the sign in page
  await page.goto(UI_URL);
  await page.getByRole("button", { name: "Sign In" }).nth(0).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();

  // success on correct completion of form
  await page.locator("[name=racfid]").fill(testRacfid);
  await page.locator("[name=name]").fill("Dorian Nakamoto");
  await page
    .locator("[name=email]")
    .fill(`${Math.floor(Math.random() * 9999)}@email.com`);
  await page.locator("[name=password]").fill("Password?123");
  await page.locator("[name=confirmPassword]").fill("Password?123");
  await page.getByRole("button", { name: "Register" }).click();

  // check assertion by appropriate UI change
  await expect(page.getByText("User registered")).toBeVisible();
  await expect(page.getByText("Get Started on your Tasks!")).toBeVisible();
  await expect(page.getByText("Kanban Menu")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Go to Kanban" })
  ).toBeVisible();
});

test("should allow user to sign out", async ({ page }) => {
  // sign in
  await page.goto(UI_URL);
  await page.getByRole("button", { name: "Sign In" }).nth(0).click();
  await page.locator("[name=racfid]").fill("J900001");
  await page.locator("[name=password]").fill("Password?123");
  await page.getByRole("button", { name: "Sign In" }).nth(1).click();
  await expect(page.getByText("Signed in")).toBeVisible();

  // sign out
  await page.getByText("User Out").click();
  await page.getByRole("button", { name: "Sign Out" }).click();

  // check assertion by appropriate UI change
  await expect(page.getByText("Signed out")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign In" }).nth(0)
  ).toBeVisible();
});
