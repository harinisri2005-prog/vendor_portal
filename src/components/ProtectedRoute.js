import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, status } = useAuth();

  if (!token) return <Navigate to="/vendor/login" />;


  return children;
};

export default ProtectedRoute;
