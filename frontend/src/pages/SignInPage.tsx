import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { signInUser } from "@/api/authApiClient";
import SignInForm from "@/forms/SignInForm";
import { SignInFormData } from "@/types/userTypes";
import { useAuthenticateUserSession } from "@/hooks/useAuth";

const SignInPage = () => {
  const navigate = useNavigate();
  const { authenticateUserSession } = useAuthenticateUserSession();

  const handleSignIn = (formData: SignInFormData) => {
    signInUser(formData)
      .then((data) => {
        authenticateUserSession(data);
        toast.success("Signed in");
        navigate("/");
      })
      .catch(() => toast.error("Failed to sign in. Please try again"));
  };

  return <SignInForm onSave={handleSignIn} />;
};

export default SignInPage;
