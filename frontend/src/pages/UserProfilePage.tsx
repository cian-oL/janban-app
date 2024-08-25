import { useGetUser, useUpdateUser } from "@/api/userApiClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import UserProfileForm from "@/forms/UserProfileForm";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();

  if (isGetLoading) {
    return <LoadingSpinner />;
  }

  return (
    <UserProfileForm
      currentUser={currentUser}
      isLoading={isUpdateLoading}
      onSave={updateUser}
    />
  );
};

export default UserProfilePage;
