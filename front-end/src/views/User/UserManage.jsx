import React from "react";
import { ResponsiveAppBar } from "@/components/Navbar";
import UserTable from "@/components/Users/UserTable/UserTable";

export default function UserManage() {
  return (
    <div>
      <ResponsiveAppBar />
      <UserTable />
    </div>
  );
}
