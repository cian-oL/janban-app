import { useEffect } from "react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

import { SignInFormData } from "@/types/userTypes";
import { AccessTokenResponse } from "@/types/authTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { axiosInstance } from "./axiosConfig";
import { useAuthenticateUserSession } from "@/hooks/useAuth";

// ===== USER SIGN IN & SIGN OUT =====

export const signInUser = async (
  formData: SignInFormData
): Promise<AccessTokenResponse> => {
  return axiosInstance
    .post("/api/auth/sign-in", formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      throw new Error("Error with sign in user request");
    });
};

export const signOutUser = async (
  accessToken: string
): Promise<AxiosResponse> => {
  return axiosInstance
    .post(
      "/api/auth/sign-out",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    )
    .catch((err) => {
      console.log(err);
      throw new Error("Error with sign out request");
    });
};

// ===== TOKEN MANAGEMENT =====

export const generateAccessTokenFromRefreshToken =
  async (): Promise<AccessTokenResponse> => {
    return await axiosInstance
      .get("/api/auth/access-token", {
        withCredentials: true,
      })
      .then((response) => response.data);
  };

export const useAxiosInstance = () => {
  const { accessToken, setAccessToken } = useAuthContext();
  const { logoutUserSession } = useAuthenticateUserSession();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async (): Promise<void> => {
      return await generateAccessTokenFromRefreshToken()
        .then((data) => setAccessToken(data.accessToken))
        .catch((err) => {
          console.log(err);
          logoutUserSession();
          toast.warning("Signed out due to inactivity");
          navigate("/");
        });
    };

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      (err) => {
        const prevRequest = err?.config;

        if (err?.response?.status === 403 && !prevRequest.sent) {
          refreshAccessToken().then(() => {
            prevRequest.headers.Authorization = `Bearer ${accessToken}`;
            prevRequest.sent = true;
            return axiosInstance(prevRequest);
          });
        }

        return Promise.reject(err);
      }
    );

    return () => axiosInstance.interceptors.response.eject(responseIntercept);
  }, [accessToken, setAccessToken, logoutUserSession, navigate]);

  return axiosInstance;
};
