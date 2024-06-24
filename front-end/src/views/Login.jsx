import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    //* 路由跳转
    const navigate = useNavigate();
    const goRegister = () => {
        navigate("/register");
    }
    const goDashboard = () => {
        navigate("/home");
    }
    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={goRegister}>dont have account, go register</button>
            <button onClick={goDashboard}>finish Login, go Dashboard</button>
        </div>
    );
}