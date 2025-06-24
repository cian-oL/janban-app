import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainNavbar from "@/components/MainNavbar";
import { useAuthContext } from "@/contexts/AuthContext";
import { Outlet, useMatches } from "react-router-dom";

type RouteHandle = {
  layoutVariant?: string;
};

type RouteMatch = {
  handle?: RouteHandle;
};

const Layout = () => {
  const { isLoggedIn } = useAuthContext();
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
        {isLoggedIn && <MainNavbar />}
        <main className={getMainClasses()}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
