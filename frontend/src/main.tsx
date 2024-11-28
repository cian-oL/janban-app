import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import AppRoutes from "./AppRoutes.tsx";
import "./global.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { IssuesProvider } from "./contexts/IssueContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <IssuesProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </QueryClientProvider>
      </IssuesProvider>
    </AuthProvider>
  </ThemeProvider>
);
