import React from "react";
import { useInvoice } from "@/Content/GuiContent";
import "./GuiPreview.css";
import { Button } from "antd";
import { FilePdfOutlined, CopyOutlined } from "@ant-design/icons";

export function GuiPreview() {
  const { invoiceData } = useInvoice();
  console.log(invoiceData);
  return (
    <div className="gui-preview">
      <div className="preview-button-row">
        <div className="preview-header">Preview</div>
        <div>
          <Button
            size="large"
            icon={<FilePdfOutlined />}
            className="preview-gui-button"
          >
            Download
          </Button>
          <Button
            size="large"
            type="text"
            icon={<CopyOutlined />}
            className="preview-gui-button"
          >
            Save as Draft
          </Button>
        </div>
      </div>
      <div className="preview-pdf-page">
        <div className="preview-title">
          <div>{invoiceData.invoice_name}</div>
        </div>
      </div>
    </div>
  );
}
