import React, { useContext, useEffect, useState } from "react";

import { generateAccessTokenFromRefreshToken } from "@/api/authApiClient";

type Props = {
  children: React.ReactNode;
};

type AuthContext = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = React.createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleAccessTokenGeneration = async () => {
    try {
      const responseData = await generateAccessTokenFromRefreshToken();

      if (responseData) {
        setAccessToken(responseData.accessToken);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("Session expired", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      handleAccessTokenGeneration();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be inside an AuthProvider");
  }

  return context as AuthContext;
};
