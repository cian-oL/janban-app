import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useRegisterUser } from "@/hooks/useUser";
import UserProfileForm from "@/forms/UserProfileForm";

import type { User } from "@/types/userTypes";

const RegisterPage = () => {
  const { mutateAsync: registerUser } = useRegisterUser();
  const navigate = useNavigate();

  const handleRegisterUser = (formData: User & { confirmPassword: string }) => {
    registerUser(formData)
      .then((data) => {
        toast.success(`User ${data.user?.racfid} registered`);
        navigate("/");
      })
      .catch(() => toast.error("Failed to register user. Please try again"));
  };

  return <UserProfileForm onSave={handleRegisterUser} />;
};

export default RegisterPage;
