import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { Checkbox } from "@mui/material";
import {
  Input,
  Pagination,
  Button,
  Dropdown,
  InputNumber,
  Tooltip,
  Modal,
} from "antd";
import {
  InfoCircleOutlined,
  SearchOutlined,
  DeliveredProcedureOutlined,
  SendOutlined,
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ExportOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

import { ShineBorder } from "./ShineBorder";

import Correct from "@/assets/check.svg";
import Dollor from "@/assets/dollar-sign.svg";
import Loader from "@/assets/loader.svg";
import User from "@/assets/user.svg";

import { StatusTag } from "@/components/Management/StatusTag/StatusTag";

import { UserInfo } from "@/components/Users/UserInfo/UserInfo";
import { InvoiceMainInfo } from "../InvoiceMainInfo/InvoiceMainInfo";
import { CustomAlert } from "@/components/Alert/MUIAlert";

import { invoiceAdminManage, invoiceDeletion } from "@/apis/management";

import "./AdminManagementTable.css";

// Status mapping
const statusMapping = {
  Failed: "Rejected",
  unvalidated: "Unvalidated",
  Passed: "Success",
};

// Format total
const formatPrice = (price) => {
  if (price === null || price === undefined) return "";
  if (typeof price === "string" && price.startsWith("$")) {
    price = price.slice(1);
  }
  return `$${Number(price).toFixed(2)}`;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

// Calculate the amount of invoices that will expire in 30 days
const calculateUpcoming30DueDateInfo = (invoices) => {
  const currentDate = new Date();
  const thirtyDaysLater = new Date(
    currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
  );

  const result = invoices.reduce(
    (acc, invoice) => {
      const dueDate = new Date(invoice.due_date);
      if (
        dueDate > currentDate &&
        dueDate <= thirtyDaysLater &&
        invoice.state !== "Failed"
      ) {
        const amount =
          typeof invoice.total === "number"
            ? invoice.total
            : parseFloat((invoice.total || "").replace(/[^0-9.-]+/g, ""));

        return {
          totalAmount: acc.totalAmount + amount,
          count: acc.count + 1,
        };
      }
      return acc;
    },
    { totalAmount: 0, count: 0 }
  );

  return {
    totalAmount: result.totalAmount.toFixed(2),
    count: result.count,
  };
};

// Calculate the number of unique suppliers
const countUniqueSuppliers = (invoices) => {
  return new Set(invoices.map((invoice) => invoice.supplier.trim())).size;
};

// Calculate the total amount and count of invoices received
const calculateOverdueInfo = (invoices) => {
  const currentDate = new Date();

  const parseAmount = (amount) => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      return parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
    }
    return 0;
  };

  const result = invoices.reduce(
    (acc, invoice) => {
      const dueDate = new Date(invoice.due_date);
      if (dueDate < currentDate && invoice.state !== "Failed") {
        return {
          totalAmount: acc.totalAmount + parseAmount(invoice.total),
          count: acc.count + 1,
        };
      }
      return acc;
    },
    { totalAmount: 0, count: 0 }
  );

  return {
    totalAmount: result.totalAmount.toFixed(2),
    count: result.count,
  };
};

// Find the supplier with the highest total amount
const findSupplierWithHighestTotal = (invoices) => {
  const parseAmount = (amount) => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      return parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
    }
    return 0;
  };

  const supplierTotals = invoices.reduce((acc, invoice) => {
    const supplier = invoice.supplier?.trim();
    // chech if supplier exists
    if (supplier) {
      const amount = parseAmount(invoice.total);
      acc[supplier] = (acc[supplier] || 0) + amount;
    }
    return acc;
  }, {});

  const [topSupplier, maxTotal] = Object.entries(supplierTotals).reduce(
    ([currentSupplier, currentMax], [supplier, total]) =>
      total > currentMax ? [supplier, total] : [currentSupplier, currentMax],
    ["", 0]
  );

  return { supplier: topSupplier, total: maxTotal.toFixed(2) };
};

// Calculate the total amount and count of all invoices that are not Failed
const calculateNonFailedInvoicesInfo = (invoices) => {
  const parseAmount = (amount) => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      return parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
    }
    return 0;
  };

  const result = invoices.reduce(
    (acc, invoice) => {
      if (invoice.state !== "Failed") {
        return {
          totalAmount: acc.totalAmount + parseAmount(invoice.total),
          count: acc.count + 1,
        };
      }
      return acc;
    },
    { totalAmount: 0, count: 0 }
  );

  return {
    totalAmount: result.totalAmount.toFixed(2),
    count: result.count,
  };
};

export function AdminManagementTable() {
  //* Wrapped alert component
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  //* Show alert
  const showAlert = (message, severity = "info") => {
    setAlert({ show: true, message, severity });
  };

  //* Hide alert
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // State to hold the main data array
  const [data, _setData] = useState([]);

  // State to hold information about invoices due in the next 30 days
  const [upcoming30DaysInfo, setUpcoming30DaysInfo] = useState({
    totalAmount: "0.00", // Total amount of invoices due in the next 30 days
    count: 0, // Count of invoices due in the next 30 days
  });

  // State to hold information about overdue invoices
  const [overdueInfo, setOverdueInfo] = useState({
    totalAmount: "0.00", // Total amount of overdue invoices
    count: 0, // Count of overdue invoices
  });

  // State to hold the count of unique suppliers
  const [uniqueSuppliersCount, setUniqueSuppliersCount] = useState(0);

  // State to hold information about the top supplier
  const [topSupplier, setTopSupplier] = useState({
    supplier: "", // Name of the top supplier
    total: "0.00", // Total amount associated with the top supplier
  });

  // State to hold information about non-failed invoices
  const [nonFailedInvoicesInfo, setNonFailedInvoicesInfo] = useState({
    totalAmount: "0.00", // Total amount of non-failed invoices
    count: 0, // Count of non-failed invoices
  });

  // State to hold the selected payment status filter
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");

  // State to hold the filtered data based on the selected payment status
  const [filteredData, setFilteredData] = useState([]);

  // State to hold the search value for filtering data
  const [searchValue, setSearchValue] = useState("");

  // State to control the visibility of the delete confirmation modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // State to hold the UUID of the currently selected item for deletion
  const [currentUuid, setCurrentUuid] = useState(null);

  //* Get data from API and set it to state
  useEffect(() => {
    invoiceAdminManage()
      .then((response) => {
        _setData(response.data);
        setUpcoming30DaysInfo(calculateUpcoming30DueDateInfo(response.data));
        setUniqueSuppliersCount(countUniqueSuppliers(response.data));
        setOverdueInfo(calculateOverdueInfo(response.data));
        setTopSupplier(findSupplierWithHighestTotal(response.data));
        setNonFailedInvoicesInfo(calculateNonFailedInvoicesInfo(response.data));
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Handle deletion of invoice
  const handleDelete = (uuid) => {
    setCurrentUuid(uuid);
    setIsDeleteModalVisible(true);
  };

  // Confirm deletion of invoice
  const confirmDelete = () => {
    if (currentUuid) {
      invoiceDeletion(currentUuid)
        .then(() => {
          showAlert("Delete Successfully", "success");
          refreshData();
        })
        .catch((error) => {
          showAlert("Deletion of invoice failed, please try again", "error");
        });
    }
    setIsDeleteModalVisible(false);
  };

  // Cancel deletion of invoice
  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  // Call this function when invoice is deleted to refresh table data
  const refreshData = () => {
    invoiceAdminManage()
      .then((response) => {
        _setData(response.data);
        setFilteredData(response.data);
        setUpcoming30DaysInfo(calculateUpcoming30DueDateInfo(response.data));
        setUniqueSuppliersCount(countUniqueSuppliers(response.data));
        setOverdueInfo(calculateOverdueInfo(response.data));
        setTopSupplier(findSupplierWithHighestTotal(response.data));
        setNonFailedInvoicesInfo(calculateNonFailedInvoicesInfo(response.data));
      })
      .catch((error) => {
        showAlert("Refresh data failed, please try again", "error");
      });
  };

  // Filter data based on selected payment status
  const filterData = (status) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (status) {
      case "all":
        setFilteredData(data);
        break;
      case "paid":
        setFilteredData(
          data.filter((invoice) => {
            const dueDate = new Date(invoice.due_date);
            return dueDate < today && invoice.state !== "Failed";
          })
        );
        break;
      case "unpaid":
        setFilteredData(
          data.filter((invoice) => {
            const dueDate = new Date(invoice.due_date);
            return dueDate >= today && invoice.state !== "Failed";
          })
        );
        break;
      default:
        setFilteredData(data);
    }
  };

  // Method called when payment status switch is clicked
  const handlePaymentStatusClick = (status) => {
    setSelectedPaymentStatus(status);
    filterData(status);
  };

  // Methods for the actions column
  const navigate = useNavigate();
  //goValidate page with uuid
  const goValidate = (uuid) => {
    navigate(`/validate/id=${uuid}`);
  };
  //goSend page with uuid
  const goSend = (uuid) => {
    navigate(`/send/id=${uuid}`);
  };

  const goCreate = () => {
    navigate("/create");
  };

  //view details page with uuid
  const goDetails = (uuid) => {
    navigate(`/manage/id=${uuid}`);
  };

  //define the content of the actions column
  const items = [
    {
      key: "1",
      label: "Validate",
      onClick: (uuid, state) => {
        if (state === "unvalidated") {
          goValidate(uuid);
        } else {
          showAlert("Only unvalidated invoices can be validated", "warning");
        }
      },
      disabled: (state) => state !== "unvalidated",
      icon: <DeliveredProcedureOutlined />,
    },
    {
      key: "2",
      label: "Send",
      icon: <SendOutlined />,
      onClick: (uuid) => {
        goSend(uuid);
      },
    },
    {
      key: "3",
      label: "Delete",
      icon: <DeleteOutlined />,
      onClick: (uuid) => {
        if (typeof uuid === "string" && uuid) {
          handleDelete(uuid);
        } else {
          console.log("Invalid UUID:", uuid);
        }
      },
    },
  ];

  // Method called when the dropdown button is clicked
  const onMenuClick = (menuInfo, row) => {
    //const { key } = info; 这行代码使用了 JavaScript 的解构赋值（Destructuring assignment）语法。这是 ES6 （ECMAScript 2015）引入的一个特性，允许我们从对象或数组中提取值，赋给变量
    //这行代码等同于：const key = info.key;
    //如果 info 对象还有 label 属性，可以这样写：const { key, label } = info; 这会同时创建 key 和 label 两个变量。
    const { key } = menuInfo;
    const selectedAction = items.find((item) => item.key === key);
    if (selectedAction && selectedAction.onClick) {
      selectedAction.onClick(row.uuid, row.state);
    }
  };

  //define the content of the table header and content
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <div className="checkbox-container">
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            sx={{
              color: "#ACACAC",
              "&.Mui-checked": {
                color: "#333",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "black",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 22,
              },
            }}
          />
        </div>
      ),

      cell: ({ row }) => (
        <div className="checkbox-container">
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            sx={{
              color: "#ACACAC",
              "&.Mui-checked": {
                color: "#333",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 22,
              },
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("files_name", {
      header: "Invoice Info",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const { invoice_number, files_name } = row.original || {};
        return (
          <InvoiceMainInfo
            invoiceNum={invoice_number}
            invoiceName={files_name}
          />
        );
      },
    }),

    columnHelper.accessor("supplier", {
      header: "Customer",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => (info.getValue() ? info.getValue() : "Unknown"),
    }),
    columnHelper.accessor("state", {
      header: "Status",
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        const originalValue = row.getValue(columnId);
        const mappedValue = statusMapping[originalValue] || originalValue;
        return filterValue.includes(mappedValue);
      },
      cell: ({ getValue }) => {
        const originalValue = getValue();
        const displayValue = statusMapping[originalValue] || originalValue;
        return <StatusTag value={displayValue} label={displayValue} />;
      },
    }),
    columnHelper.accessor("due_date", {
      header: "Pay Due",
      enableSorting: true,
      enableColumnFilter: false,
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId));
        const dateB = new Date(rowB.getValue(columnId));
        return dateA.getTime() - dateB.getTime();
      },
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.accessor("name", {
      header: "Uploader",
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const { email, name, avatar } = row.original || {};
        // console.log(row.original.avatar);
        return <UserInfo username={name} email={email} avatar={avatar} />;
      },
    }),
    columnHelper.accessor("total", {
      header: "Price",
      cell: ({ getValue }) => {
        const value = getValue();
        if (value === null || value === undefined) return "Unknown";
        return <div className="bold-text">{formatPrice(getValue())}</div>;
      },
      enableSorting: true,
      enableColumnFilter: false,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="actions-button-group">
          <Button onClick={() => goDetails(row.original.uuid)}>View</Button>
          <Dropdown.Button
            menu={{
              items: items.map((item) => ({
                ...item,
                disabled: item.disabled
                  ? item.disabled(row.original.state)
                  : false,
              })),
              onClick: (info) => onMenuClick(info, row.original),
            }}
          >
            Actions
          </Dropdown.Button>
        </div>
      ),
    }),
  ];

  //set initial pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  //initial table state
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //set global filter and pagination
    state: {
      globalFilter: searchValue,
      pagination,
    },
    onGlobalFilterChange: setSearchValue,
    globalFilterFn: (row, columnId, filterValue) => {
      const escapedValue = filterValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedValue, "i");
      // 获取映射后的状态值
      const mappedState =
        statusMapping[row.getValue("state")] || row.getValue("state");
      return (
        searchRegex.test(row.getValue("files_name")) ||
        searchRegex.test(row.getValue("supplier")) ||
        searchRegex.test(mappedState) ||
        searchRegex.test(row.getValue("name"))
      );
    },
  });

  // export the rows that are selected to excel
  const handleExport = async () => {
    //* selectedData是选中的行的数据
    // the selectedData is the data of the rows that are selected in the table
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedData.length === 0) {
      showAlert("Select at least one row to export", "warning");
      return;
    }

    // create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("admin_invoices");

    //add the header row
    worksheet.addRow([
      "Invoice Number",
      "Invoice Name",
      "Customer",
      "Status",
      "Due Date",
      "Uploader",
      "Uploader Email",
      "Total",
    ]);

    // add the data from table
    selectedData.forEach((row) => {
      worksheet.addRow([
        row.invoice_number,
        row.files_name,
        row.supplier,
        row.state,
        row.due_date,
        row.name,
        row.email,
        row.total,
      ]);
    });

    // generate the file and download it
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "invoices.xlsx");
    });
  };

  // Custom pagination size changer
  const [customPageSize, setCustomPageSize] = useState(
    table.getState().pagination.pageSize
  );

  // Custom pagination size changer
  const renderCustomSizeChanger = () => (
    <InputNumber
      changeOnWheel
      value={customPageSize}
      onChange={(newValue) => {
        if (newValue && newValue > 0) {
          setCustomPageSize(newValue);
          table.setPageSize(newValue);
        }
      }}
      style={{
        width: 50,
        marginLeft: 8,
        fontSize: 12,
      }}
    />
  );

  // Custom pagination size calculator
  const total = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="admin-table-container">
      <Modal
        title="Comfirm to Delete"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>
          Sure you want to delete this invoice? This action cannot be undone.
        </p>
      </Modal>
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
      <div className="title-container">
        <div className="admin-invoice-title">
          <div>Overview</div>
          <Tooltip title="Rejected invoices are not counted.">
            <div className="overview-info-icon">
              <InfoCircleOutlined />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="statistics-box">
        <ShineBorder
          borderWidth={1.8}
          borderRadius={20}
          className="relative flex flex-col items-center justify-center overflow-hidden rounded-[21px] border bg-background w-1/4 cursor-pointer"
          color={["#FFF5E7", "#D5F9EF", "#FED5D4"]}
          onClick={() => handlePaymentStatusClick("paid")}
        >
          <div className="statistics-box-inside">
            <div className="statistics-title">
              <div>Received amounts:</div>
              <div className="statistics-correct-icon">
                <img src={Correct} alt="Received Amount" />
              </div>
            </div>
            <div className="statistics-amount">${overdueInfo.totalAmount}</div>
            <div className="statistics-tag">{overdueInfo.count} invoices</div>
          </div>
        </ShineBorder>

        <ShineBorder
          borderWidth={1.8}
          borderRadius={20}
          className="relative flex flex-col items-center justify-center overflow-hidden rounded-[21px] border bg-background w-1/4"
          color={["#FFF5E7", "#D5F9EF", "#FED5D4"]}
        >
          <div className="statistics-box-inside">
            <div className="statistics-title">
              <div>Due within next 30 days:</div>
              <div className="statistics-loading-icon">
                <img src={Loader} alt="Pay within 30 days Amount" />
              </div>
            </div>
            <div className="statistics-amount">
              ${upcoming30DaysInfo.totalAmount}
            </div>
            <div className="statistics-tag">
              {upcoming30DaysInfo.count} invoices
            </div>
          </div>
        </ShineBorder>

        <ShineBorder
          borderWidth={1.8}
          borderRadius={20}
          className="relative flex flex-col items-center justify-center overflow-hidden rounded-[21px] border bg-background w-1/4 cursor-pointer"
          color={["#FFF5E7", "#D5F9EF", "#FED5D4"]}
          onClick={() => handlePaymentStatusClick("all")}
        >
          <div className="statistics-box-inside">
            <div className="statistics-title">
              <div>Total amount:</div>
              <div className="statistics-dollor-icon">
                <img src={Dollor} alt="Total amount" />
              </div>
            </div>
            <div className="statistics-amount">
              ${nonFailedInvoicesInfo.totalAmount}
            </div>
            <div className="statistics-tag">{uniqueSuppliersCount} clients</div>
          </div>
        </ShineBorder>

        <ShineBorder
          borderWidth={1.8}
          borderRadius={20}
          className="relative flex flex-col items-center justify-center overflow-hidden rounded-[21px] border bg-background w-1/4 cursor-pointer"
          color={["#FFF5E7", "#D5F9EF", "#FED5D4"]}
          onClick={() => setSearchValue(topSupplier.supplier)}
        >
          <div className="statistics-box-inside">
            <div className="statistics-title">
              <div>Top client:</div>
              <div className="statistics-user-icon">
                <img src={User} alt="Top user" />
              </div>
            </div>
            <div className="statistics-amount">${topSupplier.total}</div>
            <div className="statistics-tag">{topSupplier.supplier}</div>
          </div>
        </ShineBorder>
      </div>
      <div className="title-container">
        <div className="admin-invoice-title">Invoice</div>
      </div>

      <div className="admin-search-row">
        <div className="admin-search-row-left">
          <div className="payment-search">
            <div
              className={`payment-status-box ${selectedPaymentStatus === "all" ? "selected" : ""}`}
              onClick={() => handlePaymentStatusClick("all")}
            >
              <div
                className={selectedPaymentStatus === "all" ? "bold-text" : ""}
              >
                All Invoice
              </div>
              <div className="all-payment-tag">{data.length}</div>
            </div>
            <div
              className={`payment-status-box ${selectedPaymentStatus === "paid" ? "selected" : ""}`}
              onClick={() => handlePaymentStatusClick("paid")}
            >
              <div
                className={selectedPaymentStatus === "paid" ? "bold-text" : ""}
              >
                Paid
              </div>
              <div className="paid-payment-tag">{overdueInfo.count}</div>
            </div>
            <div
              className={`payment-status-box ${selectedPaymentStatus === "unpaid" ? "selected" : ""}`}
              onClick={() => handlePaymentStatusClick("unpaid")}
            >
              <div
                className={
                  selectedPaymentStatus === "unpaid" ? "bold-text" : ""
                }
              >
                Unpaid
              </div>
              <div className="unpaid-payment-tag">
                {nonFailedInvoicesInfo.count - overdueInfo.count}
              </div>
            </div>
          </div>
          <div className="admin-global-search">
            <Input
              allowClear
              placeholder="Search anything..."
              className="admin-search-input"
              size="large"
              prefix={
                <SearchOutlined
                  style={{
                    color: "rgba(0,0,0,.25)",
                  }}
                />
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-search-row-right">
          <Button
            size="large"
            onClick={handleExport}
            icon={<ExportOutlined style={{ color: "#787B88" }} />}
            style={{ color: "#787B88" }}
          >
            Export
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={goCreate}
            icon={<AppstoreAddOutlined />}
          >
            New Invoice
          </Button>
        </div>
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 4,
                      cursor: "pointer",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getIsSorted() &&
                      (header.column.getIsSorted() === "asc" ? (
                        <ArrowDownOutlined />
                      ) : (
                        <ArrowUpOutlined />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-group">
        <div className="total-info">
          {`Showing ${start}-${end} of ${total} items`}
        </div>
        <Pagination
          current={table.getState().pagination.pageIndex + 1}
          total={table.getFilteredRowModel().rows.length}
          pageSize={table.getState().pagination.pageSize}
          onChange={(page, pageSize) => {
            table.setPageIndex(page - 1);
            table.setPageSize(pageSize);
          }}
        />
        <div>Items per page: {renderCustomSizeChanger()}</div>
      </div>
    </div>
  );
}
