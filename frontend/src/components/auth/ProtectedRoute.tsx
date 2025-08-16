import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

import LoadingSpinner from "@/components/common/LoadingSpinner";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return isSignedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
