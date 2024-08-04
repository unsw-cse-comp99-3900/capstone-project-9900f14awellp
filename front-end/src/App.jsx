import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { InvoiceProvider } from "@/Content/GuiContent";

const theme = createTheme({
  palette: {
    primary: {
      main: "#333",
    },
  },
  typography: {
    fontFamily: "Lexend Deca", // font family for all text
  },
});

export default function App({ router }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#333",
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <InvoiceProvider>
          <RouterProvider router={router} />
        </InvoiceProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}
