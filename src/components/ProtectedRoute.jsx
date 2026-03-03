import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { toast } from "sonner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();


  if (loading) {
    console.log("ProtectedRoute: loading auth state...");
    return null;
  }

  console.log("ProtectedRoute: user=", user, "userData=", userData);

  // Not logged in
  if (!user) {
    toast.error("Please login first!");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check (if allowedRoles is defined)
  if (allowedRoles && (!userData || !allowedRoles.includes(userData.role))) {
    toast.error("Access Denied!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
