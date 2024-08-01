import { React, useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { submitInvoice } from "@/apis/gui";

import { ResponsiveAppBar } from "@/components/Navbar";
import CardSelector from "@/components/Creation/File2GUIselect/CardSelector";
import ProgressIndicator from "@/components/Creation/CreationProgress/Progress";
import { CustomAlert } from "@/components/Alert/MUIAlert";
import { Modal } from "antd";

import { useInvoice } from "@/Content/GuiContent";

import "./global.css";

function validateInvoiceData(data) {
  const requiredFields = [
    "invoice_name",
    "invoice_num",
    "my_company_name",
    "my_address",
    "my_ABN",
    "my_email",
    "client_company_name",
    "client_address",
    "client_ABN",
    "client_email",
    "bank_name",
    "currency",
    "account_num",
    "bsb_num",
    "account_name",
    "issue_date",
    "due_date",
    "subtotal",
    "gst_total",
    "total_amount",
  ];

  const emptyFields = requiredFields.filter((field) => !data[field]);

  if (emptyFields.length > 0) {
    return {
      isValid: false,
      emptyFields: emptyFields,
    };
  }

  // 检查订单数组
  if (!data.orders || data.orders.length === 0) {
    return {
      isValid: false,
      emptyFields: ["orders"],
    };
  }

  // 检查每个订单项
  const emptyOrderFields = data.orders.flatMap((order, index) => {
    const orderEmptyFields = [
      "description",
      "unitPrice",
      "quantity",
      "gst",
    ].filter((field) => !order[field]);
    return orderEmptyFields.map((field) => `orders[${index}].${field}`);
  });

  if (emptyOrderFields.length > 0) {
    return {
      isValid: false,
      emptyFields: emptyOrderFields,
    };
  }

  return { isValid: true };
}

export default function Create() {
  const { invoiceData, clearInvoiceData, updateInvoiceData } = useInvoice();
  console.log("invoiceData", invoiceData);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardSelector, setShowCardSelector] = useState(true);
  const [showUploadContent, setShowUploadContent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   console.log("Current step changed:", currentStep);
  // }, [currentStep]);

  // useEffect(() => {
  //   console.log("Upload progress changed:", uploadProgress);
  // }, [uploadProgress]);

  const steps = ["Select", "Fill/Upload", "Done"];

  const cards = [
    { icon: "✏️", title: "GUI Form", route: "form" },
    { icon: "📋", title: "File Upload", route: "upload" },
  ];

  //二次封装的alert组件
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });
  //显示alert
  const showAlert = (message, severity = "info") => {
    setAlert({ show: true, message, severity });
  };
  //隐藏alert
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // 根据当前路由的改变显示不同的内容
  useEffect(() => {
    // isUploadRoute返回true或false来判断当前路由是否是'/create/upload'
    const isUploadRoute = location.pathname === "/create/upload";
    setShowUploadContent(isUploadRoute);
    setShowCardSelector(location.pathname === "/create");
    setCurrentStep(location.pathname === "/create" ? 0 : 1);
  }, [location]);

  // 选择卡片，根据选择卡片的index设置selectedCard
  const handleCardSelect = (index) => {
    setSelectedCard(index);
  };

  // 点击Continue按钮，根据selectedCard的值跳转到对应的路由
  const handleContinue = async () => {
    // console.log("handleContinue called. Current step:", currentStep);

    if (currentStep === 0) {
      if (selectedCard !== null) {
        // console.log(
        //   "Moving from step 0 to step 1. Selected card:",
        //   selectedCard
        // );
        setShowCardSelector(false);
        setCurrentStep(1);
        if (cards[selectedCard].route === "form") {
          const newUuid = uuidv4();
          updateInvoiceData({ uuid: newUuid });
        }
        navigate(cards[selectedCard].route);
      }
    } else if (currentStep === 1 && location.pathname === "/create/upload") {
      // console.log("In step 1, upload route");
      // 检查是否有文件被选择
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files.length > 0) {
        // console.log("File selected, starting upload");
        // 开始上传进度动画
        setUploadProgress(0);
        let timer = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress =
              prev >= 100 || uploadComplete ? 100 : prev + 100 / 60;
            //console.log("Upload progress:", newProgress);
            if (newProgress >= 100 || uploadComplete) {
              clearInterval(timer);
            }
            return newProgress;
          });
        }, 1000);

        // 触发文件上传
        window.dispatchEvent(new Event("uploadFile"));
      } else {
        // console.log("No file selected");
        showAlert("submit after selecting a file", "warning");
      }
    } else if (currentStep === 1 && location.pathname === "/create/form") {
      const validationResult = validateInvoiceData(invoiceData);
      if (!validationResult.isValid) {
        const emptyFieldsMessage = validationResult.emptyFields.join(", ");
        showAlert(
          `Please fill in the mandatory fields below: 
          ${emptyFieldsMessage}`,
          "warning"
        );
        return;
      }
      //点击Continue按钮时，如果invoiceData中没有uuid，则生成一个uuid
      if (invoiceData.uuid === "") {
        const newUuid = uuidv4();
        updateInvoiceData({ uuid: newUuid });
      }

      try {
        await submitInvoice(invoiceData);
        showAlert("submit successful", "success");
        setCurrentStep(2); // 移动到下一步
        setTimeout(() => {
          navigate("/home");
          clearInvoiceData();
        }, 2000);
      } catch (error) {
        console.error("提交发票时出错:", error);
        showAlert(error.message, "error");
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      // console.log("Attempting to navigate back to /create");
      if (location.pathname === "/create/form") {
        setShowModal(true);
      } else {
        setShowCardSelector(true);
        setCurrentStep(0);
        navigate("/create");
      }
    }
  };

  const handleModalOk = () => {
    // console.log("Navigating back to /create");
    if (location.pathname === "/create/form") {
      clearInvoiceData();
    }
    setShowCardSelector(true);
    setCurrentStep(0);
    window.history.pushState({}, "", "/create");
    window.dispatchEvent(new CustomEvent("locationchange"));
    setShowModal(false);
    // console.log("Custom navigation event dispatched");
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      // console.log("Location changed event triggered");
      setShowCardSelector(window.location.pathname === "/create");
      setCurrentStep(window.location.pathname === "/create" ? 0 : 1);
    };
    window.addEventListener("locationchange", handleLocationChange);
    return () =>
      window.removeEventListener("locationchange", handleLocationChange);
  }, []);

  return (
    <div className="center">
      <ResponsiveAppBar />
      <Modal
        title="Confirm to Leave?"
        open={showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Leave"
        cancelText="Stay"
      >
        <p>
          Are you sure you want to leave this page? Unsaved changes may be lost.
        </p>
      </Modal>
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
      {showCardSelector && (
        <>
          <div className="head-title-div">
            <div className="title">Create your E-invoice</div>
            <div className="type">select your invoice type</div>
          </div>
          <CardSelector
            cards={cards}
            selectedCard={selectedCard}
            onCardSelect={handleCardSelect}
          />
        </>
      )}

      {!showCardSelector && (
        <Outlet context={{ showAlert, setUploadComplete, setUploadProgress }} />
      )}

      <ProgressIndicator
        steps={steps}
        currentStep={currentStep}
        onContinue={handleContinue}
        onBack={handleBack}
        uploadProgress={uploadProgress}
      />
    </div>
  );
}
