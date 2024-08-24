import { Link } from "react-router-dom";

import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="py-10 bg-indigo-600 text-white">
      <div className="container flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-amber-300 hover:text-white"
        >
          Janban
        </Link>
        <Button
          onClick={() => console.log("Login clicked")}
          className="bg-amber-300 font-bold text-black hover:bg-white"
        >
          Sign In
        </Button>
      </div>
    </header>
  );
};

export default Header;
