import React, { useState } from "react";
import { useInvoice } from "@/Content/GuiContent";
import "./GuiPreview.css";
import { Button } from "antd";
import { FilePdfOutlined, CopyOutlined } from "@ant-design/icons";
import { createDraft } from "@/apis/gui";
import { CustomAlert } from "@/components/Alert/MUIAlert";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export function GuiPreview() {
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
  const { invoiceData } = useInvoice();
  const navigate = useNavigate();

  const handleCreateDraft = async () => {
    try {
      if (invoiceData.uuid === "") {
        const uuid = uuidv4().substring(0, 28);
        invoiceData.uuid = uuid;
      }
      await createDraft(invoiceData);
      showAlert("Draft created successfully!", "success");
      navigate("/draft");
    } catch (error) {
      console.error("Error creating draft:", error);
      showAlert("Error creating draft: " + error.message, "error");
    }
  };

  const renderProductRows = () => {
    return invoiceData.orders.map((order, index) => (
      <div key={order.key} className="preview-product-row">
        <div className="preview-product-description">{order.description}</div>
        <div className="preview-product-quantity">{order.quantity}</div>
        <div className="preview-product-unit-price">${order.unitPrice}</div>
        <div className="preview-product-gst">{order.gst}%</div>
        <div className="preview-product-total-price">${order.totalPrice}</div>
      </div>
    ));
  };

  return (
    <div className="gui-preview">
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
      <div className="preview-button-row">
        <div className="preview-header">Preview</div>
        <div>
          <Button
            size="large"
            icon={<CopyOutlined />}
            className="preview-gui-button"
            onClick={handleCreateDraft}
          >
            Save as Draft
          </Button>
        </div>
      </div>
      <div className="preview-pdf-page">
        <div className="preview-title-container">
          <div className="preview-invoice-name">{invoiceData.invoice_name}</div>
        </div>
        <div className="preview-second-row">
          <div className="bill-from-to-info">
            <div className="preview-second-row-title">Bill to: </div>
            <div className="preview-second-row-content">
              <div>{invoiceData.client_company_name}</div>
              <div>{invoiceData.client_ABN}</div>
              <div>{invoiceData.client_email}</div>
              <div>{invoiceData.client_address}</div>
            </div>
            <div className="preview-second-row-title">Bill from: </div>
            <div className="preview-second-row-content">
              <div>{invoiceData.my_company_name}</div>
              <div>{invoiceData.my_ABN}</div>
              <div>{invoiceData.my_email}</div>
              <div>{invoiceData.my_address}</div>
            </div>
          </div>
          <div className="bill-info">
            <div className="preview-second-row-title">Invoice Subject: </div>
            <div className="preview-second-row-content">
              <div>{invoiceData.invoice_name}</div>
            </div>
            <div className="preview-second-row-title">Invoice Num: </div>
            <div className="preview-second-row-content">
              <div>{invoiceData.invoice_num}</div>
            </div>
            <div className="preview-second-row-title">Issued: </div>
            <div className="preview-second-row-content">
              <div>{invoiceData.issue_date}</div>
            </div>
            <div className="preview-second-row-title">Due Date: </div>
            <div className="preview-second-row-content">
              <div>{invoiceData.due_date}</div>
            </div>
            <div className="preview-second-row-title">Currency: </div>
            <div className="preview-second-row-content">
              <div>{invoiceData.currency}</div>
            </div>
          </div>
        </div>
        <div className="preview-products-row">
          <div className="preview-products-header">
            <div className="header-product">Description</div>
            <div className="header-quantity">QTY</div>
            <div className="header-price">Unit Price</div>
            <div className="header-gst">GST</div>
            <div className="header-total">Amount</div>
          </div>
          {renderProductRows()}
        </div>
        <div className="preview-product-total-settle-pay-details">
          <div className="preview-pay-details-row">
            <div className="preview-settle-title">PAY INTO ACCOUNT</div>
            <div className="preview-pay-details">
              <div className="flex flex-row justify-between gap-2.5">
                <div>Bank:</div>
                <div>{invoiceData.bank_name}</div>
              </div>
              <div className="flex flex-row justify-between gap-2.5">
                <div>BSB:</div>
                <div>{invoiceData.bsb_num}</div>
              </div>
              <div className="flex flex-row justify-between gap-2.5">
                <div>Account Num:</div>
                <div>{invoiceData.account_num}</div>
              </div>
              <div className="flex flex-row justify-between gap-2.5">
                <div>Account Name:</div>
                <div>{invoiceData.account_name}</div>
              </div>
            </div>
          </div>
          <div className="preview-total-settle-row">
            <div className="flex flex-row justify-between w-full">
              <div className="preview-settle-title">SUBTOTAL</div>
              <div className="preview-settle-price">
                ${invoiceData.subtotal}
              </div>
            </div>
            <div className="flex flex-row justify-between w-full">
              <div className="preview-settle-title">GST</div>
              <div className="preview-settle-price">
                ${invoiceData.gst_total}
              </div>
            </div>
            <div className="flex flex-row justify-between w-full">
              <div className="preview-settle-title">TOTAL DUE</div>
              <div className="preview-settle-price">
                ${invoiceData.total_amount}
              </div>
            </div>
          </div>
        </div>
        <div className="preview-note-row">
          <div className="preview-note-title">Note: </div>
          <div className="preview-note-content">{invoiceData.note}</div>
        </div>
      </div>
    </div>
  );
}
