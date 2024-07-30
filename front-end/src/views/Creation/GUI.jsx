import React from "react";
import {
  useEffect,
  useCallback,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  useLocation,
  useNavigate,
  useBlocker,
  useOutletContext,
} from "react-router-dom";
import { GuiForm } from "@/components/Creation/GUIForm/GuiForm";
import { GuiPreview } from "@/components/Creation/GUIPreview/GuiPreview";
import { useInvoice } from "@/Content/GuiContent";

import { Modal } from "antd";

const GUI = forwardRef((props, ref) => {
  const [isBlocking, setIsBlocking] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearInvoiceData } = useInvoice();
  const { setIsBlocking: setIsBlockingFromParent } = useOutletContext();

  // 使用 useBlocker 来阻止导航，只有在表单未提交时才阻塞
  const blocker = useBlocker(isBlocking && !formSubmitted);

  // 当 blocker 状态变为 "blocked" 时，调用 handleBlock
  const handleBlock = useCallback(() => {
    if (isBlocking && !formSubmitted) {
      setShowModal(true);
      return false;
    }
    return true;
  }, [isBlocking, formSubmitted]);

  // 当 blocker 状态变为 "blocked" 时，调用 handleBlock
  useEffect(() => {
    if (blocker.state === "blocked") {
      handleBlock();
    }
  }, [blocker, handleBlock]);

  // 监听路由变化，如果尝试离开且表单未提交，显示确认 Modal
  useEffect(() => {
    if (isBlocking && !formSubmitted && location.pathname !== "/create/form") {
      setShowModal(true);
    }
  }, [location, isBlocking, formSubmitted]);

  // 处理确认离开的回调
  const handleOk = useCallback(() => {
    setIsBlocking(false);
    setIsBlockingFromParent(false);
    setFormSubmitted(true);
    setShowModal(false);
    clearInvoiceData();
    blocker.proceed();
  }, [blocker, clearInvoiceData, setIsBlockingFromParent]);

  // 处理取消离开的回调
  const handleCancel = useCallback(() => {
    setShowModal(false);
    blocker.reset();
  }, [blocker]);

  // 添加 beforeunload 事件监听器，防止意外关闭页面
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isBlocking && !formSubmitted) {
        event.preventDefault();
        event.returnValue =
          "Are you sure you want to leave this page? Unsaved changes may be lost.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isBlocking, formSubmitted]);

  // 重置状态
  useEffect(() => {
    if (location.pathname === "/create/form") {
      setIsBlocking(true);
      setIsBlockingFromParent(true);
      setFormSubmitted(false);
    }
  }, [location, setIsBlockingFromParent]);

  // 创建一个组合函数来更新状态
  const setIsBlockingCombined = useCallback(
    (value) => {
      setIsBlocking(value);
      setIsBlockingFromParent(value);
    },
    [setIsBlockingFromParent]
  );

  // 处理表单提交的函数
  const handleFormSubmit = useCallback(() => {
    return new Promise((resolve) => {
      setFormSubmitted(true);
      setIsBlocking(false);
      setIsBlockingFromParent(false);
      resolve();
    });
  }, [setIsBlockingFromParent]);

  // 当 formSubmitted 状态变化时，更新阻塞状态
  useEffect(() => {
    if (formSubmitted) {
      setIsBlocking(false);
      setIsBlockingFromParent(false);
    }
  }, [formSubmitted, setIsBlockingFromParent]);

  // 将 handleFormSubmit 方法暴露给父组件
  useImperativeHandle(ref, () => ({
    handleFormSubmit,
  }));

  return (
    <div className="GUIlayout">
      <div className="GUIform">
        <GuiForm
          setIsBlocking={setIsBlockingCombined}
          onFormSubmit={handleFormSubmit}
        />
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
});

export default GUI;
