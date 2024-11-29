import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useRegisterUser } from "@/api/userApiClient";
import { UserFormData } from "@/types/userTypes";
import UserProfileForm from "@/forms/UserProfileForm";
import { useAuthenticateUserSession } from "@/hooks/auth";

const RegisterPage = () => {
  const { registerUser } = useRegisterUser();
  const navigate = useNavigate();
  const { authenticateUserSession } = useAuthenticateUserSession();

  const handleRegisterUser = (formData: UserFormData) => {
    registerUser(formData).then((data) => {
      authenticateUserSession(data);
      toast.success("User registered");
      navigate("/");
    });
  };

  return <UserProfileForm onSave={handleRegisterUser} />;
};

export default RegisterPage;
