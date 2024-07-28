import React from "react";
import "./GuiForm.css";
import { GuiTable } from "../GUITable/GuiTable";
import { useInvoice } from "@/Content/GuiContent";

import { Input, DatePicker, Select, InputNumber } from "antd";
import dayjs from "dayjs";
import { FlagIcon } from "react-flag-kit";
import { CompanyInfo } from "@/apis/gui";

const { TextArea } = Input;

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
  const { invoiceData, updateInvoiceData, clearInvoiceData } = useInvoice();
  const handleInputChange = (field, value) => {
    updateInvoiceData({ [field]: value });
  };

  return (
    <div className="form-container">
      <div className="details-container">
        <div className="details-title">Invoice Details</div>
        <div className="inputs-group">
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
          <div className="title-and-input">
            <div>Invoice Number*</div>
            <Input
              size="large"
              placeholder="Invoice Number"
              value={invoiceData.invoice_num}
              onChange={(e) => handleInputChange("invoice_num", e.target.value)}
            />
          </div>
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
      <div className="details-container">
        <div className="title-row">
          <div className="details-title">My Details</div>
        </div>
        <div className="inputs-group">
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
          <div className="title-and-input">
            <div>Address*</div>
            <Input
              size="large"
              placeholder="Address"
              value={invoiceData.my_address}
              onChange={(e) => handleInputChange("my_address", e.target.value)}
            />
          </div>

          <div className="title-and-input">
            <div>ABN*</div>
            <Input
              size="large"
              placeholder="ABN"
              value={invoiceData.my_ABN}
              onChange={(e) => handleInputChange("my_ABN", e.target.value)}
            />
          </div>

          <div className="title-and-input">
            <div>Email*</div>
            <Input
              size="large"
              placeholder="Email Address"
              value={invoiceData.my_email}
              onChange={(e) => handleInputChange("my_email", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="details-container">
        <div className="details-title">Client Details</div>
        <div className="inputs-group">
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

          <div className="title-and-input">
            <div>ABN*</div>
            <Input
              size="large"
              placeholder="ABN"
              value={invoiceData.client_ABN}
              onChange={(e) => handleInputChange("client_ABN", e.target.value)}
            />
          </div>

          <div className="title-and-input">
            <div>Email*</div>
            <Input
              size="large"
              placeholder="Email Address"
              value={invoiceData.client_email}
              onChange={(e) =>
                handleInputChange("client_email", e.target.value)
              }
            />
          </div>
        </div>
      </div>
      <div className="details-container">
        <div className="details-title">Products</div>
        <GuiTable />
      </div>
      <div className="details-container">
        <div className="details-title">Payment Details</div>
        <div className="inputs-group">
          <div className="title-and-input">
            <div>Bank Name*</div>
            <Input
              size="large"
              placeholder="Bank Name"
              value={invoiceData.bank_name}
              onChange={(e) => handleInputChange("bank_name", e.target.value)}
            />
          </div>
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
