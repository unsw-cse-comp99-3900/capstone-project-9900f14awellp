import React from "react";
import { useNavigate } from "react-router-dom";


export default function Register() {
    //* 路由跳转
    const navigate = useNavigate();
    const goLogin = () => {
        navigate("/login");
    }
    const goDashboard = () => {
        navigate("/home");
    }

    return (
        <div>
            <h1>Register Page</h1>
            <button onClick={goLogin}>have account, go login</button>
            <button onClick={goDashboard}>finish Register, go Dashboard</button>
        </div>
    );
}