import { useMutation, useQuery } from "react-query";
import { AxiosResponse } from "axios";

import { User, UserFormData } from "@/types/userTypes";
import { AccessTokenResponse } from "@/types/authTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/auth/AuthContext";
import { axiosInstance } from "./axiosConfig";
import { useAxiosInstance } from "./authApiClient";

export const useRegisterUser = () => {
  const registerUserRequest = async (
    formData: UserFormData
  ): Promise<AccessTokenResponse> => {
    return axiosInstance
      .post("/api/user/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to register user");
      });
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
  const axiosInstance = useAxiosInstance();

  const getUserRequest = async (): Promise<User> => {
    return axiosInstance
      .get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
        throw new Error("Failed to get user profile");
      });
  };

  const { data: currentUser, isLoading } = useQuery("getUser", getUserRequest);

  return { currentUser, isLoading };
};

export const useUpdateUser = () => {
  const { accessToken } = useAuthContext();
  const axiosInstance = useAxiosInstance();

  const updateUserRequest = async (
    formData: UserFormData
  ): Promise<AxiosResponse<User>> => {
    return axiosInstance
      .put("/api/user/profile", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to update user profile");
      });
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
