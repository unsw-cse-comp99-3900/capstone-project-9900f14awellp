import React, { useState, useEffect } from "react";

import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  message,
} from "antd";

import {
  UserDeleteOutlined,
  UserSwitchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
  ExportOutlined,
  UserAddOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";

import { UserInfo } from "../UserInfo/UserInfo";
import { CustomAlert } from "@/components/Alert/MUIAlert";
import {
  allUsersInfo,
  promoteUser,
  deleteUser,
  sendInvitationEmail,
} from "@/apis/users";

import "./UserTable.css";
import { color } from "framer-motion";

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

const statusMapping = {
  false: "Staff",
  true: "Admin",
};

export default function UserTable() {
  //*二次封装的alert组件
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  //*显示alert
  const showAlert = (message, severity = "info") => {
    setAlert({ show: true, message, severity });
  };

  //*隐藏alert
  const hideAlert = () => {
    setAlert({ ...alert, show: false });
  };

  //* 获取数据
  //* get data from the backend
  const [data, _setData] = useState([]);

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

  //* Modal状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  //* 邀请用户的表单数据
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  //* 处理删除用户的逻辑
  const confirmDelete = async (userId) => {
    try {
      await deleteUser(userId);
      showAlert("User has been removed successfully.", "success");
      //* 刷新用户列表或更新本地数据
      allUsersInfo().then((res) => {
        _setData(res.data);
      });
    } catch (error) {
      showAlert("Failed to remove user:" + error.message, "error");
      console.log("删除用户时出错:", error);
    }
  };

  //* 处理取消删除用户的逻辑
  const cancelDelete = () => {
    console.log("cancel delete");
  };

  //* 处理提升用户权限的逻辑
  const confirmPromote = async (userId) => {
    try {
      await promoteUser(userId);
      showAlert("User permission has been promoted", "success");
      //* 刷新用户列表或更新本地数据
      allUsersInfo().then((res) => {
        _setData(res.data);
      });
    } catch (error) {
      showAlert("Failed to promote user permission", "error");
      console.log("提升用户权限时出错:", error);
    }
  };

  //* 处理取消提升用户权限的逻辑
  const cancelPromote = () => {
    console.log("cancel promote");
  };

  //* 处理邀请用户的逻辑
  const handleInvite = () => {
    setIsModalVisible(true);
  };

  //* 处理发送邀请邮件的逻辑
  const handleModalOk = async () => {
    if (!inviteUsername || !inviteEmail) {
      showAlert("Please enter both username and email", "warning");
      return;
    }

    try {
      setConfirmLoading(true);
      await sendInvitationEmail(inviteUsername, inviteEmail);
      setIsModalVisible(false);
      setConfirmLoading(false);
      showAlert("Email sent successfully", "success");

      setInviteUsername("");
      setInviteEmail("");
    } catch (error) {
      showAlert("Failed to send email:" + error.message, "error");
    }
  };

  //* 处理取消邀请用户的逻辑
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setInviteUsername("");
    setInviteEmail("");
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

    columnHelper.accessor("join_company_date", {
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
            placement="bottom"
            description="Are you sure to remove the user from the team?"
            onConfirm={() => confirmDelete(row.original.id)}
            onCancel={cancelDelete}
            okText="Yes"
            cancelText="Cancel"
          >
            <Tooltip
              title={
                row.original.is_staff
                  ? "Administrators cannot be deleted"
                  : "Remove User"
              }
            >
              <Button
                danger
                icon={
                  <UserDeleteOutlined
                    style={{ color: row.original.is_staff ? "#C0C0C0" : "red" }}
                  />
                }
                disabled={row.original.is_staff}
              >
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
          <Popconfirm
            title="Promote"
            placement="bottom"
            description="Are you sure to promote the user to admin?"
            onConfirm={() => confirmPromote(row.original.id)}
            onCancel={cancelPromote}
            okText="Yes"
            cancelText="Cancel"
          >
            <Tooltip
              title={
                row.original.is_staff
                  ? "Administrators cannot be promoted"
                  : "Promote User to Admin"
              }
            >
              <Button
                disabled={row.original.is_staff}
                icon={<UserSwitchOutlined />}
              >
                Promote
              </Button>
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
      const mappedState =
        statusMapping[row.getValue("is_staff")] || row.getValue("is_staff");
      return (
        searchRegex.test(row.getValue("username")) ||
        searchRegex.test(row.getValue("email")) ||
        searchRegex.test(mappedState)
      );
    },
  });

  //* 处理导出用户的逻辑
  const handleExport = async () => {
    //* selectedData是选中的行的数据
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedData.length === 0) {
      showAlert("Select at least one row to export", "warning");
      return;
    }

    // 创建工作簿和工作表
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("admin_invoices");

    // 添加表头
    worksheet.addRow([
      "Username",
      "Email",
      "Permission",
      "Last active",
      "Date added",
    ]);

    // 添加数据
    selectedData.forEach((row) => {
      worksheet.addRow([
        row.username,
        row.email,
        row.is_staff ? "Admin" : "Staff",
        formatDate(row.update_date),
        formatDate(row.join_company_date),
      ]);
    });

    // 生成Excel文件并下载
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Users.xlsx");
    });
  };

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
      {alert.show && (
        <CustomAlert
          message={alert.message}
          severity={alert.severity}
          onClose={hideAlert}
        />
      )}
      <Modal
        title="Invite New User"
        open={isModalVisible}
        onOk={handleModalOk}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        className="invite-user-modal"
      >
        <div className="user-modal-input-group">
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: "#C1C1C1" }} />}
            placeholder="Username"
            value={inviteUsername}
            onChange={(e) => setInviteUsername(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: "#C1C1C1" }} />}
            placeholder="Email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </div>
      </Modal>
      <div className="user-info-header-row">
        <div className="user-info-title-row">
          <div className="user-table-title">Users Management</div>
        </div>
        <div className="user-header-reminder">
          Manage your team members and their account permissions here.
        </div>
      </div>
      <div className="user-search-header-row">
        <div className="user-number-row">
          <div>All users</div>
          <div className="user-number-tag">{data.length}</div>
        </div>
        <div className="user-search-action-row">
          <div className="user-primary-search">
            <Input
              size="large"
              allowClear
              placeholder="Search anything..."
              className="search-input"
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
          <Button size="large" icon={<ExportOutlined />} onClick={handleExport}>
            Export
          </Button>
          <Button
            size="large"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleInvite}
          >
            Invite User
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
