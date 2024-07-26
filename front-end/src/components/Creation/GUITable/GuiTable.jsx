import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./GuiTable.css";
import { useInvoice } from "@/Content/GuiContent";

const EditableContext = React.createContext(null);

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
  //   console.log("EditableCell props:", {
  //     title,
  //     editable,
  //     dataIndex,
  //     record,
  //     inputType,
  //   });

  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  //   console.log(
  //     `EditableCell render - dataIndex: ${dataIndex}, editing: ${editing}, editable: ${editable}`
  //   );

  useEffect(() => {
    if (editing) {
      //   console.log(`useEffect triggered - setting focus for ${dataIndex}`);
      inputRef.current?.focus();
    }
  }, [editing, dataIndex]);

  const toggleEdit = () => {
    // console.log(
    //   `toggleEdit called for ${dataIndex} - current editing state: ${editing}`
    // );
    setEditing((prevEditing) => {
      //   console.log(
      //     `Setting new editing state for ${dataIndex}: ${!prevEditing}`
      //   );
      return !prevEditing;
    });
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    // console.log(`Form value set for ${dataIndex}:`, record[dataIndex]);
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      //   console.log(`save called for ${dataIndex} - values:`, values);
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

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
            onClick={(e) => {
              //   console.log(`InputNumber clicked for ${dataIndex}`);
              e.stopPropagation();
            }}
          />
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            onClick={(e) => {
              //   console.log(`Input clicked for ${dataIndex}`);
              e.stopPropagation();
            }}
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

  //   console.log(
  //     `Rendering cell for ${dataIndex}, editable: ${editable}, editing: ${editing}`
  //   );
  return <td {...restProps}>{childNode}</td>;
};

export function GuiTable() {
  const { invoiceData, updateInvoiceData } = useInvoice();
  const [form] = Form.useForm();

  const calculateTotalPrice = (record) => {
    const { unitPrice, quantity, gst } = record;
    if (unitPrice && quantity && gst) {
      return unitPrice * quantity * (1 + gst / 100);
    }
    return 0;
  };

  const handleAdd = () => {
    const newKey = (invoiceData.orders.length + 1).toString();
    const newOrder = {
      key: newKey,
      productName: "",
      unitPrice: null,
      quantity: null,
      gst: null,
      totalPrice: 0,
    };
    updateInvoiceData({
      orders: [...invoiceData.orders, newOrder],
    });
  };

  const handleSave = (row) => {
    const newOrders = [...invoiceData.orders];
    const index = newOrders.findIndex((item) => row.key === item.key);
    if (index !== -1) {
      newOrders[index] = { ...row, totalPrice: calculateTotalPrice(row) };
    } else {
      newOrders.push({ ...row, totalPrice: calculateTotalPrice(row) });
    }
    updateInvoiceData({ orders: newOrders });
  };

  const handleDelete = (key) => {
    const newOrders = invoiceData.orders.filter((item) => item.key !== key);
    updateInvoiceData({ orders: newOrders });
  };

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
      subtotal: subtotal.toFixed(2),
      gst_total: gstTotal.toFixed(2),
      total_amount: totalAmount.toFixed(2),
    });
  };

  useEffect(() => {
    calculateTotals();
  }, [invoiceData.orders]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      width: "30%",
      editable: true,
      onHeaderCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          color: "#333",
        },
      }),
      onCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "13px",
          fontWeight: "200",
          color: "#424242",
        },
      }),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      editable: true,
      width: "20%",
      onHeaderCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          color: "#333",
        },
      }),
      onCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "13px",
          fontWeight: "200",
          color: "#424242",
        },
      }),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      editable: true,
      width: "10%",
      onHeaderCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          color: "#333",
        },
      }),
      onCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "13px",
          fontWeight: "200",
          color: "#424242",
        },
      }),
    },
    {
      title: "GST(%)",
      dataIndex: "gst",
      width: "10%",
      editable: true,
      onHeaderCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          color: "#333",
        },
      }),
      onCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "13px",
          fontWeight: "200",
          color: "#424242",
        },
      }),
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      width: "15%",
      onHeaderCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          color: "#333",
        },
      }),
      onCell: () => ({
        style: {
          fontFamily: "Lexend Deca, sans-serif",
          fontSize: "13px",
          fontWeight: "400",
          color: "#424242",
        },
      }),
      render: (_, record) => {
        const total = calculateTotalPrice(record);
        return `$${total.toFixed(2)}`;
      },
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_, record) =>
        //订单数量大于等于1时才显示删除按钮
        invoiceData.orders.length >= 1 ? (
          <Popconfirm
            title="Confirm to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

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
        inputType: col.dataIndex === "productName" ? "text" : "number",
        handleSave,
      }),
    };
  });

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
