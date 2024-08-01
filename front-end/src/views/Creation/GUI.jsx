// import React from "react";
// import { useEffect, useCallback, useState } from "react";
// import { useLocation, useNavigate, useBlocker } from "react-router-dom";
// import { GuiForm } from "@/components/Creation/GUIForm/GuiForm";
// import { GuiPreview } from "@/components/Creation/GUIPreview/GuiPreview";
// import { useInvoice } from "@/Content/GuiContent";

// import { Modal, Button } from "antd";
// import { ExclamationCircleOutlined } from "@ant-design/icons";

// export default function GUI() {
//   const [isBlocking, setIsBlocking] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { clearInvoiceData } = useInvoice();

//   // 使用 useBlocker 来阻止导航
//   const blocker = useBlocker(isBlocking);

//   const handleBlock = useCallback(() => {
//     if (blocker.state === "blocked") {
//       setShowModal(true);
//       return false;
//     }
//     return true;
//   }, [blocker]);

//   useEffect(() => {
//     handleBlock();
//   }, [blocker, handleBlock]);

//   const handleOk = useCallback(() => {
//     setIsBlocking(false);
//     setShowModal(false);
//     clearInvoiceData();
//     blocker.proceed();
//   }, [blocker]);

//   const handleCancel = useCallback(() => {
//     setShowModal(false);
//     blocker.reset();
//   }, [blocker]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (isBlocking) {
//         event.preventDefault();
//         event.returnValue =
//           "Are you sure you want to leave this page? Unsaved changes may be lost.";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [isBlocking]);

//   // 重置 isBlocking 状态
//   useEffect(() => {
//     setIsBlocking(true);
//   }, [location]);

//   return (
//     <div className="GUIlayout">
//       <div className="GUIform">
//         <GuiForm />
//       </div>
//       <div className="GUIpreview">
//         <GuiPreview />
//       </div>
//       <Modal
//         title="Confirm Leave"
//         open={showModal}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         okText="Leave"
//         cancelText="Stay"
//       >
//         <p>
//           Are you sure you want to leave this page? Unsaved changes may be lost.
//         </p>
//       </Modal>
//     </div>
//   );
// }
import React from "react";
import { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate, useBlocker } from "react-router-dom";
import { GuiForm } from "@/components/Creation/GUIForm/GuiForm";
import { GuiPreview } from "@/components/Creation/GUIPreview/GuiPreview";
import { useInvoice } from "@/Content/GuiContent";

import { Modal } from "antd";

export default function GUI() {
  const [isBlocking, setIsBlocking] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearInvoiceData } = useInvoice();

  // 使用 useBlocker 来阻止导航
  const blocker = useBlocker(isBlocking);

  const handleBlock = useCallback(() => {
    if (isBlocking) {
      setShowModal(true);
      return false;
    }
    return true;
  }, [isBlocking]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      handleBlock();
    }
  }, [blocker, handleBlock]);

  useEffect(() => {
    if (isBlocking && location.pathname !== "/create/form") {
      setShowModal(true);
    }
  }, [location, isBlocking]);

  const handleOk = useCallback(() => {
    setIsBlocking(false);
    setShowModal(false);
    clearInvoiceData();
    blocker.proceed();
  }, [blocker, clearInvoiceData]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    blocker.reset();
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isBlocking) {
        event.preventDefault();
        event.returnValue =
          "Are you sure you want to leave this page? Unsaved changes may be lost.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isBlocking]);

  // 重置 isBlocking 状态
  useEffect(() => {
    setIsBlocking(true);
  }, [location]);

  return (
    <div className="GUIlayout">
      <div className="GUIform">
        <GuiForm setIsBlocking={setIsBlocking} />
      </div>
      <div className="GUIpreview">
        <GuiPreview />
      </div>
      <Modal
        title="Comfirm to Leave?"
        open={showModal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Leave"
        cancelText="Stay"
      >
        <p>
          Are you sure you want to leave this page? Unsaved changes may be lost.
        </p>
      </Modal>
    </div>
  );
}
