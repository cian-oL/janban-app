import { useState } from "react";
import { useUser, useReverification } from "@clerk/clerk-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PasswordVisibilityButton from "@/components/auth/PasswordVisibilityButton";

interface ClerkError {
  code: string;
  message: string;
  longMessage: string;
  meta: object;
}

const ChangeUserPasswordDialog = () => {
  const { user: clerkUser } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const changeClerkPassword = useReverification(() =>
    clerkUser?.updatePassword({
      currentPassword,
      newPassword,
    }),
  );

  const clearFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordChange = async () => {
    try {
      await changeClerkPassword();
      toast.success("Password changed");
      setIsDialogOpen(false);
      clearFields();
    } catch (err) {
      console.error("Error changing user password:", err);

      if (typeof err === "object" && err !== null) {
        const clerkError = err as ClerkError;
        toast.error(clerkError.message);
      } else {
        // Fallback for future changes to err obj by Clerk
        toast.error("Failed to change password. Please try again");
      }
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) clearFields();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full rounded-lg bg-amber-300 font-bold text-black hover:bg-amber-400 md:w-40">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-indigo-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <p>
              The new password will be changed via{" "}
              <a
                href="https://www.clerk.com"
                target="blank"
                className="text-blue-500 underline"
              >
                Clerk
              </a>
              .
            </p>
            <PasswordVisibilityButton
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
          </DialogDescription>
          <DialogDescription>
            <p>
              If you signed in more than 10 minutes ago, you will also be
              prompted to enter your original password by Clerk when you save
              changes, for extra security.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              name="current-password"
              value={currentPassword}
              type={isPasswordVisible ? "text" : "password"}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              name="new-password"
              value={newPassword}
              type={isPasswordVisible ? "text" : "password"}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              type={isPasswordVisible ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handlePasswordChange}
            disabled={
              newPassword !== confirmPassword || newPassword === currentPassword
            }
            className="my-2 rounded-lg bg-amber-300 font-bold text-black hover:bg-amber-400"
          >
            Save Changes
          </Button>
          <DialogClose asChild>
            <Button
              onClick={clearFields}
              className="my-2 rounded-lg bg-red-500 font-bold text-white hover:bg-red-700"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeUserPasswordDialog;
