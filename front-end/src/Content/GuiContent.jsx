// src/context/InvoiceContext.js
import React, { createContext, useState, useContext } from "react";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoiceData, setInvoiceData] = useState({
    uuid: "",
    invoice_name: "",
    invoice_num: "",
    issue_date: "",
    due_date: "",
    currency: "",
    my_company_name: "",
    my_address: "",
    my_ABN: "",
    my_email: "",
    client_company_name: "",
    client_address: "",
    client_ABN: "",
    client_email: "",
    bank_name: "",
    account_num: "",
    bsb_num: "",
    account_name: "",
    subtotal: "",
    gst_total: "",
    total_amount: "",
    note: "",
    orders: [],
  });

  const updateInvoiceData = (newData) => {
    setInvoiceData((prevData) => ({ ...prevData, ...newData }));
  };

  const clearInvoiceData = () => {
    setInvoiceData({
      uuid: "",
      invoice_name: "",
      invoice_num: "",
      issue_date: "",
      due_date: "",
      currency: "",
      my_company_name: "",
      my_address: "",
      my_ABN: "",
      my_email: "",
      client_company_name: "",
      client_address: "",
      client_ABN: "",
      client_email: "",
      bank_name: "",
      account_num: "",
      bsb_num: "",
      account_name: "",
      subtotal: "",
      gst_total: "",
      total_amount: "",
      note: "",
      orders: [],
    });
  };

  return (
    <InvoiceContext.Provider
      value={{ invoiceData, updateInvoiceData, clearInvoiceData }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoice = () => useContext(InvoiceContext);
