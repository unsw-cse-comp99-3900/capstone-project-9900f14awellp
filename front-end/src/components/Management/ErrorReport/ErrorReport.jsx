import React, { useState } from "react";
import { Collapse } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { CustomAlert } from "@/components/Alert/MUIAlert";
import { Highlight, TagHighlight } from "./HeroHighlight";

import "./ErrorReport.css";

/**
 * Extracts location information from a given location string
 * @param {string} location - The location string to extract information from
 * @returns {string} Extracted location information or "Unknown location" if not found
 */
function extractLocationInfo(location) {
  const regex = /\*:(\w+)/g;
  const matches = [...location.matchAll(regex)];

  if (matches.length === 0) {
    return "Unknown location";
  }

  const elements = matches.map((match) => match[1]);
  return elements.join(" > ");
}

/**
 * ErrorReport component for displaying error reports
 * @param {Object} props - Component props
 * @param {Object} props.errorReport - The error report object to display
 */
export function ErrorReport({ errorReport }) {
  // State for managing alert visibility and content
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  /**
   * Shows an alert with the given message and severity
   * @param {string} message - The message to display in the alert
   * @param {string} severity - The severity level of the alert (default: "info")
   */
  const showAlert = (message, severity = "info") => {
    setAlert({ show: true, message, severity });
  };

  /**
   * Hides the currently displayed alert
   */
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };

  /**
   * Copies the error information to the clipboard
   * @param {string} location - The location of the error
   * @param {string} text - The error text
   */
  const copyToClipboard = (location, text) => {
    const extractedLocation = extractLocationInfo(location);
    const copyText = `${extractedLocation}: ${text}`;
    navigator.clipboard.writeText(copyText).then(
      () => {
        showAlert("Copy successfully to the clipboard.", "success");
      },
      (err) => {
        showAlert("Copy failed to the clipboard:" + err.message, "error");
      }
    );
  };

  return (
    <div className="error-report-container">
      {/* Display alert if show is true */}
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
      {/* Map through error report entries */}
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
          {/* Collapse component for displaying error details */}
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
                      {/* Display extracted location information */}
                      <TagHighlight
                        defaultLightBg="#FFD4D4"
                        defaultLightText="#992720"
                      >
                        {extractLocationInfo(error.location)
                          ? `${extractLocationInfo(error.location)}`
                          : error.location}
                      </TagHighlight>
                    </div>

                    {/* Display error text with highlighting */}
                    <Highlight
                      startColor="#eca184"
                      endColor="#f8deb1"
                      style={{ marginTop: "10px" }}
                    >
                      {error.text}
                    </Highlight>
                  </div>
                  {/* Copy to clipboard button */}
                  <CopyOutlined
                    size="small"
                    style={{
                      fontSize: "18px",
                      fontWeight: "100",
                      color: "#333",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling to avoid triggering Collapse expand/collapse
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
