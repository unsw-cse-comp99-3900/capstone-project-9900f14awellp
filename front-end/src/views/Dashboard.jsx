import React from "react";
import { Outlet} from "react-router-dom";
import { ResponsiveAppBar } from "../components/Navbar";

export default function Dashboard() {
    //* 路由跳转
    return (
        <div>
            <ResponsiveAppBar />
            {/* <div style={{ flexGrow: 1, overflow: 'auto' }}>
                <VirtualizedList />
            </div>*/}
            <Outlet />
        </div>
    );
}