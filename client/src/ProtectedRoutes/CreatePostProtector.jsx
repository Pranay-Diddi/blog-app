// import React from "react";
import { Navigate, useOutletContext } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useOutletContext();

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
