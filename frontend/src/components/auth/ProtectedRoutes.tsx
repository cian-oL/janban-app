import { useAuthenticateUserSession } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { checkSessionAuth } = useAuthenticateUserSession();

  const isLoggedIn = checkSessionAuth();

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
