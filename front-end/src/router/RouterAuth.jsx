import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

export function RouterAuth({ children }) {
  const token = getToken();
  if (token) {
    return children ? children : <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}
