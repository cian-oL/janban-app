import { clerkMiddleware } from "@clerk/express";

const parties = process.env.CLERK_AUTHORIZED_PARTIES
  ? process.env.CLERK_AUTHORIZED_PARTIES.split(",").map((party) => party.trim())
  : [];

export const clerkAuth = clerkMiddleware({ authorizedParties: parties });
