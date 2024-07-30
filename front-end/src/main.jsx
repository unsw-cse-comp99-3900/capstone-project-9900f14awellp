import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createAppRouter } from "./AppRouter";
import "./index.css";
import "./assets/style/font.less";

const router = createAppRouter();

ReactDOM.createRoot(document.getElementById("root")).render(
  <App router={router} />
);
