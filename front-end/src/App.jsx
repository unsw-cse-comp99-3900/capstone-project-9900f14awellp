import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#333", // 设置主色调为 #333
          // 你可以在这里添加更多的主题配置
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route index element={<Welcome></Welcome>} />
          <Route
            path="/home"
            element={
              <RouterAuth>
                <Dashboard />
              </RouterAuth>
            }
          />
          <Route
            path="/create"
            element={
              <RouterAuth>
                <Create />
              </RouterAuth>
            }
          >
            <Route path="upload" element={<Upload />}></Route>
            <Route path="form" element={<GUI />}></Route>
          </Route>
          <Route
            path="/manage"
            element={
              <RouterAuth>
                <InvoiceManagement />
              </RouterAuth>
            }
          ></Route>
          <Route
            path="/send"
            element={
              <RouterAuth>
                <Sending />
              </RouterAuth>
            }
          >
            <Route path=":id" element={<Sending />} />
          </Route>
          <Route
            path="/validate"
            element={
              <RouterAuth>
                <Validation />
              </RouterAuth>
            }
          >
            <Route path=":id" element={<Validation />} />
          </Route>
          <Route path="/login" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
          <Route
            path="/choice"
            element={
              <RouterAuth>
                <Choice />
              </RouterAuth>
            }
          />
          <Route
            path="/draft"
            element={
              <RouterAuth>
                <Draft />
              </RouterAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RouterAuth>
                <Profile />
              </RouterAuth>
            }
          />
          <Route
            path="/company-details"
            element={
              <RouterAuth>
                <CompanyDetails />
              </RouterAuth>
            }
          />
          <Route path="/404" element={<NotFound></NotFound>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
