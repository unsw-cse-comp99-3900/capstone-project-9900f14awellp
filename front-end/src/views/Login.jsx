import React from "react";
import { useNavigate } from "react-router-dom";
import { InputTextField, PasswordTextField } from './components/Inputs';

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
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl mb-4">Login Page</h1>
            <InputTextField label="Email" id="Login-Email" defaultValue="Email" />
            <PasswordTextField />
            <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={goRegister}>Don't have an account? Go register</button>
            <button className="mt-4 p-2 bg-green-500 text-white rounded ml-2" onClick={goDashboard}>Finish Login, go to Dashboard</button>
        </div>
    );
}