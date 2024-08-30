import { useMutation } from "react-query";
import { useEffect } from "react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

import { SignInFormData } from "@/types/userTypes";
import { AccessTokenResponse } from "@/types/authTypes";
import { toast } from "sonner";
import { useAuthContext } from "@/auth/AuthContext";
import { axiosInstance } from "./axiosConfig";

// ===== USER SIGN IN & SIGN OUT =====

export const useSignInUser = () => {
  const signInUserRequest = (
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
      .catch(() => {
        throw new Error("Failed to sign in");
      });
  };

  const {
    mutateAsync: signInUser,
    error,
    reset,
  } = useMutation(signInUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to sign in");
    reset();
  }

  return { signInUser };
};

export const useSignOutUser = () => {
  const { accessToken } = useAuthContext();

  const signOutUserRequest = async (): Promise<AxiosResponse> => {
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
      .catch(() => {
        throw new Error("Failed to sign out");
      });
  };

  const {
    mutateAsync: signOutUser,
    error,
    reset,
  } = useMutation(signOutUserRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to sign out");
    reset();
  }

  return { signOutUser };
};

// ===== TOKEN MANAGEMENT =====

export const useAxiosInstance = () => {
  const { accessToken, setAccessToken, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async (): Promise<void> => {
      return axiosInstance
        .get("/api/auth/access-token", {
          withCredentials: true,
        })
        .then((response) => setAccessToken(response.data.accessToken))
        .catch((err) => {
          console.log(err);
          setAccessToken("");
          setUser(undefined);
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
  }, [accessToken, setAccessToken, setUser, navigate]);

  return axiosInstance;
};
