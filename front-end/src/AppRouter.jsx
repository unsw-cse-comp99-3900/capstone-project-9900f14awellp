import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

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
import UserManage from "./views/User/UserManage";
import { RouterAuth } from "@/router/RouterAuth";
// 定义路由配置
export const routes = [
  { path: "/", element: <Welcome /> },
  {
    path: "/home",
    element: (
      <RouterAuth>
        <Dashboard />
      </RouterAuth>
    ),
  },
  {
    path: "/create",
    element: (
      <RouterAuth>
        <Create />
      </RouterAuth>
    ),
    children: [
      { path: "upload", element: <Upload /> },
      { path: "form", element: <GUI /> },
    ],
  },
  {
    path: "/draft",
    element: (
      <RouterAuth>
        <Draft />
      </RouterAuth>
    ),
  },
  {
    path: "/manage",
    element: <RouterAuth />,
    children: [
      { index: true, element: <InvoiceManagement /> },
      { path: ":id", element: <InvoiceDetails /> },
    ],
  },
  {
    path: "/send",
    element: (
      <RouterAuth>
        <Sending />
      </RouterAuth>
    ),
    children: [{ path: ":id", element: <Sending /> }],
  },
  {
    path: "/validate",
    element: (
      <RouterAuth>
        <Validation />
      </RouterAuth>
    ),
    children: [{ path: ":id", element: <Validation /> }],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/choice",
    element: (
      <RouterAuth>
        <Choice />
      </RouterAuth>
    ),
  },
  {
    path: "/profile",
    element: (
      <RouterAuth>
        <Profile />
      </RouterAuth>
    ),
  },
  {
    path: "/company-details",
    element: (
      <RouterAuth>
        <CompanyDetails />
      </RouterAuth>
    ),
  },
  {
    path: "/employee-management",
    element: (
      <RouterAuth>
        <UserManage />
      </RouterAuth>
    ),
  },
  { path: "/404", element: <NotFound /> },
  { path: "*", element: <Navigate to="/404" /> },
];

// 创建并导出路由器创建函数
export const createAppRouter = () => createBrowserRouter(routes);
