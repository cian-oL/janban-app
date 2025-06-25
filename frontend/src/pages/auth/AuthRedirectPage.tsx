import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

import { transformClerkData } from "@/lib/utils";
import { useRegisterUser } from "@/hooks/useUser";
import LoadingSpinner from "@/components/LoadingSpinner";

const AuthRedirectPage = () => {
  const navigate = useNavigate();
  const { user: clerkUser, isLoaded } = useUser();
  const { mutateAsync: createUser } = useRegisterUser();
  const hasCreatedUser = useRef(false);

  useEffect(() => {
    if (isLoaded && clerkUser && !hasCreatedUser.current) {
      hasCreatedUser.current = true;
      const initialData = transformClerkData(clerkUser);
      createUser(initialData)
        .then(() => navigate("/"))
        .catch(() => {
          navigate("/my-profile?fromAuthRedirect=true");
          toast.error(
            "We couldn't create your profile automatically. Please complete your profile details.",
          );
        });
    }
  }, [isLoaded, clerkUser, createUser, navigate]);

  return <LoadingSpinner />;
};

export default AuthRedirectPage;
