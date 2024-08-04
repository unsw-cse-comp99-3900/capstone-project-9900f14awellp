import React from "react";
import { GuiForm } from "@/components/Creation/GUIForm/GuiForm";
import { GuiPreview } from "@/components/Creation/GUIPreview/GuiPreview";

export default function GUI() {
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
