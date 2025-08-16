import { Outlet, useMatches } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MainNavbar from "@/components/layout/MainNavbar";

type RouteHandle = {
  layoutVariant?: string;
};

type RouteMatch = {
  handle?: RouteHandle;
};

const Layout = () => {
  const { isSignedIn } = useAuth();
  const matches = useMatches() as RouteMatch[];

  // Get layout variant from route handle if available
  const currentMatch = matches.find(
    (match) => match.handle && "layoutVariant" in match.handle,
  );
  const layoutVariant = currentMatch?.handle?.layoutVariant || "default";

  // Determine main element classes based on the layout variant
  const getMainClasses = () => {
    switch (layoutVariant) {
      case "kanban":
        return "mx-0 w-full flex-1 py-10"; // No padding for main kanban view
      default:
        return "mx-auto w-full flex-1 p-4"; // Default styling
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        {isSignedIn && <MainNavbar />}
        <main className={getMainClasses()}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
