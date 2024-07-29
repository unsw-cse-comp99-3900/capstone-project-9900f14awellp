import React, { useState } from "react";
import { ResponsiveAppBar } from "../../components/Navbar";
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

  //TODO: 导出excel这里admin和普通user的逻辑不一样，需要修改
  const handleExport = async () => {
    //console.log('Export button clicked');

    try {
      if (tableRef.current) {
        //console.log('tableRef is available');

        const selectedData = tableRef.current.getSelectedData();
        //console.log('Selected data:', selectedData);

        if (selectedData.length === 0) {
          //console.log('No data selected');
          showAlert("Select at least one row to export", "info");
          return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Invoices");

        //console.log('Workbook and worksheet created');

        // 添加表头
        worksheet.addRow([
          "No.",
          "Invoice",
          "Customer",
          "Status",
          "Invoice Date",
          "Payment Due",
          "Price",
        ]);

        // 添加数据
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

        //console.log('Data added to worksheet'); // 调试日志

        // 生成Excel文件并下载
        const buffer = await workbook.xlsx.writeBuffer();
        //console.log('Excel buffer created'); // 调试日志

        // const blob = new Blob([buffer], {
        // 	type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // });
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.style.display = 'none';
        // a.href = url;
        // a.download = 'invoices.xlsx';
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        // document.body.removeChild(a);
        saveAs(new Blob([buffer]), "invoices.xlsx");

        //console.log('File download initiated'); }// 调试日志
        // } else {
        //console.error('tableRef is not available'); // 错误日志
      }
    } catch (error) {
      //console.error('Error in handleExport:', error); // 错误日志
      alert("error in handleExport:", error);
    }
  };

  return (
    <div className="full-page">
      <ResponsiveAppBar />
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
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
          {ifAdmin && <AdminManagementTable />}
          {!ifAdmin && <ManageTable ref={tableRef} />}
        </div>
      </div>
    </div>
  );
}
