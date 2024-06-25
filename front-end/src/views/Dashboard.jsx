import React from "react";
import { Outlet} from "react-router-dom";
import { ResponsiveAppBar } from "./components/Navbar";
import { VirtualizedList } from "./components/List";

export default function Dashboard() {
    //* 路由跳转
    // const navigate = useNavigate();
    // const goCreation = () => {
    //     navigate("create");
    // }
    // const goInvoiceManagement = () => {
    //     navigate("invoice-manage");
    // }
    // const goUserManagement = () => {
    //     navigate("user-manage");
    // }
    // const goProfile = () => {
    //     navigate("/profile");
    // }
    // const goDraft = () => {
    //     navigate("/draft");
    // }
    return (
        <div>
            <Outlet />
            <ResponsiveAppBar />
            {/* <div className="flex justify-center my-4">
                <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={goCreation}>Creation</button>
                <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={goInvoiceManagement}>Invoice Management</button>
                <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={goUserManagement}>User Management</button>
                <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={goProfile}>Profile</button>
                <button className="mx-2 p-2 bg-blue-500 text-white rounded" onClick={goDraft}>Draft</button>
            </div> */}
            
            <div style={{ flexGrow: 1, overflow: 'auto' }}>
                <VirtualizedList />
            </div>
      
        </div>
    );
}