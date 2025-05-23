import type { AxiosInstance } from "axios";
import type { User } from "@/types/userTypes";
import type { AccessTokenResponse } from "@/types/authTypes";

export const createUser = async (
  formData: User & { confirmPassword: string },
  axiosInstance: AxiosInstance
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
      throw new Error("Error with create user request");
    });
};
