import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { User } from "@/types/userTypes";
import { AccessTokenResponse } from "@/types/authTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAxiosInstance } from "../api/authApiClient";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
} from "@/api/userApiClient";

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
        racfid: `temp-${Date.now()}`,
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

      queryClient.setQueryData<User>([USER_QUERY_KEY], newUser);
    },

    onError: (err, _, context) => {
      console.log("Error creating user:", err);
      queryClient.setQueryData([USERS_QUERY_KEY], context?.currentUsers);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

export const useGetAllUsers = () => {
  const { accessToken } = useAuthContext();
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => getAllUsers(axiosInstance, accessToken),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetUser = () => {
  const { accessToken } = useAuthContext();
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => getUser(axiosInstance, accessToken),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthContext();
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: async (formData: User & { confirmPassword: string }) =>
      updateUser(formData, axiosInstance, accessToken),

    onMutate: async (formData) => {
      const queryId = formData.racfid;

      await queryClient.cancelQueries({ queryKey: [USERS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [USER_QUERY_KEY] });

      const currentUsers = queryClient.getQueryData([USERS_QUERY_KEY]);
      const currentUser = queryClient.getQueryData([USER_QUERY_KEY]);

      queryClient.setQueryData<User[]>([USERS_QUERY_KEY], (old) => {
        old?.map((user) =>
          user.racfid === queryId ? { ...user, ...formData } : old
        );
      });

      return { currentUsers, currentUser };
    },

    onSuccess: (updatedUser, { racfid }) => {
      queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old) =>
        old?.map(
          (user: User) => (user.racfid === racfid ? updatedUser : user) || []
        )
      );
    },
  });
};
