import React from "react";
import { Navigate } from "react-router-dom";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

export function RouterAuth({ children }) {
  const token = getToken();
  if (token) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}
