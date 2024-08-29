import { useMutation } from "react-query";

import { SignInFormData } from "@/types/userTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/auth/AuthContext";

type accessTokenResponse = {
  accessToken: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ===== USER SIGN IN & SIGN OUT =====

export const useSignInUser = () => {
  const signInUserRequest = async (
    formData: SignInFormData
  ): Promise<accessTokenResponse> => {
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

  const signOutUserRequest = async (): Promise<void> => {
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

// ===== TOKEN MANAGEMENT =====

export const useGenerateAccessToken = () => {
  const generateAccessToken = async (): Promise<accessTokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/access-token`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error refreshing access token");
    }

    return response.json();
  };

  return generateAccessToken;
};
