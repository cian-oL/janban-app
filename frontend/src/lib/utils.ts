import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { User } from "@/types/userTypes";
import { UserResource } from "@clerk/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transformClerkData = (clerkUser: UserResource): Partial<User> => {
  return {
    clerkId: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
    passwordEnabled: clerkUser.passwordEnabled,
  };
};
