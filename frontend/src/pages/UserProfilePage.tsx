import { useGetUser, useUpdateUser } from "@/api/userApiClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import RegistrationForm from "@/forms/RegistrationForm";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();

  if (isGetLoading) {
    return <LoadingSpinner />;
  }

  return (
    <RegistrationForm
      currentUser={currentUser}
      isLoading={isUpdateLoading}
      onSave={updateUser}
    />
  );
};

export default UserProfilePage;
