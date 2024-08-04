// src/context/InvoiceContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { CompanyInfo } from "@/apis/gui";

// Create a context for invoice data
const InvoiceContext = createContext();

// Get the authentication token from local storage
const token = localStorage.getItem("token");

/**
 * InvoiceProvider component to manage and provide invoice data context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function InvoiceProvider({ children }) {
  // State to hold invoice data
  const [invoiceData, setInvoiceData] = useState({
    // Flag to indicate if this is data before editing (true if coming from draft table)
    editBefore: false,
    // ID of the draft invoice, used for updating or deleting when finalizing
    draftId: "",
    // NOTE: The above two fields need to be updated when navigating from the draft table
    // NOTE: All fields below should be updated using the GET /invoice-draft API when coming from the draft table
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

  // Fetch company info if user is authenticated
  if (token) {
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
          console.log("Failed to fetch company info:", error);
        }
      };
      fetchCompanyInfo();
    }, []);
  }

  /**
   * Update invoice data
   * @param {Object} newData - New data to update
   */
  const updateInvoiceData = (newData) => {
    setInvoiceData((prevData) => ({ ...prevData, ...newData }));
  };

  /**
   * Clear invoice data, resetting most fields except company info
   */
  const clearInvoiceData = () => {
    setInvoiceData((prevData) => ({
      editBefore: false,
      draftId: "",
      uuid: "",
      invoice_name: "",
      invoice_num: "",
      issue_date: "",
      due_date: "",
      currency: "",
      my_company_name: prevData.my_company_name,
      my_address: prevData.my_address,
      my_ABN: prevData.my_ABN,
      my_email: prevData.my_email,
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
    }));
  };

  // Provide the invoice context to child components
  return (
    <InvoiceContext.Provider
      value={{ invoiceData, updateInvoiceData, clearInvoiceData }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

/**
 * Custom hook to use the invoice context
 * @returns {Object} Invoice context value
 */
export const useInvoice = () => useContext(InvoiceContext);
