import React, { useState } from "react";
import { ManageTable } from "@/components/Management/Table/ManagementTable";
import { AdminManagementTable } from "@/components/Management/AdminTable/AdminManagementTable";
import { CustomAlert } from "../../components/Alert/MUIAlert";
import "./global.css";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { Button } from "antd";

import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function InvoiceManagement() {
  const ifAdmin = localStorage.getItem("is_admin") === "true";
  const navigate = useNavigate();
  const tableRef = React.useRef(null);
  const goCreation = () => {
    navigate("/create");
  };

  // alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });
  //show alert
  const showAlert = (message, severity = "info") => {
    setAlert({ show: true, message, severity });
  };
  //hide alert
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // export to excel
  const handleExport = async () => {
    try {
      if (tableRef.current) {
        const selectedData = tableRef.current.getSelectedData();

        if (selectedData.length === 0) {
          showAlert("Select at least one row to export", "info");
          return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Invoices");

        worksheet.addRow([
          "No.",
          "Invoice",
          "Customer",
          "Status",
          "Invoice Date",
          "Payment Due",
          "Price",
        ]);
        selectedData.forEach((row) => {
          worksheet.addRow([
            row.invoice_number,
            row.files_name,
            row.supplier,
            row.state,
            row.invoice_date,
            row.due_date,
            row.total,
          ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "invoices.xlsx");
      }
    } catch (error) {
      showAlert(error.message, "error");
    }
  };

  return (
    <div className="full-page">
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
      {ifAdmin && (
        <div className="container">
          <AdminManagementTable />
        </div>
      )}
      {!ifAdmin && (
        <div className="container">
          <div className="title-container">
            <div className="invoice-title">Invoices</div>
            <div className="button-group">
              <Tooltip title="Export as Excel" arrow>
                <Button
                  className="second-button"
                  onClick={() => {
                    handleExport();
                  }}
                >
                  Export
                </Button>
              </Tooltip>
              <Tooltip title="Download PDFs" arrow>
                <Button className="second-button">Download</Button>
              </Tooltip>
              <Tooltip title="Create a new invoice" arrow>
                <Button
                  type="primary"
                  onClick={goCreation}
                  className="primary-button"
                >
                  New Invoice
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="full-table">
            <ManageTable ref={tableRef} />
          </div>
        </div>
      )}
    </div>
  );
}
