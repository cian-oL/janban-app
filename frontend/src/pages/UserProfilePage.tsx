import { useUpdateUser } from "@/hooks/useUser";
import { useAuthContext } from "@/contexts/AuthContext";
import UserProfileForm from "@/forms/UserProfileForm";
import { User } from "@/types/userTypes";
import { toast } from "sonner";

const UserProfilePage = () => {
  const { mutateAsync: updateUser, isPending: isUpdateLoading } =
    useUpdateUser();
  const { user, setUser } = useAuthContext();

  const handleUpdateUser = (formData: User & { confirmPassword: string }) => {
    updateUser(formData).then((user) => {
      setUser(user);
      toast.success("Profile Updated");
    });
  };

  return (
    <UserProfileForm
      currentUser={user}
      isLoading={isUpdateLoading}
      onSave={handleUpdateUser}
    />
  );
};

export default UserProfilePage;
