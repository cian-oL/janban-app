import { User } from "lucide-react";
import { Link } from "react-router-dom";

import { useGetUser, useSignOutUser } from "@/api/userApiClient";
import { useAuthContext } from "@/auth/AuthContext";

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
  const { currentUser } = useGetUser();
  const { setAccessToken } = useAuthContext();
  const { signOutUser } = useSignOutUser();

  const handleSignOut = () => {
    signOutUser().then(() => {
      setAccessToken("");
      toast.success("Signed out");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 bg-amber-300 rounded p-2 text-black font-bold hover:bg-white">
        <User />
        {currentUser?.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-indigo-500 text-white mr-2">
        <DropdownMenuLabel className="font-extrabold text-lg underline">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/profile">Profile Settings</Link>
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
