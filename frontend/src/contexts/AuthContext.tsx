import React, { useContext, useEffect, useState } from "react";

import { User } from "@/types/userTypes";
import { generateAccessTokenFromRefreshToken } from "@/api/authApiClient";

type Props = {
  children: React.ReactNode;
};

type AuthContext = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = React.createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleAccessTokenGeneration = async () => {
    const responseData = await generateAccessTokenFromRefreshToken();
    setAccessToken(responseData.accessToken);
  };

  useEffect(() => {
    if (!accessToken) {
      handleAccessTokenGeneration();
    }
  });

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
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
