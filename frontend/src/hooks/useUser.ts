import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { User } from "@/types/userTypes";
import { AccessTokenResponse } from "@/types/authTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAxiosInstance } from "../api/authApiClient";
import { createUser } from "@/api/userApiClient";

const USERS_QUERY_KEY = "users";
const USER_QUERY_KEY = "user";

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: async (formData: User & { confirmPassword: string }) =>
      createUser(formData, axiosInstance),

    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY_KEY] });
      const currentUsers = queryClient.getQueryData<User[]>([USERS_QUERY_KEY]);

      const optimisticUser: User = {
        ...formData,
        racfid: "TBC",
      };

      queryClient.setQueryData<User[]>([USERS_QUERY_KEY], (old) => [
        ...(old || []),
        optimisticUser,
      ]);

      return { currentUsers, tempId: optimisticUser.racfid };
    },

    onSuccess: (accessTokenResponse: AccessTokenResponse, _, context) => {
      const newUser = accessTokenResponse.user!;

      queryClient.setQueryData<User[]>(
        [USERS_QUERY_KEY],
        (old) =>
          old?.map((user) =>
            user.racfid === context?.tempId ? newUser : user
          ) || []
      );

      queryClient.setQueryData<User>([USER_QUERY_KEY, newUser.racfid], newUser);
    },

    onError: (err, _, context) => {
      console.log("Error creating user:", err);
      queryClient.setQueryData([USERS_QUERY_KEY], context?.currentUsers);
    },

    onSettled: (_, __, { racfid }) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, racfid] });
    },
  });
};

export const useGetAllUsers = () => {
  const { accessToken } = useAuthContext();
  const axiosInstance = useAxiosInstance();

  const getAllUsers = async (): Promise<User[]> => {
    return axiosInstance
      .get("/api/user/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
        throw new Error("Failed to get all users");
      });
  };

  const {
    data: users,
    error,
    isLoading,
  } = useQuery("getAllUsers", getAllUsers);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to get all user data");
  }

  return { users, isLoading };
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

  const updateUserRequest = async (formData: UserFormData): Promise<User> => {
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
