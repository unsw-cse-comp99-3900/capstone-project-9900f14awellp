import React from "react";
import { ResponsiveAppBar } from "@/components/Navbar";
import UserTable from "@/components/Users/UserTable/UserTable";

import "./global.css";

export default function UserManage() {
  return (
    <div className="full-page">
      <ResponsiveAppBar />
      <div className="container">
        <UserTable />
      </div>
    </div>
  );
}
