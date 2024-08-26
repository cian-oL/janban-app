import { useMutation } from "react-query";

import { SignInFormData } from "@/types/userTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSignInUser = () => {
  const signInUserRequest = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to sign in");
    }

    return response.json();
  };

  const {
    mutateAsync: signInUser,
    error,
    reset,
  } = useMutation(signInUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to sign in");
    reset();
  }

  return { signInUser };
};

export const useSignOutUser = () => {
  const { accessToken } = useAuthContext();

  const signOutUserRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "json/application",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error during sign out");
    }
  };

  const {
    mutateAsync: signOutUser,
    error,
    reset,
  } = useMutation(signOutUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to sign out");
    reset();
  }

  return { signOutUser };
};
