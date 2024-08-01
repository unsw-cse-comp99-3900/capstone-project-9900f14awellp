import React from "react";
import { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GuiForm } from "@/components/Creation/GUIForm/GuiForm";
import { GuiPreview } from "@/components/Creation/GUIPreview/GuiPreview";
import { useInvoice } from "@/Content/GuiContent";

import { Modal } from "antd";

export default function GUI() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearInvoiceData } = useInvoice();

  return (
    <div className="GUIlayout">
      <div className="GUIform">
        <GuiForm />
      </div>
      <div className="GUIpreview">
        <GuiPreview />
      </div>
    </div>
  );
}
