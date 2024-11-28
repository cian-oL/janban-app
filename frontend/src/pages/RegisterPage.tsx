import { useNavigate } from "react-router-dom";

import { useRegisterUser } from "@/api/userApiClient";
import { useAuthContext } from "@/auth/AuthContext";
import { UserFormData } from "@/types/userTypes";
import { toast } from "sonner";
import UserProfileForm from "@/forms/UserProfileForm";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setIsLoggedIn, setUser } = useAuthContext();
  const { registerUser } = useRegisterUser();

  const handleRegisterUser = (formData: UserFormData) => {
    registerUser(formData).then((data) => {
      setIsLoggedIn(true);
      setAccessToken(data.accessToken);
      setUser(data.user);
      toast.success("User registered");
      navigate("/");
    });
  };

  return <UserProfileForm onSave={handleRegisterUser} />;
};

export default RegisterPage;
