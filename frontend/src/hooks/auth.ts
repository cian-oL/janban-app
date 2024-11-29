import { useAuthContext } from "@/contexts/AuthContext";
import { AccessTokenResponse } from "@/types/authTypes";

export const useAuthenticateUserSession = () => {
  const { setAccessToken, setUser, setIsLoggedIn } = useAuthContext();

  const authenticateUserSession = (responseData: AccessTokenResponse) => {
    setIsLoggedIn(true);
    setAccessToken(responseData.accessToken);
    setUser(responseData.user);
  };

  const logoutUserSession = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    setUser(undefined);
  };

  return {
    authenticateUserSession,
    logoutUserSession,
  };
};
