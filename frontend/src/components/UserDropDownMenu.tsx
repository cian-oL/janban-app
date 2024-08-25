import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
  const navigate = useNavigate();
  const { currentUser } = useGetUser();
  const { setAccessToken, user, setUser } = useAuthContext();
  const { signOutUser } = useSignOutUser();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setUser(currentUser);
  }, [currentUser, setUser]);

  const handleSignOut = () => {
    signOutUser().then(() => {
      setAccessToken("");
      setUser(undefined);
      toast.success("Signed out");
      navigate("/");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 bg-amber-300 rounded p-2 text-black font-bold hover:bg-white">
        <User />
        {user?.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-indigo-500 text-white mr-2">
        <DropdownMenuLabel className="font-extrabold text-lg underline">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/my-profile">Profile Settings</Link>
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
