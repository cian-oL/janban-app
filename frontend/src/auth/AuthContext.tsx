import { User } from "@/types/userTypes";
import React, { useContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type AuthContext = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const AuthContext = React.createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
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
