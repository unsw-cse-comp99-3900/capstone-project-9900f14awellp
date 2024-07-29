import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
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

import { Checkbox } from "@mui/material";
import {
  DatePicker,
  Select,
  Input,
  Pagination,
  Button,
  Dropdown,
  InputNumber,
} from "antd";

import {
  StatusTag,
  StatusClosableTag,
} from "@/components/Management/StatusTag/StatusTag";
import { SearchOutlined } from "@ant-design/icons";

import { invoiceAdminManage } from "@/apis/management";
import { getValue } from "@testing-library/user-event/dist/utils";

// 映射状态
// Status mapping
const statusMapping = {
  Failed: "Rejected",
  unvalidated: "Unvalidated",
  Passed: "Success",
};

// 格式化total
// Format total
const formatPrice = (price) => {
  if (price === null || price === undefined) return "";
  return `$${Number(price).toFixed(2)}`;
};

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  return (
    <StatusClosableTag
      value={value}
      label={label}
      closable={closable}
      onClose={onClose}
    />
  );
};

//TODO: 这个table包括
//TODO：1. 发票id（不用发票名称）
//TODO：2. 客户名称
//TODO：3. 发票状态
//TODO：4. 发票创建的timestamp
//TODO：5. 是谁创建的
//TODO：6. 发票金额
//TODO：7. 操作（查看，验证，发送，删除）
export function AdminManagementTable() {
  //*获取数据
  const [data, _setData] = useState([]);
  console.log(data);
  useEffect(() => {
    invoiceAdminManage()
      .then((response) => {
        _setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //* 操作列的方法
  const navigate = useNavigate();
  const goValidate = (uuid) => {
    navigate(`/validate/id=${uuid}`);
  };
  const goSend = (uuid) => {
    navigate(`/send/id=${uuid}`);
  };

  //* 操作列的具体内容
  const items = [
    {
      key: "1",
      label: "Validate",
      onClick: (uuid) => {
        // console.log(uuid);
        goValidate(uuid);
      },
    },
    {
      key: "2",
      label: "Send",
      onClick: (uuid) => {
        // console.log(uuid);
        goSend(uuid);
      },
    },
    {
      key: "3",
      label: "Delete",
      onClick: (uuid) => {
        //TODO: 删除发票
      },
    },
  ];

  //* 点击下拉按钮后使用的方法
  const onMenuClick = (info, uuid) => {
    //const { key } = info; 这行代码使用了 JavaScript 的解构赋值（Destructuring assignment）语法。这是 ES6 （ECMAScript 2015）引入的一个特性，允许我们从对象或数组中提取值，赋给变量
    //这行代码等同于：const key = info.key;
    //如果 info 对象还有 label 属性，可以这样写：const { key, label } = info; 这会同时创建 key 和 label 两个变量。
    const { key } = info;
    const selectedAction = items.find((i) => i.key === key);
    if (selectedAction && selectedAction.onClick) {
      selectedAction.onClick(uuid);
    }
  };

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
    columnHelper.accessor("invoice_number", {
      header: "No.",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => (info.getValue() ? info.getValue() : "Unknown"),
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
    columnHelper.accessor("timestamp", {
      header: "Create At",
      enableSorting: true,
      enableColumnFilter: false,
      //   sortingFn: (rowA, rowB, columnId) => {
      //     const dateA = new Date(rowA.getValue(columnId));
      //     const dateB = new Date(rowB.getValue(columnId));
      //     return dateA.getTime() - dateB.getTime();
      //   },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("userid", {
      header: "Uploader",
      enableSorting: true,
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
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
          <Button onClick={() => handleViewClick(row.original.file)}>
            View
          </Button>
          <Dropdown.Button
            menu={{
              items,
              onClick: (info) => onMenuClick(info, row.original.uuid),
            }}
          >
            Actions
          </Dropdown.Button>
        </div>
      ),
    }),
  ];
  //*分页
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  //* 导出excel的选中数据
  //eslint-disable-next-line
  const [selectedDate, setSelectedDate] = useState(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  //* 导出excel的方法
  //   useImperativeHandle(ref, () => ({
  //     getSelectedData: () => {
  //       return table.getSelectedRowModel().rows.map((row) => row.original);
  //     },
  //   }));

  const [customPageSize, setCustomPageSize] = useState(
    table.getState().pagination.pageSize
  );

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

  const total = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  const [selectedState, setSelectedState] = useState([]);
  const handleStateChange = (value) => {
    setSelectedState(value);
    table.getColumn("state").setFilterValue(value);
  };

  return (
    <div className="table-container">
      <div className="pagination-group">
        <div className="total-info">
          {`showing ${start}-${end} of ${total} items`}
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
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getIsSorted() &&
                      (header.column.getIsSorted() === "asc" ? "🔽" : "🔼")}
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
          {`showing ${start}-${end} of ${total} items`}
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
