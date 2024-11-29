import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import UserDropDownMenu from "./UserDropDownMenu";
import KanbanNavbar from "./KanbanNavbar";
import ModeToggle from "./ModeToggle";
import { useTheme } from "@/contexts/ThemeProvider";

const Header = () => {
  const { isLoggedIn } = useAuthContext();
  const { theme } = useTheme();

  return (
    <header
      className={`py-10 border-b border-amber-300 text-white ${
        theme === "light" ? "bg-indigo-600" : "bg-indigo-900"
      }`}
    >
      <div className="container flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-amber-300 hover:text-white"
        >
          Janban
        </Link>
        {isLoggedIn && (
          <div className="hidden md:block">
            <KanbanNavbar />
          </div>
        )}
        <div className=" flex justify-between items-center gap-5">
          <ModeToggle />
          {isLoggedIn ? (
            <UserDropDownMenu />
          ) : (
            <Link to="/sign-in">
              <Button className="bg-amber-300 font-bold text-black hover:bg-white">
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
