import { useAuthContext } from "@/contexts/AuthContext";
import { AccessTokenResponse } from "@/types/authTypes";

export const useAuthenticateUserSession = () => {
  const { setAccessToken, setIsLoggedIn } = useAuthContext();

  const authenticateUserSession = (responseData: AccessTokenResponse) => {
    setIsLoggedIn(true);
    setAccessToken(responseData.accessToken);
  };

  const logoutUserSession = () => {
    setIsLoggedIn(false);
    setAccessToken("");
  };

  return {
    authenticateUserSession,
    logoutUserSession,
  };
};
