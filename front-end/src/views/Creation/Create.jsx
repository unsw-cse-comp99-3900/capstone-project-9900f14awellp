import { React, useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import { ResponsiveAppBar } from "../../components/Navbar";
import CardSelector from "../../components/Creation/File2GUIselect/CardSelector";
import ProgressIndicator from "../../components/Creation/CreationProgress/Progress";
import { CustomAlert } from "../../components/Alert/MUIAlert";

import "./global.css";

export default function Create() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardSelector, setShowCardSelector] = useState(true);
  // eslint-disable-next-line
  const [showUploadContent, setShowUploadContent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = ["Select", "Fill/Upload", "Done"];
  const currentStep = !showCardSelector ? 1 : 0;

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
  }, [location]);

  // 选择卡片，根据选择卡片的index设置selectedCard
  const handleCardSelect = (index) => {
    setSelectedCard(index);
  };

  // 点击Continue按钮，根据selectedCard的值跳转到对应的路由
  const handleContinue = () => {
    if (currentStep === 0) {
      if (selectedCard !== null) {
        setShowCardSelector(false);
        navigate(cards[selectedCard].route);
      }
    } else if (currentStep === 1) {
      if (location.pathname === "/create/upload") {
        // 触发文件上传
        window.dispatchEvent(new Event("uploadFile"));
      }
    }
  };

  // 点击Back按钮，如果是第一步，跳转到create页面，否则返回上一步
  const handleBack = () => {
    if (currentStep === 1) {
      setShowCardSelector(true);
      navigate("/create");
    }
  };

  return (
    <div className="center">
      <ResponsiveAppBar />
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

      {!showCardSelector && <Outlet context={{ showAlert }} />}

      <ProgressIndicator
        steps={steps}
        currentStep={currentStep}
        onContinue={handleContinue}
        onBack={handleBack}
      />
    </div>
  );
}
