import { useMutation } from "react-query";

import { SignInFormData, UserFormData } from "@/types/userTypes";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useRegisterUser = () => {
  const registerUserRequest = async (formData: UserFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return response.json();
  };

  const {
    mutateAsync: registerUser,
    error,
    reset,
  } = useMutation(registerUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to register user");
    reset();
  }

  return { registerUser };
};

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
  const signOutUserRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "json/application",
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
    toast.error("Failed to sign in");
    reset();
  }

  return { signOutUser };
};
