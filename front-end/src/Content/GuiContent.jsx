// src/context/InvoiceContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

import { CompanyInfo } from "@/apis/gui";
const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoiceData, setInvoiceData] = useState({
    //! editBefore用来标识是否是编辑之前的数据，如果从draft表格跳转过来，就是true
    editBefore: false,
    //! draftId用来标识是哪个draft，从draft表格跳转过来的时候更新，
    //! 要在1. 使用patch来部分更新时使用；2. 保存为正式invoice时用来删除相应draft
    dreaftId: "",
    //TODO: 上面这两个字段需要从draft表格跳转过来的时候更新
    //TODO: 下面的所有字段,从draft表格跳转过来的时候, 用get /invoice-draft接口来获取后更新
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

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await CompanyInfo();
        setInvoiceData((prevData) => ({
          ...prevData,
          my_company_name: res.data.name,
          my_address: res.data.address,
          my_ABN: res.data.ABN,
          my_email: res.data.email,
        }));
      } catch (error) {
        console.warning("Failed to fetch company info:", error);
      }
    };
    fetchCompanyInfo();
  }, []);

  const updateInvoiceData = (newData) => {
    setInvoiceData((prevData) => ({ ...prevData, ...newData }));
  };

  const clearInvoiceData = () => {
    setInvoiceData({
      editBefore: false,
      dreaftId: "",
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
