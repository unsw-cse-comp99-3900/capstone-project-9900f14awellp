import React from "react";
import "./InvoiceMainInfo.css";

export function InvoiceMainInfo({ invoiceNum, invoiceName }) {
  return (
    <div className="invoice-info-in-table">
      <div className="invoice-num-in-table">{invoiceNum || "Unknow"}</div>
      <div className="invoice-name-in-table">{invoiceName || "Unknow"}</div>
    </div>
  );
}
