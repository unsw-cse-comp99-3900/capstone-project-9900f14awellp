import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { invoiceAdminManage, invoiceBasicInfo } from "@/apis/management";

import "./InvoiceDetailsInfo.css";

const findCurrentInvoice = (data, id) => {
  return data.find((invoice) => invoice.uuid === id);
};

const getPdfUrl = (pdfPath) => {
  return `${import.meta.env.VITE_API_URL}${pdfPath}`;
};

const is_admin = localStorage.getItem("is_admin") === "true";

export function InvoiceDetailsInfo() {
  const curId = useParams().id.slice(3);
  const [originalInvoice, setOriginalInvoice] = useState({});
  useEffect(() => {
    //如果是管理员，调用invoiceAdminManage，否则调用invoiceBasicInfo
    const fetchData = is_admin ? invoiceAdminManage : invoiceBasicInfo;

    fetchData().then((res) => {
      const data = res.data;
      const currentInvoice = findCurrentInvoice(data, curId);
      setOriginalInvoice(currentInvoice);
    });
  }, []);

  const fileUrl = originalInvoice.file;
  const realpath = fileUrl ? getPdfUrl(fileUrl) : null;

  console.log(originalInvoice);
  return (
    <div>
      <div className="info-details-header-row">
        <div className="info-details-header-row-left">
          <div>{originalInvoice.files_name}</div>
        </div>
      </div>
    </div>
  );
}
