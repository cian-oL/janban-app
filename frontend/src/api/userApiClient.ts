import { axiosInstance } from "./axiosConfig";
import type { User } from "@/types/userTypes";
import type { AccessTokenResponse } from "@/types/authTypes";

export const createUser = async (
  formData: User & { confirmPassword: string }
): Promise<AccessTokenResponse> => {
  return axiosInstance
    .post("/api/user/register", formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      throw new Error("Error with create user request");
    });
};

export const getAllUsers = async (accessToken: string): Promise<User[]> => {
  return axiosInstance
    .get("/api/user/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      throw new Error("Error with fetching all users");
    });
};

export const getUser = async (accessToken: string): Promise<User> => {
  return axiosInstance
    .get("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      throw new Error("Error with fetching user");
    });
};

export const updateUser = async (
  formData: User & { confirmPassword: string },
  accessToken: string
): Promise<User> => {
  return axiosInstance
    .put("/api/user/profile", formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      throw new Error("Error with updating user");
    });
};
