import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import UserDropDownMenu from "./UserDropDownMenu";
import ModeToggle from "./ModeToggle";
import { useTheme } from "@/contexts/ThemeProvider";

const Header = () => {
  const { isLoggedIn } = useAuthContext();
  const { theme } = useTheme();

  return (
    <header
      className={`border-b-2 border-amber-300 py-10 text-white ${
        theme === "light" ? "bg-indigo-600" : "bg-indigo-900"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-amber-300 hover:text-white"
        >
          Janban
        </Link>
        <div className="flex items-center justify-between gap-5">
          <ModeToggle />
          {isLoggedIn ? (
            <UserDropDownMenu />
          ) : (
            <Link to="/sign-in">
              <Button
                data-testid="header-sign-in-link"
                className="bg-amber-300 font-bold text-black hover:bg-white"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
