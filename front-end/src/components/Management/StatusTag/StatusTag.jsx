import React from "react";
import { Tag } from "antd";

// Define background colors for different status tags
const tagColors = {
  Success: "#E7F7EC",
  Rejected: "#FFD4D4",
  Unvalidated: "#FFF5E7",
};

// Define text colors for different status tags
const textColors = {
  Success: "##18601F",
  Rejected: "#941D17",
  Unvalidated: "#7C4706",
};

/**
 * Base style for status tags
 * @param {string} value - The status value (Success, Rejected, or Unvalidated)
 * @returns {Object} The style object for the tag
 */
const baseTagStyle = (value) => ({
  marginRight: 3,
  backgroundColor: tagColors[value],
  color: textColors[value],
  border: "none",
  borderRadius: "10px",
});

/**
 * Style for larger status tags, extending the base style
 * @param {string} value - The status value (Success, Rejected, or Unvalidated)
 * @returns {Object} The style object for the larger tag
 */
const largerTagStyle = (value) => ({
  ...baseTagStyle(value),
  fontSize: "13px",
  fontWeight: "normal",
  padding: "4px 8px",
  cursor: "pointer",
  borderRadius: "15px",
});

/**
 * Renders a status tag component
 * @param {Object} props - The component props
 * @param {string} props.value - The status value (Success, Rejected, or Unvalidated)
 * @param {string} props.label - The text to display in the tag
 * @returns {React.Element} A Tag component with appropriate styling
 */
export function StatusTag({ value, label }) {
  return <Tag style={largerTagStyle(value)}>{label}</Tag>;
}

/**
 * Renders a closable status tag component
 * @param {Object} props - The component props
 * @param {string} props.value - The status value (Success, Rejected, or Unvalidated)
 * @param {string} props.label - The text to display in the tag
 * @param {boolean} props.closable - Whether the tag is closable
 * @param {Function} props.onClose - Callback function when the tag is closed
 * @returns {React.Element} A closable Tag component with appropriate styling
 */
export function StatusClosableTag({ value, label, closable, onClose }) {
  return (
    <Tag closable={closable} onClose={onClose} style={baseTagStyle(value)}>
      {label}
    </Tag>
  );
}
