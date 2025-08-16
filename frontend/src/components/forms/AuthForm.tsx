import { SignIn, SignUp, ClerkLoading, ClerkLoaded } from "@clerk/clerk-react";

import LoadingSpinner from "@/components/common/LoadingSpinner";

type Props = {
  type: "sign-in" | "register";
};

const AuthForm = ({ type }: Props) => {
  return (
    <div
      data-testid="auth-form-register"
      className="my-6 flex items-center justify-center"
    >
      <ClerkLoading>
        <LoadingSpinner />
      </ClerkLoading>
      <ClerkLoaded>
        {type === "sign-in" ? (
          <SignIn signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL} />
        ) : (
          <SignUp signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL} />
        )}
      </ClerkLoaded>
    </div>
  );
};

export default AuthForm;
