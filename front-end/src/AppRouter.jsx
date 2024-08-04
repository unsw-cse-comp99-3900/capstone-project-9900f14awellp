import React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

// Import all required components
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

// Define the Layout component
// This component wraps the main content with a navbar and provides consistent spacing
const Layout = () => {
  const theme = useTheme();

  return (
    <>
      <ResponsiveAppBar />
      {/* This Box creates a blank space with the same height as the Navbar */}
      <Box sx={{ ...theme.mixins.toolbar }} />
      {/* Main content area */}
      <Box component="main">
        <Outlet />
      </Box>
    </>
  );
};

// Define the route configuration
export const routes = [
  // Root route
  { path: "/", element: <Welcome /> },
  // Protected routes wrapped in RouterAuth and Layout components
  {
    element: (
      <RouterAuth>
        <Layout />
      </RouterAuth>
    ),
    children: [
      { path: "home", element: <Dashboard /> },
      { path: "success", element: <Success /> },
      // Nested routes for create functionality
      {
        path: "create",
        element: <Create />,
        children: [
          { path: "upload", element: <Upload /> },
          { path: "form", element: <GUI /> },
        ],
      },
      { path: "draft", element: <Draft /> },
      // Nested routes for invoice management
      {
        path: "manage",
        children: [
          { index: true, element: <InvoiceManagement /> },
          { path: ":id", element: <InvoiceDetails /> },
        ],
      },
      // Nested routes for sending functionality
      {
        path: "send",
        children: [
          { index: true, element: <Sending /> },
          { path: ":id", element: <Sending /> },
        ],
      },
      // Nested routes for validation functionality
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
  // Public routes
  { path: "choice", element: <Choice /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  // 404 route
  { path: "404", element: <NotFound /> },
  // Catch-all route, redirects to 404
  { path: "*", element: <Navigate to="/404" /> },
];

// Create and export the router creation function
// This function uses the routes configuration to create a browser router
export const createAppRouter = () => createBrowserRouter(routes);
