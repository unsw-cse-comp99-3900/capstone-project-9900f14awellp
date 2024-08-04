import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";

/**
 * CustomAlert component for displaying temporary alert messages
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display in the alert
 * @param {string} props.severity - The severity level of the alert (e.g., "error", "warning", "info", "success")
 * @param {Function} props.onClose - Callback function to be called when the alert is closed
 * @param {number} [props.duration=3000] - Duration in milliseconds for which the alert should be displayed
 */
export const CustomAlert = ({
  message,
  severity,
  onClose,
  duration = 3000,
}) => {
  // State to control the visibility of the alert
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set up a timer to automatically close the alert after the specified duration
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    // Clean up the timer when the component unmounts or when dependencies change
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // If the alert is not visible, return null (render nothing)
  if (!visible) return null;

  return (
    <Alert
      severity={severity}
      onClose={() => {
        // Handle manual close by user
        setVisible(false);
        onClose();
      }}
      style={{
        position: "fixed", // Fixed position relative to the viewport
        top: "0", // Positioned at the top of the screen
        left: "50%", // Centered horizontally
        transform: "translateX(-50%)", // Adjust for perfect centering
        zIndex: 10000, // Ensure the alert appears on top of other elements
      }}
    >
      {message}
    </Alert>
  );
};
