import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { useAuthContext } from "@/auth/AuthContext";
import UserDropDownMenu from "./UserDropDownMenu";
import KanbanNavbar from "./KanbanNavbar";

const Header = () => {
  const { isLoggedIn } = useAuthContext();

  return (
    <header className="py-10 bg-indigo-600 text-white">
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
    </header>
  );
};

export default Header;
