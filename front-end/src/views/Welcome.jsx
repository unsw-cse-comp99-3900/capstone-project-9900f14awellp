import React from "react";
import { useNavigate } from "react-router-dom";
import { UserTextField } from "../components/Inputs";

export default function Welcome() {
  //* 路由跳转
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };
  const goRegister = () => {
    navigate("/register");
  };
  return (
    <div>
      <h1>Welcome to the Invoice App</h1>
      <p>
        This is a simple invoice management app that allows you to create, edit,
        and manage invoices.
      </p>
      <button onClick={goLogin}>Login</button>
      <button onClick={goRegister}>Register</button>
      <UserTextField
        id="login-userName"
        label="User Name"
        helperText="Please enter your user name"
        defaultValue="name"
      />
    </div>
  );
}
