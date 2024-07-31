import React, { useState, useEffect } from "react";

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
  Input,
  Pagination,
  Button,
  InputNumber,
  Tooltip,
  Modal,
  Popconfirm,
} from "antd";

import {
  UserDeleteOutlined,
  UserSwitchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

import { UserInfo } from "../UserInfo/UserInfo";
import { allUsersInfo } from "@/apis/users";

import "./UserTable.css";

function formatDate(dateString) {
  // 创建一个 Date 对象
  const date = new Date(dateString);
  // 月份名称数组
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // 获取日期的各个部分
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // 转换小时为12小时制
  hours = hours % 12;
  hours = hours ? hours : 12; // 如果小时为0，则显示为12

  // 组合成最终的格式
  return `${day} ${month} ${year}, ${hours}:${minutes}${ampm}`;
}

export default function UserTable() {
  //* 获取数据
  //* get data from the backend
  const [data, _setData] = useState([]);
  console.log(data);
  useEffect(() => {
    allUsersInfo().then((res) => {
      _setData(res.data);
    });
  }, []);

  //*分页
  //* pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });

  const [searchValue, setSearchValue] = useState("");

  //* 处理删除用户的逻辑
  const confirmDelete = () => {};

  //* 处理取消删除用户的逻辑
  const cancelDelete = () => {};

  //* 处理提升用户权限的逻辑
  const confirmPromote = () => {};

  //* 处理取消提升用户权限的逻辑
  const cancelPromote = () => {};

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

    columnHelper.accessor("username", {
      header: "User Info",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const { email, username, avatar } = row.original || {};
        return <UserInfo email={email} username={username} avatar={avatar} />;
      },
    }),

    columnHelper.accessor("is_staff", {
      header: "Permission",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const value = info.getValue();
        if (value === false) return <div className="user-staff">Staff</div>;
        if (value === true) return <div className="user-admin">Admin</div>;
        return "Unknown";
      },
    }),

    columnHelper.accessor("update_date", {
      header: "Last avtive",
      enableSorting: true,
      enableColumnFilter: false,
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue()) : "Unknown",
    }),

    columnHelper.accessor("create_date", {
      header: "Date added",
      enableSorting: true,
      enableColumnFilter: false,
      // sortingFn: (rowA, rowB, columnId) => {
      //   const dateA = new Date(rowA.getValue(columnId));
      //   const dateB = new Date(rowB.getValue(columnId));
      //   return dateA.getTime() - dateB.getTime();
      // },
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue()) : "Unknown",
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="actions-button-group">
          <Popconfirm
            title="Remove"
            description="Are you sure to remove the user from the team?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            okText="Yes"
            cancelText="Cancel"
          >
            <Tooltip title="Remove user">
              <Button
                danger
                icon={<UserDeleteOutlined style={{ color: "red" }} />}
              >
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title="Promote"
            description="Are you sure to promote the user to admin?"
            onConfirm={confirmPromote}
            onCancel={cancelPromote}
            okText="Yes"
            cancelText="Cancel"
          >
            <Tooltip title="Promote user to admin">
              <Button icon={<UserSwitchOutlined />}>Promote</Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    }),
  ];

  //*table初始化
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      globalFilter: searchValue,
      pagination,
    },
    onGlobalFilterChange: setSearchValue,
    globalFilterFn: (row, columnId, filterValue) => {
      const escapedValue = filterValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedValue, "i");
      return (
        searchRegex.test(row.getValue("username")) ||
        searchRegex.test(row.getValue("email"))
      );
    },
  });

  //*设置自定义分页状态
  //* set custom page size
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

  return (
    <div className="user-table-container">
      <div className="user-info-header-row">
        <div className="user-info-title-row">
          <div className="user-table-title">Users</div>
          <div className="user-number-tag">{data.length} users</div>
        </div>
        <div className="user-header-reminder">
          Manage your team members and their account permissions here.
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
      <div className="user-pagination-group">
        <div className="total-info">
          {`Showing ${start}-${end} of ${total} people`}
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
        <div>People per page: {renderCustomSizeChanger()}</div>
      </div>
    </div>
  );
}
