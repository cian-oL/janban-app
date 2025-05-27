import { toast } from "sonner";

import { useGetUser, useUpdateUser } from "@/hooks/useUser";
import UserProfileForm from "@/forms/UserProfileForm";
import LoadingSpinner from "@/components/LoadingSpinner";

import type { User } from "@/types/userTypes";

const UserProfilePage = () => {
  const { data: currentUser, isLoading: isGetLoading } = useGetUser();
  const { mutateAsync: updateUser, isPending: isUpdateLoading } =
    useUpdateUser();

  const handleUpdateUser = (formData: User & { confirmPassword: string }) => {
    updateUser(formData).then(() => {
      toast.success("Profile Updated");
    });
  };

  if (isGetLoading) {
    return <LoadingSpinner />;
  }

  return (
    <UserProfileForm
      currentUser={currentUser}
      isLoading={isUpdateLoading}
      onSave={handleUpdateUser}
    />
  );
};

export default UserProfilePage;
