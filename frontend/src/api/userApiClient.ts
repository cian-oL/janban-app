import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { UserFormData } from "@/types/userTypes";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useRegisterUser = () => {
  const navigate = useNavigate();

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
    isSuccess,
    error,
    reset,
  } = useMutation(registerUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to register user");
    reset();
  }

  if (isSuccess) {
    toast.success("User registered");
    navigate("/");
  }

  return { registerUser };
};
