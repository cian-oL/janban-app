import { useAuthContext } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { accessToken } = useAuthContext();

  return accessToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
