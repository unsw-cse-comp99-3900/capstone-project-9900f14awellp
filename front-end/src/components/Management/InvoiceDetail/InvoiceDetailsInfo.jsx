import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importing API functions
import {
  invoiceAdminManage,
  invoiceBasicInfo,
  getErrorReport,
  invoiceLog,
  invoiceDeletion,
} from "@/apis/management";

import { Button } from "antd";

import { ErrorReport } from "../ErrorReport/ErrorReport";

// Importing icons
import {
  ApiOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  SendOutlined,
} from "@ant-design/icons";
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { StatusTag } from "@/components/Management/StatusTag/StatusTag";
import "./InvoiceDetailsInfo.css";

// Helper function to find the current invoice from the data array
const findCurrentInvoice = (data, id) => {
  return data.find((invoice) => invoice.uuid === id);
};

// Helper function to get the full PDF URL
const getPdfUrl = (pdfPath) => {
  return `${import.meta.env.VITE_API_URL}${pdfPath}`;
};

// Check if the user is an admin
const is_admin = localStorage.getItem("is_admin") === "true";

// Status mapping object
const statusMapping = {
  Failed: "Rejected",
  unvalidated: "Unvalidated",
  Passed: "Success",
};

// Helper function to format date and time
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// Function to fetch error report
const fetchErrorReport = async (uuid) => {
  try {
    const response = await getErrorReport(uuid);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export function InvoiceDetailsInfo() {
  // Get the current invoice ID from URL parameters
  const curId = useParams().id.slice(3);
  const [originalInvoice, setOriginalInvoice] = useState({});
  const [realpath, setRealpath] = useState(null);
  const [errorReport, setErrorReport] = useState(null);
  const [createlog, setCreatelog] = useState("");
  const [validatelog, setValidatelog] = useState("");
  const [sendlog, setSendlog] = useState("");
  const [emailReceiver, setEmailReceiver] = useState("");
  const paramId = useParams().id;
  const navigate = useNavigate();

  // Fetch invoice data on component mount
  useEffect(() => {
    // if the user is not an admin, fetch the basic info of the invoice
    const fetchData = is_admin ? invoiceAdminManage : invoiceBasicInfo;

    fetchData().then((res) => {
      const data = res.data;
      const currentInvoice = findCurrentInvoice(data, curId);
      setOriginalInvoice(currentInvoice);
      setRealpath(getPdfUrl(currentInvoice.file.slice(0, -4) + ".png"));
    });
  }, []);

  // Fetch error report if invoice state is "Failed"
  useEffect(() => {
    const getErrorReportData = async () => {
      if (originalInvoice.uuid === undefined) {
        return;
      }
      if (originalInvoice.state !== "Failed") {
        return;
      }
      const res = await fetchErrorReport(originalInvoice.uuid);
      setErrorReport(res.data.reports);
    };
    getErrorReportData();
  }, [originalInvoice]);

  // Fetch invoice log
  useEffect(() => {
    const fetchInvoiceLog = async () => {
      if (originalInvoice.uuid === undefined) {
        return;
      }
      const data = await invoiceLog(
        originalInvoice.uuid,
        originalInvoice.userid
      );
      setCreatelog(formatDateTime(data.data.create_date));
      if (data.data.validation_date !== null) {
        setValidatelog(formatDateTime(data.data.validation_date));
      }
      if (data.data.send_date !== null) {
        setSendlog(formatDateTime(data.data.send_date));
        setEmailReceiver(data.data.email_receiver);
      }
    };
    fetchInvoiceLog();
  }, [originalInvoice]);

  console.log("errorReport", errorReport);

  // Navigation function for validation page
  const goValidate = () => {
    navigate(`/validate/${paramId}`);
  };

  // Navigation function for send page
  const goSend = () => {
    navigate(`/send/${paramId}`);
  };

  // Function to delete invoice
  const deleteInvoice = (uuid) => {
    invoiceDeletion(uuid);
    navigate("/management");
  };

  // Function to download invoice
  const downloadInvoice = (path) => {
    try {
      const pdfUrl = path;
      console.log(pdfUrl);
      const realUrl = `${import.meta.env.VITE_API_URL}${path}`;

      // Open PDF in a new tab
      window.open(realUrl, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="invoice-detail-page">
      {/* Header section */}
      <div className="info-details-header-row">
        {/* Left side of header */}
        <div className="info-details-header-row-left">
          <div className="invoice-details-header-row">
            <div className="invoice-details-title">
              {originalInvoice.files_name}
            </div>
            <StatusTag
              value={
                statusMapping[originalInvoice.state] || originalInvoice.state
              }
              label={
                statusMapping[originalInvoice.state] || originalInvoice.state
              }
            />
          </div>
          <div className="invoice-details-header-details">
            <div>
              <span className="invoice-details-header-details-total">
                {originalInvoice.total}
              </span>{" "}
              AUD
            </div>
            <div>·</div>
            <div>Due at {originalInvoice.due_date}</div>
          </div>
        </div>
        {/* Right side of header with action buttons */}
        <div className="info-details-header-row-right">
          <Button
            icon={<ApiOutlined style={{ color: "#787B88" }} />}
            size="large"
            style={{ color: "#787B88" }}
            onClick={goValidate}
          >
            Validate
          </Button>

          <Button
            icon={<SendOutlined style={{ color: "#787B88" }} />}
            size="large"
            style={{ color: "#787B88" }}
            onClick={goSend}
          >
            Send
          </Button>

          <Button
            icon={<DeleteOutlined />}
            size="large"
            danger
            onClick={() => deleteInvoice(originalInvoice.uuid)}
          >
            Delete
          </Button>

          <Button
            icon={<CloudDownloadOutlined />}
            size="large"
            type="primary"
            onClick={() => downloadInvoice(originalInvoice.file)}
          >
            Download
          </Button>
        </div>
      </div>
      {/* Body section */}
      <div className="info-details-body">
        {/* Invoice image */}
        <div className="invoice-pdf-img-container">
          <img src={realpath} alt="Specific Invoice" style={{ width: "86%" }} />
        </div>
        {/* Log and error report container */}
        <div className="invoice-log-container">
          {/* Time log section */}
          <div className="invoice-time-log-container">
            <div style={{ fontSize: "24px", marginBottom: "9px" }}>Log</div>
            <div className="invoice-time-log">
              {/* Sent log */}
              {sendlog !== "" && (
                <div className="invoice-time-log-row">
                  <div className="log-icon-container">
                    <SendOutlinedIcon
                      style={{ fontSize: "28px", color: "#419B73" }}
                    />
                  </div>
                  <div className="log-info-container">
                    <div className="log-info-title">
                      Invoice was sent to {emailReceiver}
                    </div>
                    <div className="log-info-details">{sendlog}</div>
                  </div>
                </div>
              )}
              {/* Validated log */}
              {validatelog !== "" && (
                <div className="invoice-time-log-row">
                  <div className="log-icon-container">
                    <PublishedWithChangesOutlinedIcon
                      style={{ fontSize: "28px", color: "#419B73" }}
                    />
                  </div>
                  <div className="log-info-container">
                    <div className="log-info-title">Invoice was validated</div>
                    <div className="log-info-details">{validatelog}</div>
                  </div>
                </div>
              )}
              {/* Created log */}
              <div className="invoice-time-log-row">
                <div className="log-icon-container">
                  <FilePresentOutlinedIcon
                    style={{ fontSize: "28px", color: "#419B73" }}
                  />
                </div>

                <div className="log-info-container">
                  <div className="log-info-title">Invoice was created</div>
                  <div className="log-info-details">{createlog}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Error report section */}
          {originalInvoice.state === "Failed" && (
            <div className="invoice-error-log-containe">
              <div style={{ fontSize: "24px", marginBottom: "9px" }}>
                Error Report
              </div>
              <div>
                {errorReport && typeof errorReport === "object" ? (
                  <ErrorReport errorReport={errorReport} />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
