import { axiosInstance } from "./axiosConfig";
import type { User } from "@/types/userTypes";

export const createUser = async (
  formData: Partial<User>,
  accessToken: string,
): Promise<User> => {
  return axiosInstance
    .post("/api/user/register", formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
  formData: Partial<User>,
  accessToken: string,
): Promise<User> => {
  return axiosInstance
    .patch("/api/user/profile", formData, {
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
