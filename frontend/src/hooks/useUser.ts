import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
} from "@/api/userApiClient";

import type { User } from "@/types/userTypes";

const USERS_QUERY_KEY = "users";
const USER_QUERY_KEY = "user";

export const useRegisterUser = () => {
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<User>) => {
      const accessToken = await getToken();

      if (!accessToken) {
        throw new Error("No authentication token available");
      }

      return createUser(formData, accessToken);
    },

    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY_KEY] });
      const currentUsers = queryClient.getQueryData<User[]>([USERS_QUERY_KEY]);

      const optimisticUser: User = {
        clerkId: userId!,
        racfid: `temp-${Date.now()}`,
        email: formData.email!,
        name: formData.name || "",
        passwordEnabled: formData.passwordEnabled || false,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      queryClient.setQueryData<User[]>([USERS_QUERY_KEY], (old) => [
        ...(old || []),
        optimisticUser,
      ]);

      return { currentUsers, tempId: optimisticUser.racfid };
    },

    onSuccess: (newUser: User, _, context) => {
      queryClient.setQueryData<User[]>(
        [USERS_QUERY_KEY],
        (old) =>
          old?.map((user) =>
            user.racfid === context?.tempId ? newUser : user,
          ) || [],
      );

      queryClient.setQueryData<User>([USER_QUERY_KEY], newUser);
    },

    onError: (err, _, context) => {
      console.log("Error creating user:", err);
      queryClient.setQueryData([USERS_QUERY_KEY], context?.currentUsers);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

export const useGetAllUsers = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => {
      const accessToken = await getToken();

      if (!accessToken) {
        throw new Error("No authentication token available");
      }

      return getAllUsers(accessToken);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetUser = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      const accessToken = await getToken();

      if (!accessToken) {
        throw new Error("No authentication token available");
      }

      return getUser(accessToken);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (formData: Partial<User>) => {
      const accessToken = await getToken();

      if (!accessToken) {
        throw new Error("No authentication token available");
      }

      return updateUser(formData, accessToken);
    },

    onMutate: async (formData) => {
      const queryId = formData.racfid;

      await queryClient.cancelQueries({ queryKey: [USERS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [USER_QUERY_KEY] });

      const currentUsers = queryClient.getQueryData([USERS_QUERY_KEY]);
      const currentUser = queryClient.getQueryData([USER_QUERY_KEY]);

      queryClient.setQueryData<User[]>(
        [USERS_QUERY_KEY],
        (old) =>
          old?.map((user) =>
            user.racfid === queryId ? { ...user, ...formData } : user,
          ) || [],
      );

      queryClient.setQueryData<User>([USER_QUERY_KEY], (old) =>
        old ? { ...old, ...formData } : old,
      );

      return { currentUsers, currentUser };
    },

    onSuccess: (updatedUser, { racfid }) => {
      queryClient.setQueryData<User[]>(
        [USERS_QUERY_KEY],
        (old) =>
          old?.map((user: User) =>
            user.racfid === racfid ? updatedUser : user,
          ) || [],
      );

      queryClient.setQueryData<User>([USER_QUERY_KEY], updatedUser);
    },

    onError: (err, _, context) => {
      console.log("Error updating user:", err);
      queryClient.setQueryData([USERS_QUERY_KEY], context?.currentUsers);
      queryClient.setQueryData([USER_QUERY_KEY], context?.currentUser);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};
