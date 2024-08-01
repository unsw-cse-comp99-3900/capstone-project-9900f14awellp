import React from "react";
import { InvoiceDetailsInfo } from "@/components/Management/InvoiceDetail/InvoiceDetailsInfo";
import { ResponsiveAppBar } from "@/components/Navbar";

import "./global.css";

export default function InvoiceDetails() {
  return (
    <div className="invoice-detail-full-page">
      <div className="container">
        <InvoiceDetailsInfo />
      </div>
    </div>
  );
}
