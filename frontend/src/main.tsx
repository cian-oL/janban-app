import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./global.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { IssuesProvider } from "./contexts/IssuesContext.tsx";
import App from "./App.tsx";

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
          <App />
        </IssuesProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>,
);
