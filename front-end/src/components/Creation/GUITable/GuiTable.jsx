import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./GuiTable.css";
import { useInvoice } from "@/Content/GuiContent";

// Create a context for the editable cells
const EditableContext = React.createContext(null);

// EditableRow component: Provides form context for editable cells
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// EditableCell component: Handles the editing logic for each cell
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  inputType,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  // Focus the input when editing starts
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  // Toggle the editing state
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  // Save the edited value
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  // Render the cell content based on its state (editing or not)
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: "required",
          },
        ]}
      >
        {inputType === "number" ? (
          <InputNumber
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          minHeight: 20,
          cursor: "pointer",
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

// Main GuiTable component
export function GuiTable() {
  const { invoiceData, updateInvoiceData } = useInvoice();
  const [form] = Form.useForm();

  // Initialize with an empty order if there are no orders
  useEffect(() => {
    if (invoiceData.orders.length === 0) {
      const initialOrder = {
        key: "1",
        description: "",
        unitPrice: null,
        quantity: null,
        net: null,
        gst: null,
        totalPrice: 0,
      };
      updateInvoiceData({
        orders: [initialOrder],
      });
    }
  }, []);

  // Calculate the total price for an order
  const calculateTotalPrice = (record) => {
    const { unitPrice, quantity, gst } = record;
    if (unitPrice && quantity && gst) {
      return unitPrice * quantity * (1 + gst / 100);
    }
    return 0;
  };

  // Add a new order to the table
  const handleAdd = () => {
    const newKey = (invoiceData.orders.length + 1).toString();
    const newOrder = {
      key: newKey,
      description: "",
      unitPrice: null,
      quantity: null,
      net: null,
      gst: null,
      totalPrice: 0,
    };
    updateInvoiceData({
      orders: [...invoiceData.orders, newOrder],
    });
  };

  // Save changes to an order
  const handleSave = (row) => {
    const newOrders = [...invoiceData.orders];
    const index = newOrders.findIndex((item) => row.key === item.key);
    const updatedRow = { ...row };

    // Calculate net value
    if (updatedRow.unitPrice && updatedRow.quantity) {
      updatedRow.net = updatedRow.unitPrice * updatedRow.quantity;
    } else {
      updatedRow.net = null;
    }

    // Calculate total price
    updatedRow.totalPrice = calculateTotalPrice(updatedRow);

    if (index !== -1) {
      newOrders[index] = updatedRow;
    } else {
      newOrders.push(updatedRow);
    }

    updateInvoiceData({ orders: newOrders });
  };

  // Delete an order
  const handleDelete = (key) => {
    const newOrders = invoiceData.orders.filter((item) => item.key !== key);
    updateInvoiceData({ orders: newOrders });
  };

  // Calculate totals for the invoice
  const calculateTotals = () => {
    let subtotal = 0;
    let gstTotal = 0;
    let totalAmount = 0;

    invoiceData.orders.forEach((order) => {
      const { unitPrice, quantity, gst } = order;
      if (unitPrice && quantity) {
        const itemSubtotal = unitPrice * quantity;
        subtotal += itemSubtotal;
        gstTotal += itemSubtotal * (gst / 100);
        totalAmount += itemSubtotal * (1 + gst / 100);
      }
    });

    updateInvoiceData({
      subtotal: subtotal,
      gst_total: gstTotal,
      total_amount: totalAmount,
    });
  };

  // Recalculate totals when orders change
  useEffect(() => {
    calculateTotals();
  }, [invoiceData.orders]);

  // Define table columns
  const columns = [
    // ... (column definitions)
  ];

  // Configure components for editable table
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // Make columns editable
  const editableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.dataIndex === "description" ? "text" : "number",
        handleSave,
      }),
    };
  });

  // Render the table and add item button
  return (
    <div className="gui-table-layout">
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={invoiceData.orders}
        columns={editableColumns}
        pagination={false}
        className="gui-table"
      />
      <div className="gui-table-button">
        <Button onClick={handleAdd} type="primary" className="no-shadow">
          Add New Item
        </Button>
      </div>
    </div>
  );
}
