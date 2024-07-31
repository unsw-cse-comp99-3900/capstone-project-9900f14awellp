import React from "react";
import EnhancedTable from "@/components/Table";
import { ResponsiveAppBar } from "../components/Navbar";
export default function Draft() {
    return (
        <div>
            <ResponsiveAppBar />
            <EnhancedTable></EnhancedTable>
        </div>
    );
}