import React, { useState } from "react";
import { Collapse } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { CustomAlert } from "@/components/Alert/MUIAlert";
import { Highlight, TagHighlight } from "./HeroHighlight";

import "./ErrorReport.css";
import { color } from "framer-motion";

function extractLocationInfo(location) {
  const regex = /\*:(\w+)/g;
  const matches = [...location.matchAll(regex)];

  if (matches.length === 0) {
    return "Unknown location";
  }

  const elements = matches.map((match) => match[1]);
  return elements.join(" > ");
}

export function ErrorReport({ errorReport }) {
  //*二次封装的alert组件
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  //*显示alert
  const showAlert = (message, severity = "info") => {
    setAlert({ show: true, message, severity });
  };

  //*隐藏alert
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };
  const copyToClipboard = (location, text) => {
    const extractedLocation = extractLocationInfo(location);
    const copyText = `${extractedLocation}: ${text}`;
    navigator.clipboard.writeText(copyText).then(
      () => {
        showAlert("Copy successfully to the clipboard.", "success");
      },
      (err) => {
        console.log("无法复制文本: ", err);
      }
    );
  };
  return (
    <div className="error-report-container">
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
      {Object.entries(errorReport).map(([key, value]) => (
        <div key={key} className="error-report-section">
          <h3
            style={{
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "300",
            }}
          >
            Rules: {value.rules}
          </h3>
          <Collapse
            style={{
              fontFamily: "Lexend Deca",
              fontWeight: "250",
              fontSize: "16px",
            }}
            expandIconPosition="right"
            accordion
            ghost
            bordered={false}
            items={value.firedAssertionErrors.map((error, index) => ({
              key: index.toString(),
              label: `${error.id}`,
              children: (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4%",
                    alignItems: "start",
                    // backgroundColor: "white",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "88%",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <div>
                      <TagHighlight
                        defaultLightBg="#FFD4D4"
                        defaultLightText="#992720"
                      >
                        {extractLocationInfo(error.location)
                          ? `${extractLocationInfo(error.location)}`
                          : error.location}
                      </TagHighlight>
                    </div>

                    <Highlight
                      startColor="#eca184"
                      endColor="#f8deb1"
                      style={{ marginTop: "10px" }}
                    >
                      {error.text}
                    </Highlight>
                  </div>
                  <CopyOutlined
                    size="small"
                    style={{
                      fontSize: "18px",
                      fontWeight: "100",
                      color: "#333",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡，防止触发 Collapse 的展开/收起
                      copyToClipboard(error.location, error.text);
                    }}
                  />
                </div>
              ),
            }))}
          />
        </div>
      ))}
    </div>
  );
}
