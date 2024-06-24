import React from "react";
import { Outlet, useNavigate} from "react-router-dom";

export default function Dashboard() {
    //* 路由跳转
    const navigate = useNavigate();
    const goCreation = () => {
        navigate("creation");
    }
    const goInvoiceManagement = () => {
        navigate("invoice-manage");
    }
    const goUserManagement = () => {
        navigate("user-manage");
    }
    const goProfile = () => {
        navigate("/profile");
    }
    const goDraft = () => {
        navigate("/draft");
    }
    return (
        <div>
            <h1>Dashboard Page</h1>
            <button onClick={goCreation}>Creation</button>
            <button onClick={goInvoiceManagement}>Invoice Management</button>
            <button onClick={goUserManagement}>User Management</button>
            <button onClick={goProfile}>Profile</button>
            <button onClick={goDraft}>Draft</button>
            {/*这里的Outlet是一个占位符，用于显示子路由的内容, creation页面是dashboard页面下的默认页面*/}
            <Outlet />
        </div>
    );
}