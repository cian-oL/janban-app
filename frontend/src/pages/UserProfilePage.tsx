import { useUpdateUser } from "@/api/userApiClient";
import { useAuthContext } from "@/contexts/AuthContext";
import UserProfileForm from "@/forms/UserProfileForm";
import { UserFormData } from "@/types/userTypes";
import { toast } from "sonner";

const UserProfilePage = () => {
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();
  const { user, setUser } = useAuthContext();

  const handleUpdateUser = (formData: UserFormData) => {
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
