import { Navigate } from "react-router-dom";
import authorization from "@/core/Authorization";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("access");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Permission required but not authorized
  if (
    requiredPermission &&
    !authorization.isAuthorized(requiredPermission)
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
