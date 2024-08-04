import React from "react";
import "./InvoiceMainInfo.css";

/**
 * InvoiceMainInfo Component
 *
 * This component displays the main information of an invoice,
 * specifically the invoice number and invoice name.
 *
 * @param {Object} props - The props object containing:
 * @param {string} [invoiceNum] - The invoice number
 * @param {string} [invoiceName] - The name of the invoice
 *
 * @returns {JSX.Element} A div containing the invoice number and name
 */
export function InvoiceMainInfo({ invoiceNum, invoiceName }) {
  return (
    // Main container for invoice information
    <div className="invoice-info-in-table">
      {/* Display invoice number, fallback to "Unknown" if not provided */}
      <div className="invoice-num-in-table">{invoiceNum || "Unknown"}</div>

      {/* Display invoice name, fallback to "Unknown" if not provided */}
      <div className="invoice-name-in-table">{invoiceName || "Unknown"}</div>
    </div>
  );
}
