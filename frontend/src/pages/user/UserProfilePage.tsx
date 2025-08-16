import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { UserResource } from "@clerk/types";

import { useGetUser, useRegisterUser, useUpdateUser } from "@/hooks/useUser";
import UserProfileForm from "@/components/forms/UserProfileForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { User } from "@/types/userTypes";
import { transformClerkData } from "@/lib/utils";

const UserProfilePage = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { data: currentUser, isLoading: isGetLoading } = useGetUser();
  const { mutateAsync: createUser } = useRegisterUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (formData: Partial<User>) => {
    try {
      if (currentUser) {
        await updateUser(formData);
        toast.success("Profile updated");
      } else if (clerkUser) {
        await createUser(formData);
        toast.success("Profile created. Welcome!");
        navigate("/");
      }
    } catch (err) {
      console.error("Error submitting Profile form:", err);
      toast.error("Failed to save profile. Please try again");
    }
  };

  const getFormData = (
    user?: User,
    clerkUser?: UserResource | null,
  ): Partial<User> => {
    if (user) return { ...user };

    if (clerkUser) {
      return transformClerkData(clerkUser);
    }

    // Default empty
    return {
      clerkId: "",
      racfid: "",
      email: "",
      name: "",
      passwordEnabled: false,
    };
  };

  const fromAuthRedirect = searchParams.get("fromAuthRedirect") === "true";
  const mode = fromAuthRedirect && !currentUser ? "create" : "edit";
  const formData = getFormData(currentUser, clerkUser);

  if (isGetLoading || !isClerkLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <UserProfileForm
      mode={mode}
      formData={formData}
      isSubmitting={false}
      onSave={handleSubmit}
    />
  );
};

export default UserProfilePage;
