import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useSignInUser } from "@/api/authApiClient";
import SignInForm from "@/forms/SignInForm";
import { SignInFormData } from "@/types/userTypes";
import { useAuthenticateUserSession } from "@/hooks/auth";

const SignInPage = () => {
  const { signInUser } = useSignInUser();
  const navigate = useNavigate();
  const { authenticateUserSession } = useAuthenticateUserSession();

  const handleSignIn = (formData: SignInFormData) => {
    signInUser(formData).then((data) => {
      authenticateUserSession(data);
      toast.success("Signed in");
      navigate("/");
    });
  };

  return <SignInForm onSave={handleSignIn} />;
};

export default SignInPage;
