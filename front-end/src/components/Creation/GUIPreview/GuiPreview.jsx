import React from "react";
import { useInvoice } from "@/Content/GuiContent";
import "./GuiPreview.css";

export function GuiPreview() {
  const { invoiceData } = useInvoice();
  return (
    <div className="gui-preview">
      <div>GuiPreview</div>
      <div>Invoice Name:{invoiceData.invoice_name}</div>
      <div>Invoice Number:{invoiceData.invoice_num}</div>
      <div>Invoice Date: {invoiceData.issue_date}</div>
      <div>Pay Due: {invoiceData.due_date}</div>
      <div>Currency:{invoiceData.currency}</div>
      <div>Bill from:</div>
      <div>Company Name:{invoiceData.my_company_name}</div>
      <div>Address:{invoiceData.my_address}</div>
      <div>ABN:{invoiceData.my_ABN}</div>
      <div>Email:{invoiceData.my_email}</div>
      <div>Bill to:</div>
      <div>Company Name:{invoiceData.client_company_name}</div>
      <div>Address:{invoiceData.client_address}</div>
      <div>ABN:{invoiceData.client_ABN}</div>
      <div>Email:{invoiceData.client_email}</div>
      <div>Products:</div>
      <div>Subtotal:{invoiceData.subtotal}</div>
      <div>GST Total:{invoiceData.gst_total}</div>
      <div>Total Amount:{invoiceData.total_amount}</div>
      <div>Bank Name:{invoiceData.bank_name}</div>
      <div>Account Number:{invoiceData.account_num}</div>
      <div>BSB Number:{invoiceData.bsb_num}</div>
      <div>Account Name:{invoiceData.account_name}</div>
      <div>Note:{invoiceData.note}</div>
    </div>
  );
}
