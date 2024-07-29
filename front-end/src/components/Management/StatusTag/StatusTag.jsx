import React from "react";
import { Tag } from "antd";

const tagColors = {
  Success: "#E7F7EC",
  Rejected: "#FFD4D4",
  Unvalidated: "#FFF5E7",
};

const textColors = {
  Success: "##18601F",
  Rejected: "#941D17",
  Unvalidated: "#7C4706",
};

const baseTagStyle = (value) => ({
  marginRight: 3,
  backgroundColor: tagColors[value],
  color: textColors[value],
  border: "none",
  borderRadius: "10px",
});

const largerTagStyle = (value) => ({
  ...baseTagStyle(value),
  fontSize: "13px",
  fontWeight: "normal",
  padding: "4px 8px",
  cursor: "pointer",
  borderRadius: "15px",
});

export function StatusTag({ value, label }) {
  return <Tag style={largerTagStyle(value)}>{label}</Tag>;
}

export function StatusClosableTag({ value, label, closable, onClose }) {
  return (
    <Tag closable={closable} onClose={onClose} style={baseTagStyle(value)}>
      {label}
    </Tag>
  );
}
