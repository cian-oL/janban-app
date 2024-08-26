import { useMutation, useQuery } from "react-query";

import { User, UserFormData } from "@/types/userTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/auth/AuthContext";

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

export const useGetUser = () => {
  const { accessToken } = useAuthContext();

  const getUserRequest = async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user profile");
    }

    return response.json();
  };

  const {
    data: currentUser,
    error,
    isLoading,
  } = useQuery("getUser", getUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Error loading profile");
  }

  return { currentUser, isLoading };
};

export const useUpdateUser = () => {
  const { accessToken } = useAuthContext();

  const updateUserRequest = async (formData: UserFormData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    return response.json();
  };

  const {
    mutateAsync: updateUser,
    error,
    reset,
    isLoading,
  } = useMutation(updateUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Error updating profile");
    reset();
  }

  return { updateUser, isLoading };
};
