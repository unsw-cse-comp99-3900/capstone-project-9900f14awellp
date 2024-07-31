import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { invoiceAdminManage, invoiceBasicInfo } from "@/apis/management";

import { Button } from "antd";
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

  // useEffect(() => {
  //   if (window.pdfjsLib) {
  //     window.pdfjsLib.GlobalWorkerOptions.workerSrc = window.pdfjsWorkerSrc;
  //   }
  // }, []);

  // useEffect(() => {
  //   //如果是管理员，调用invoiceAdminManage，否则调用invoiceBasicInfo
  //   const fetchData = is_admin ? invoiceAdminManage : invoiceBasicInfo;

  //   (async () => {
  //     try {
  //       const res = await fetchData();
  //       const data = res.data;
  //       const currentInvoice = findCurrentInvoice(data, curId);
  //       setOriginalInvoice(currentInvoice);

  //       // if (currentInvoice.file) {
  //       //   const pdfUrl = getPdfUrl(currentInvoice.file);
  //       //   await renderPdf(pdfUrl);
  //       // }
  //     } catch (error) {
  //       console.error("Error fetching or rendering PDF:", error);
  //     }
  //   })();
  // }, [curId]);

  // const renderPdf = async (url) => {
  //   try {
  //     if (!window.pdfjsLib) {
  //       console.error("PDF.js library not loaded");
  //       return;
  //     }

  //     console.log("Attempting to load PDF from:", url);
  //     const loadingTask = window.pdfjsLib.getDocument({
  //       url: url,
  //       withCredentials: true,
  //     });
  //     const pdf = await loadingTask.promise;

  //     console.log("PDF loaded successfully, rendering pages...");
  //     const pdfViewer = document.getElementById("pdf-viewer");
  //     pdfViewer.innerHTML = ""; // Clear previous content

  //     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //       const page = await pdf.getPage(pageNum);
  //       const scale = 1.5;
  //       const viewport = page.getViewport({ scale });

  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");
  //       canvas.height = viewport.height;
  //       canvas.width = viewport.width;

  //       const renderContext = {
  //         canvasContext: context,
  //         viewport: viewport,
  //       };
  //       await page.render(renderContext).promise;

  //       pdfViewer.appendChild(canvas);
  //     }
  //     console.log("PDF rendering complete");
  //   } catch (error) {
  //     console.error("Error rendering PDF:", error);
  //     if (error.name === "MissingPDFException") {
  //       console.error("The PDF file might not exist or is inaccessible.");
  //     }
  //   }
  // };
  // console.log(originalInvoice);
  return (
    <div className="info-detail-view">
      <div className="info-details-header-row">
        <div className="info-details-header-row-left">
          <div>{originalInvoice.files_name}</div>
          <div>{originalInvoice.state}</div>
          <div>{originalInvoice.total}</div>
          <div>{originalInvoice.due_date}</div>
        </div>
        <div className="info-details-header-row-right">
          <Button>Send</Button>
          <Button>Delete</Button>
          <Button type="primary">Download</Button>
        </div>
      </div>
      <div id="pdf-viewer" className="pdf-viewer"></div>
    </div>
  );
}
