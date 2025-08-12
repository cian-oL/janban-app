import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";

import { useGetUser } from "@/hooks/useUser";
import { useTheme } from "@/contexts/ThemeProvider";
import { Button } from "./ui/button";
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
  const { data: currentUser, isLoading } = useGetUser();
  const { theme } = useTheme();

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
          <Link to="/kanban">Kanban Board</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/backlog">Backlog</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutButton>
          <Button
            data-testid="sign-out-btn"
            className="w-full bg-amber-300 font-bold text-black hover:bg-white"
          >
            Sign Out
          </Button>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDownMenu;
