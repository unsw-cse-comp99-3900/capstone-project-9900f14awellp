import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { InvoiceProvider } from "@/Content/GuiContent";

import Welcome from "@/views/Welcome";
import Dashboard from "@/views/Dashboard";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Create from "@/views/Creation/Create";
import Upload from "@/views/Creation/Upload";
import GUI from "@/views/Creation/GUI";
import Sending from "@/views/sending";
import InvoiceManagement from "@/views/Management/InvoiceManagement";
import Draft from "@/views/Draft";
import Profile from "@/views/Profile";
import Validation from "@/views/Validation";
import NotFound from "@/views/NotFound";
import Choice from "@/views/ChoiceCompany";
import CompanyDetails from "@/views/CompanyDetails";
import { RouterAuth } from "@/router/RouterAuth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#333",
    },
  },
});

const router = createBrowserRouter([
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
    element: (
      <RouterAuth>
        <InvoiceManagement />
      </RouterAuth>
    ),
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
  { path: "/404", element: <NotFound /> },
  { path: "*", element: <Navigate to="/404" /> },
]);

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#333",
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <InvoiceProvider>
          <RouterProvider router={router} />
        </InvoiceProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}
