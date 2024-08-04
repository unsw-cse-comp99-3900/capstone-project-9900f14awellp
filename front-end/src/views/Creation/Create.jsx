import { React, useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { submitInvoice } from "@/apis/gui";

import { ResponsiveAppBar } from "@/components/Navbar";
import CardSelector from "@/components/Creation/File2GUIselect/CardSelector";
import ProgressIndicator from "@/components/Creation/CreationProgress/Progress";
import { CustomAlert } from "@/components/Alert/MUIAlert";
import { Modal } from "antd";
import SparklesText from "@/components/SparklesText";

import { useInvoice } from "@/Content/GuiContent";

import "./global.css";

/**
 * Validates the invoice data to ensure all required fields are filled
 * @param {Object} data - The invoice data to validate
 * @returns {Object} An object with isValid flag and array of empty fields if any
 */
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
  // Filter out empty fields
  const emptyFields = requiredFields.filter((field) => !data[field]);

  if (emptyFields.length > 0) {
    return {
      isValid: false,
      emptyFields: emptyFields,
    };
  }

  // Check each order item for required fields
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

/**
 * Main component for creating an invoice
 */
export default function Create() {
  const { invoiceData, clearInvoiceData, updateInvoiceData } = useInvoice();
  // State variables
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardSelector, setShowCardSelector] = useState(true);
  const [showUploadContent, setShowUploadContent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  // Define steps for the progress indicator
  const steps = ["Select", "Fill/Upload", "Done"];
  // Define card options for selection
  const cards = [
    { icon: "✏️", title: "GUI Form", route: "form" },
    { icon: "📋", title: "File Upload", route: "upload" },
  ];

  // Alert state and functions
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });
  //show alert
  const showAlert = (message, severity = "info") => {
    setAlert({ show: true, message, severity });
  };
  //hide alert
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // Effect to update UI based on current route
  useEffect(() => {
    // isUploadRoute返回true或false来判断当前路由是否是'/create/upload'
    const isUploadRoute = location.pathname === "/create/upload";
    setShowUploadContent(isUploadRoute);
    setShowCardSelector(location.pathname === "/create");
    setCurrentStep(location.pathname === "/create" ? 0 : 1);
  }, [location]);

  // Handle card selection
  const handleCardSelect = (index) => {
    setSelectedCard(index);
  };

  // Handle continue button click
  const handleContinue = async () => {
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
        // Start upload progress animation
        setUploadProgress(0);
        let timer = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress =
              prev >= 100 || uploadComplete ? 100 : prev + 100 / 60;
            if (newProgress >= 100 || uploadComplete) {
              clearInterval(timer);
            }
            return newProgress;
          });
        }, 1000);

        // Trigger file upload
        window.dispatchEvent(new Event("uploadFile"));
      } else {
        showAlert("submit after selecting a file", "warning");
      }
    } else if (currentStep === 1 && location.pathname === "/create/form") {
      // Validate invoice data
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
      // Generate UUID if not present
      if (invoiceData.uuid === "") {
        const newUuid = uuidv4();
        updateInvoiceData({ uuid: newUuid });
      }

      // Submit invoice
      try {
        await submitInvoice(invoiceData);
        showAlert("submit successful", "success");
        setCurrentStep(2); // 移动到下一步
        setTimeout(() => {
          clearInvoiceData();
          navigate("/success");
        }, 2000);
      } catch (error) {
        showAlert(error.message, "error");
      }
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (currentStep === 1) {
      if (location.pathname === "/create/form") {
        setShowModal(true);
      } else {
        setShowCardSelector(true);
        setCurrentStep(0);
        navigate("/create");
      }
    }
  };

  // Handle modal OK button click
  const handleModalOk = () => {
    if (location.pathname === "/create/form") {
      clearInvoiceData();
    }
    setShowCardSelector(true);
    setCurrentStep(0);
    window.history.pushState({}, "", "/create");
    window.dispatchEvent(new CustomEvent("locationchange"));
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setShowCardSelector(window.location.pathname === "/create");
      setCurrentStep(window.location.pathname === "/create" ? 0 : 1);
    };
    window.addEventListener("locationchange", handleLocationChange);
    return () =>
      window.removeEventListener("locationchange", handleLocationChange);
  }, []);

  return (
    <div className="center">
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
            {/* <div className="create-invoice-title">Create your E-invoice</div> */}
            <SparklesText
              text="Create your E-invoice"
              className="create-invoice-title"
            />
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
