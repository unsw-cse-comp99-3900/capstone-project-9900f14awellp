import React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

// 导入所有需要的组件
import Welcome from "@/views/Welcome";
import Dashboard from "@/views/Dashboard";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Create from "@/views/Creation/Create";
import Upload from "@/views/Creation/Upload";
import GUI from "@/views/Creation/GUI";
import Sending from "@/views/sending";
import { InvoiceManagement } from "@/views/Management/InvoiceManagement";
import InvoiceDetails from "./views/Management/InvoiceDetails";
import Draft from "@/views/Draft";
import Profile from "@/views/Profile";
import Validation from "@/views/Validation";
import NotFound from "@/views/NotFound";
import Choice from "@/views/ChoiceCompany";
import CompanyDetails from "@/views/CompanyDetails";
import UserManage from "@/views/Users/UsersManagement";
import Success from "@/views/Success/Success";
import { RouterAuth } from "@/router/RouterAuth";

import { ResponsiveAppBar } from "./components/Navbar";
import { Box, useTheme } from "@mui/material";

// 定义布局组件
const Layout = () => {
  const theme = useTheme();

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{ ...theme.mixins.toolbar }} />{" "}
      {/* 这会创建一个与 Navbar 高度相同的空白区域 */}
      <Box component="main">
        <Outlet />
      </Box>
    </>
  );
};
// 定义路由配置
export const routes = [
  { path: "/", element: <Welcome /> },
  {
    element: (
      <RouterAuth>
        <Layout />
      </RouterAuth>
    ),
    children: [
      { path: "home", element: <Dashboard /> },
      { path: "success", element: <Success /> },
      {
        path: "create",
        element: <Create />,
        children: [
          { path: "upload", element: <Upload /> },
          { path: "form", element: <GUI /> },
        ],
      },
      { path: "draft", element: <Draft /> },
      {
        path: "manage",
        children: [
          { index: true, element: <InvoiceManagement /> },
          { path: ":id", element: <InvoiceDetails /> },
        ],
      },
      {
        path: "send",
        children: [
          { index: true, element: <Sending /> },
          { path: ":id", element: <Sending /> },
        ],
      },
      {
        path: "validate",
        children: [
          { index: true, element: <Validation /> },
          { path: ":id", element: <Validation /> },
        ],
      },

      { path: "profile", element: <Profile /> },
      { path: "company-details", element: <CompanyDetails /> },
      { path: "employee-management", element: <UserManage /> },
    ],
  },
  { path: "choice", element: <Choice /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "404", element: <NotFound /> },
  { path: "*", element: <Navigate to="/404" /> },
];
// 创建并导出路由器创建函数
export const createAppRouter = () => createBrowserRouter(routes);
