import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";

import "./global.css";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { IssuesProvider } from "./contexts/IssuesContext.tsx";
import App from "./App.tsx";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={CLERK_PUBLISHABLE_KEY}
    signInFallbackRedirectUrl={
      import.meta.env.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
    }
    signUpFallbackRedirectUrl={
      import.meta.env.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
    }
    afterSignOutUrl="/"
  >
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <IssuesProvider>
          <App />
        </IssuesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ClerkProvider>,
);
