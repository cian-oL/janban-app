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
      <DropdownMenuTrigger className="flex gap-2 rounded bg-amber-300 p-2 font-bold text-black hover:bg-white">
        <User />
        <span>{currentUser?.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`mr-2 text-white ${
          theme === "light" ? "bg-indigo-500" : "bg-indigo-800"
        }`}
      >
        <DropdownMenuLabel className="text-lg font-extrabold underline">
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
          data-testid="sign-out-btn"
          onClick={handleSignOut}
          className="w-full bg-amber-300 font-bold text-black hover:bg-white"
        >
          Sign Out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDownMenu;
