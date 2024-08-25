import { useNavigate } from "react-router-dom";

import { useRegisterUser } from "@/api/userApiClient";
import { useAuthContext } from "@/auth/AuthContext";
import { UserFormData } from "@/types/userTypes";
import { toast } from "sonner";
import RegistrationForm from "@/forms/RegistrationForm";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthContext();
  const { registerUser } = useRegisterUser();

  const handleRegisterUser = (formData: UserFormData) => {
    registerUser(formData).then((data) => {
      setAccessToken(data.accessToken);
      toast.success("User registered");
      navigate("/");
    });
  };

  return <RegistrationForm onSave={handleRegisterUser} />;
};

export default RegisterPage;
