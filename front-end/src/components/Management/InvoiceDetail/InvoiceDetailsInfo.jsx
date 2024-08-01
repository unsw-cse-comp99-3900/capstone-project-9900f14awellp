import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { invoiceAdminManage, invoiceBasicInfo } from "@/apis/management";

import { Button } from "antd";
import {
  ApiOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { StatusTag } from "@/components/Management/StatusTag/StatusTag";
import "./InvoiceDetailsInfo.css";

const findCurrentInvoice = (data, id) => {
  return data.find((invoice) => invoice.uuid === id);
};

const getPdfUrl = (pdfPath) => {
  return `${import.meta.env.VITE_API_URL}${pdfPath}`;
};

const is_admin = localStorage.getItem("is_admin") === "true";

// 映射状态
// Status mapping
const statusMapping = {
  Failed: "Rejected",
  unvalidated: "Unvalidated",
  Passed: "Success",
};

export function InvoiceDetailsInfo() {
  const curId = useParams().id.slice(3);
  const [originalInvoice, setOriginalInvoice] = useState({});
  const [realpath, setRealpath] = useState(null);
  useEffect(() => {
    //如果是管理员，调用invoiceAdminManage，否则调用invoiceBasicInfo
    const fetchData = is_admin ? invoiceAdminManage : invoiceBasicInfo;

    fetchData().then((res) => {
      const data = res.data;
      const currentInvoice = findCurrentInvoice(data, curId);
      setOriginalInvoice(currentInvoice);
      setRealpath(getPdfUrl(currentInvoice.file.slice(0, -4) + ".png"));
    });
  }, []);

  const goValidate = () => {};

  const goSend = () => {};

  const deleteInvoice = () => {};

  const downloadInvoice = () => {};

  return (
    <div className="invoice-detail-page">
      <div className="info-details-header-row">
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
            icon={<ApiOutlined style={{ color: "#787B88" }} />}
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
            onClick={deleteInvoice}
          >
            Delete
          </Button>

          <Button
            icon={<CloudDownloadOutlined />}
            size="large"
            type="primary"
            onClick={downloadInvoice}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="info-details-body">
        <div className="invoice-pdf-img-container">
          <img src={realpath} alt="Specific Invoice" style={{ width: "90%" }} />
        </div>
      </div>
    </div>
  );
}
