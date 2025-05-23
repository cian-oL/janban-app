import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useGetUser } from "@/hooks/useUser";
import { useSignOutUser } from "@/api/authApiClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuthenticateUserSession } from "@/hooks/auth";
import { useTheme } from "@/contexts/ThemeProvider";

import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserDropDownMenu = () => {
  const navigate = useNavigate();
  const { currentUser } = useGetUser();
  const { user, setUser } = useAuthContext();
  const { signOutUser } = useSignOutUser();
  const { logoutUserSession } = useAuthenticateUserSession();
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setUser(currentUser);
  }, [currentUser, setUser]);

  const handleSignOut = () => {
    signOutUser().then(() => {
      logoutUserSession();
      toast.success("Signed out");
      navigate("/");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 bg-amber-300 rounded p-2 text-black font-bold hover:bg-white">
        <User />
        <span>{user?.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`text-white mr-2 ${
          theme === "light" ? "bg-indigo-500" : "bg-indigo-800"
        }`}
      >
        <DropdownMenuLabel className="font-extrabold text-lg underline">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/my-profile">Profile Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/kanban">Kanaban Board</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/backlog">Backlog</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Button
          onClick={handleSignOut}
          className=" w-full bg-amber-300 font-bold text-black hover:bg-white"
        >
          Sign Out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDownMenu;
