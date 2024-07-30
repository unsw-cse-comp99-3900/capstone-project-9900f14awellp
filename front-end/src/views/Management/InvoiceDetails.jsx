import React from "react";
import { InvoiceDetailsInfo } from "@/components/Management/InvoiceDetail/InvoiceDetailsInfo";
import { ResponsiveAppBar } from "@/components/Navbar";

export default function InvoiceDetails() {
  return (
    <div className="full-page">
      <ResponsiveAppBar />
      <InvoiceDetailsInfo />
    </div>
  );
}
