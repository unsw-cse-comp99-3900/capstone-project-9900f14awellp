import React, { useState } from "react";
import "./GuiForm.css";
import { GuiTable } from "../GUITable/GuiTable";
import { useInvoice } from "@/Content/GuiContent";

import { Input, DatePicker, Select, InputNumber, Form } from "antd";
import dayjs from "dayjs";
import { FlagIcon } from "react-flag-kit";

const { TextArea } = Input;

/**
 * CustomFormItem is a wrapper component for Form.Item that adds custom styling and error handling.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the Form.Item.
 * @param {string} [props.help] - The help message to be displayed. If present, it indicates an error state.
 *
 * @returns {JSX.Element} A Form.Item component with custom styling and error handling.
 */
const CustomFormItem = ({ children, ...props }) => {
  const { help, validateStatus } = props;
  return (
    <Form.Item
      {...props}
      className={`custom-form-item ${help ? "has-error" : ""} ${validateStatus === "error" ? "custom-error" : ""}`}
    >
      {children}
    </Form.Item>
  );
};

// Currency options for the select dropdown
const options = [
  {
    value: "AUD",
    label: (
      <div className="currency-container">
        <FlagIcon code="AU" size={24} />
        <div className="currency-texts">
          <div className="currency-bond">AUD</div>
          <div>- Australian Dollar</div>
        </div>
      </div>
    ),
  },
];

export function GuiForm() {
  // Custom hook to manage invoice data
  const { invoiceData, updateInvoiceData, clearInvoiceData } = useInvoice();

  // Generic handler for input changes
  const handleInputChange = (field, value) => {
    updateInvoiceData({ [field]: value });
  };

  // State for validation errors
  const [myEmailError, setMyEmailError] = useState("");
  const [clientEmailError, setClientEmailError] = useState("");
  const [myABNError, setMyABNError] = useState("");
  const [clientABNError, setClientABNError] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // ABN validation function
  const validateABN = (abn) => {
    // Allow 0 to multiple spaces between digits, total 11 digits
    const re = /^\d(?:\s*\d){10}$/;

    // Remove all spaces
    const cleanedAbn = abn.replace(/\s+/g, "");

    // Check if format is correct and cleaned ABN length is 11
    if (!re.test(abn) || cleanedAbn.length !== 11) {
      return false;
    } else {
      return true;
    }
  };

  // ABN validation algorithm
  //   const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  //   let sum = 0;

  //   for (let i = 0; i < 11; i++) {
  //     sum += (parseInt(cleanedAbn[i]) - (i === 0 ? 1 : 0)) * weights[i];
  //   }

  //   return sum % 89 === 0;
  // };

  // Handle email validation on blur
  const handleEmailBlur = (field, value, setError) => {
    if (!validateEmail(value)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  };

  // Handle ABN validation on blur
  const handleABNBlur = (field, value, setError) => {
    if (!validateABN(value)) {
      setError("Please enter a valid ABN");
    } else {
      setError("");
    }
  };

  return (
    <div className="form-container">
      {/* Invoice Details Section */}
      <div className="details-container">
        <div className="details-title">Invoice Details</div>
        <div className="inputs-group">
          {/* Subject Input */}
          <div className="title-and-input">
            <div>Subject*</div>
            <Input
              size="large"
              placeholder="Subject"
              value={invoiceData.invoice_name}
              onChange={(e) =>
                handleInputChange("invoice_name", e.target.value)
              }
            />
          </div>
          {/* Invoice Number Input */}
          <div className="title-and-input">
            <div>Invoice Number*</div>
            <Input
              size="large"
              placeholder="Invoice Number"
              value={invoiceData.invoice_num}
              onChange={(e) => handleInputChange("invoice_num", e.target.value)}
            />
          </div>
          {/* Date Pickers */}
          <div className="title-and-input">
            <div>Dates*</div>
            <div className="datepicker-groups">
              <DatePicker
                size="large"
                placeholder="Invoice Date"
                className="create-datepicker"
                onChange={(date, dateString) =>
                  updateInvoiceData({ issue_date: dateString })
                }
                value={
                  invoiceData.issue_date ? dayjs(invoiceData.issue_date) : null
                }
              />
              <DatePicker
                size="large"
                placeholder="Due Date"
                className="create-datepicker"
                onChange={(date, dateString) =>
                  updateInvoiceData({ due_date: dateString })
                }
                value={
                  invoiceData.due_date ? dayjs(invoiceData.due_date) : null
                }
              />
            </div>
          </div>
          {/* Currency Select */}
          <div className="title-and-input">
            <div>Currency*</div>
            <Select
              size="large"
              placeholder="Currency"
              options={options}
              optionLabelProp="label"
              className="currency-select"
              onChange={(value) => {
                updateInvoiceData({ currency: value });
              }}
              value={invoiceData.currency || undefined}
            />
          </div>
        </div>
      </div>

      {/* My Details Section */}
      <div className="details-container">
        <div className="title-row">
          <div className="details-title">My Details</div>
        </div>
        <div className="inputs-group">
          {/* Company Name Input */}
          <div className="title-and-input">
            <div>Company Name*</div>
            <Input
              size="large"
              placeholder="Company Name"
              value={invoiceData.my_company_name}
              onChange={(e) =>
                handleInputChange("my_company_name", e.target.value)
              }
            />
          </div>
          {/* Address Input */}
          <div className="title-and-input">
            <div>Address*</div>
            <Input
              size="large"
              placeholder="Address"
              value={invoiceData.my_address}
              onChange={(e) => handleInputChange("my_address", e.target.value)}
            />
          </div>
          {/* ABN Input with validation */}
          <div className="title-and-input">
            <div>ABN*</div>
            <CustomFormItem
              validateStatus={myABNError ? "error" : ""}
              help={myABNError}
            >
              <Input
                size="large"
                placeholder="ABN"
                value={invoiceData.my_ABN}
                onChange={(e) => handleInputChange("my_ABN", e.target.value)}
                onBlur={(e) =>
                  handleABNBlur("my_ABN", e.target.value, setMyABNError)
                }
              />
            </CustomFormItem>
          </div>
          {/* Email Input with validation */}
          <div className="title-and-input">
            <div>Email*</div>
            <CustomFormItem
              validateStatus={myEmailError ? "error" : ""}
              help={myEmailError}
            >
              <Input
                size="large"
                placeholder="Email Address"
                value={invoiceData.my_email}
                onChange={(e) => handleInputChange("my_email", e.target.value)}
                onBlur={(e) =>
                  handleEmailBlur("my_email", e.target.value, setMyEmailError)
                }
              />
            </CustomFormItem>
          </div>
        </div>
      </div>

      {/* Client Details Section */}
      <div className="details-container">
        <div className="details-title">Client Details</div>
        <div className="inputs-group">
          {/* Client Company Name Input */}
          <div className="title-and-input">
            <div>Company Name*</div>
            <Input
              size="large"
              placeholder="Company Name"
              value={invoiceData.client_company_name}
              onChange={(e) =>
                handleInputChange("client_company_name", e.target.value)
              }
            />
          </div>
          {/* Client Address Input */}
          <div className="title-and-input">
            <div>Address*</div>
            <Input
              size="large"
              placeholder="Address"
              value={invoiceData.client_address}
              onChange={(e) =>
                handleInputChange("client_address", e.target.value)
              }
            />
          </div>
          {/* Client ABN Input with validation */}
          <div className="title-and-input">
            <div>ABN*</div>
            <CustomFormItem
              validateStatus={clientABNError ? "error" : ""}
              help={clientABNError}
            >
              <Input
                size="large"
                placeholder="ABN"
                value={invoiceData.client_ABN}
                onChange={(e) =>
                  handleInputChange("client_ABN", e.target.value)
                }
                onBlur={(e) =>
                  handleABNBlur("client_ABN", e.target.value, setClientABNError)
                }
              />
            </CustomFormItem>
          </div>
          {/* Client Email Input with validation */}
          <div className="title-and-input">
            <div>Email*</div>
            <CustomFormItem
              validateStatus={clientEmailError ? "error" : ""}
              help={clientEmailError}
            >
              <Input
                size="large"
                placeholder="Email Address"
                value={invoiceData.client_email}
                onChange={(e) =>
                  handleInputChange("client_email", e.target.value)
                }
                onBlur={(e) =>
                  handleEmailBlur(
                    "client_email",
                    e.target.value,
                    setClientEmailError
                  )
                }
              />
            </CustomFormItem>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="details-container">
        <div className="details-title">Products</div>
        <GuiTable />
      </div>

      {/* Payment Details Section */}
      <div className="details-container">
        <div className="details-title">Payment Details</div>
        <div className="inputs-group">
          {/* Bank Name Input */}
          <div className="title-and-input">
            <div>Bank Name*</div>
            <Input
              size="large"
              placeholder="Bank Name"
              value={invoiceData.bank_name}
              onChange={(e) => handleInputChange("bank_name", e.target.value)}
            />
          </div>
          {/* Account Info Inputs */}
          <div className="title-and-input">
            <div>Account Info*</div>
            <div className="datepicker-groups">
              <Input
                size="large"
                placeholder="BSB"
                className="create-datepicker"
                value={invoiceData.bsb_num}
                onChange={(e) => handleInputChange("bsb_num", e.target.value)}
              />
              <Input
                size="large"
                placeholder="Account Number"
                className="create-datepicker"
                value={invoiceData.account_num}
                onChange={(e) =>
                  handleInputChange("account_num", e.target.value)
                }
              />
            </div>
          </div>
          {/* Account Name Input */}
          <div className="title-and-input">
            <div>Account Name*</div>
            <Input
              size="large"
              placeholder="Account Name"
              value={invoiceData.account_name}
              onChange={(e) =>
                handleInputChange("account_name", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="details-container">
        <div className="details-title">Notes</div>
        <TextArea
          size="large"
          placeholder="Add your note here"
          autoSize={{ minRows: 3 }}
          value={invoiceData.note}
          onChange={(e) => handleInputChange("note", e.target.value)}
        />
        <div className="blank-area"></div>
      </div>
    </div>
  );
}
