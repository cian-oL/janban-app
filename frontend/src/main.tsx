import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRoutes from "./AppRoutes.tsx";
import "./global.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { IssuesProvider } from "./contexts/IssuesContext.tsx";

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
      <QueryClientProvider client={queryClient}>
        <IssuesProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </IssuesProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>,
);
