import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useGetUser } from "@/hooks/useUser";
import { signOutUser } from "@/api/authApiClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuthenticateUserSession } from "@/hooks/useAuth";
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
import LoadingSpinner from "./LoadingSpinner";

const UserDropDownMenu = () => {
  const navigate = useNavigate();
  const { data: currentUser, isLoading } = useGetUser();
  const { accessToken } = useAuthContext();
  const { logoutUserSession } = useAuthenticateUserSession();
  const { theme } = useTheme();

  const handleSignOut = () => {
    signOutUser(accessToken).then(() => {
      logoutUserSession();
      toast.success("Signed out");
      navigate("/");
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 bg-amber-300 rounded p-2 text-black font-bold hover:bg-white">
        <User />
        <span>{currentUser?.name}</span>
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
