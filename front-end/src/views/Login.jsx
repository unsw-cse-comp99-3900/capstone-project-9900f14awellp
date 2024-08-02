import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputTextField, PasswordTextField } from "../components/Inputs";
import { ButtonSizes } from "../components/Buttons";
import { UnderlineLink, AlignRight } from "../components/Link";
import { AlertDialogSlide } from "../components/Model";
import axios from "axios";
import OutlinedAlerts from "../components/Alert";
import FormDialog from "../components/Model";
import loading from "../assets/loading.gif";
import { CompanyInfo } from "@/apis/gui";
import { useInvoice } from "@/Content/GuiContent";
import { UserTextField } from "../components/Inputs";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showIcon, setShowIcon] = useState(false);
  const [alert, setAlert] = useState(null); // 初始状态设置为null
  const { updateInvoiceData } = useInvoice();

  const updateCompanyInfo = (companyData) => {
    updateInvoiceData({
      my_company_name: companyData.name,
      my_address: companyData.address,
      my_ABN: companyData.ABN,
      my_email: companyData.email,
    });
  };

  //* 路由跳转
  const navigate = useNavigate();
  const goRegister = () => {
    navigate("/register");
  };
  const goDashboard = () => {
    navigate("/home");
  };
  const handleLogin = () => {
    axios
      .post("http://127.0.0.1:8000/invoice/login/", null, {
        params: {
          username: username,
          password: password,
        }, // Query parameters
        headers: {
          Accept: "application/json", // Setting the Accept header
        },
      })
      .then((response) => {
        console.log(response.data);
        // const token = response.data.token;
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("userid", response.data.userid);
        localStorage.setItem("is_admin", response.data.is_admin);
        // alert(response.data.state);
        setAlert({ severity: "success", message: "Login successfully!" });
        return CompanyInfo();
      })
      .then((companyInfoResponse) => {
        // 处理公司信息
        const companyData = companyInfoResponse.data;
        updateCompanyInfo(companyData);
        goDashboard();
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          setAlert({
            severity: "error",
            message: error.response.data.detail || "Login failed",
          });
          // alert(error.response.data.detail || 'Login failed');
          console.log(username, password);
          console.log(error.response);
        } else {
          // alert(error.message);
          setAlert({ severity: "error", message: error.message });
          console.log(error.message);
        }
      });
  };

  const handleEmailSubmit = ({ email, username }) => {
    console.log("Email submitted:", email);
    console.log("Username submitted:", username);
    setShowIcon(true);
    // 你可以在这里处理 email 值，例如更新状态或调用 API
    axios
      .post(
        "http://127.0.0.1:8000/invoice/password_reset/",
        {
          username: username,
          email: email,
        },
        {
          headers: {
            accept: "application/json", // Setting the Accept header
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setShowIcon(false); // 隐藏等待图标
        setAlert({ severity: "success", message: response.data.message });
      })
      .catch((error) => {
        if (error.response) {
          setAlert({ severity: "error", message: error.response.data.error });
          console.log(username, email);
          console.log(error.response);
        } else {
          setAlert({
            severity: "error",
            message: error.message || "Reset password failed",
          });
          console.log(error.message);
        }
        setShowIcon(false); // 隐藏等待图标
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {alert && (
          <div
            style={{
              position: "fixed",
              top: "11vh",
              right: 10,
              // transform: 'translateX(-50%)',
              width: "30%",
              zIndex: 9999,
            }}
          >
            <OutlinedAlerts
              severity={alert.severity}
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </OutlinedAlerts>
          </div>
        )}
        <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Login</h1>
        <UserTextField
          label="username"
          id="Login-username"
          dataTestId="Login-username"
          defaultValue="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordTextField
          id="Login-password"
          dataTestId="Login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AlignRight>
          <FormDialog onFormSubmit={handleEmailSubmit} />
        </AlignRight>

        <ButtonSizes onClick={handleLogin}>Login</ButtonSizes>
        <UnderlineLink onClick={goRegister} fontsize="10px">
          Don't have an account? Go register
        </UnderlineLink>
        <AlertDialogSlide fontsize="8px" />
        {showIcon && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 9999,
            }}
          >
            <img src={loading} alt="icon" />
          </div>
        )}
      </div>
    </div>
  );
}
