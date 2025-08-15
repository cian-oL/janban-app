import { clerkSetup } from "@clerk/testing/playwright";

const globalSetup = async () => {
  await clerkSetup();
};

export default globalSetup;
