import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { invoiceBasicInfo } from '../../../apis/management';
import { StatusTag, StatusClosableTag } from '../StatusTag/StatusTag';

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Checkbox } from '@mui/material';
import { DatePicker, Select, Input, Pagination, Button, Dropdown } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './global.css';

// 映射状态
// Status mapping
const statusMapping = {
	Failed: 'Rejected',
	unvalidated: 'Unvalidated',
	success: 'Success',
};

// 格式化日期
// Format date
const formatDate = (dateString) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).format(date);
};

// 格式化total
// Format total
const formatPrice = (price) => {
	if (price === null || price === undefined) return '';
	return `$${Number(price).toFixed(2)}`;
};

// 截断单元格
// Truncate cell
const TruncatedCell = ({ content, maxLength = 20 }) => {
	if (content.length <= maxLength) return content;

	const start = content.slice(0, Math.floor(maxLength / 2));
	const end = content.slice(-Math.floor(maxLength / 2));

	return (
		<span title={content}>
			{start}...{end}
		</span>
	);
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

export function ManageTable() {
	// const data = defaultData;
	const [data, _setData] = React.useState([]);
	// const rerender = React.useReducer(() => ({}), {})[1];
	const [searchValue, setSearchValue] = useState('');
	//eslint-disable-next-line
	const [selectedDate, setSelectedDate] = useState(null);
	//eslint-disable-next-line
	const [selectedDueDate, setSelectedDueDate] = useState(null);
	//eslint-disable-next-line
	const [selectedState, setSelectedState] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 6,
	});
	const navigate = useNavigate();
	const goValidate = () => {
		navigate('/validate');
	};
	const goSend = () => {
		navigate('/send');
	};

	const items = [
		{
			key: '1',
			label: 'Validate',
			onClick: (uuid) => {
				console.log(uuid);
				goValidate();
			},
		},
		{
			key: '2',
			label: 'Send',
			onClick: (uuid) => {
				console.log(uuid);
				goSend();
			},
		},
	];
	//info是 Ant Design 的 Dropdown 组件在菜单项被点击时自动传递的对象
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

	useEffect(() => {
		invoiceBasicInfo()
			.then((response) => {
				_setData(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const columnHelper = createColumnHelper();

	const columns = [
		columnHelper.display({
			id: 'select',
			header: ({ table }) => (
				<div className="checkbox-container">
					<Checkbox
						checked={table.getIsAllRowsSelected()}
						indeterminate={table.getIsSomeRowsSelected()}
						onChange={table.getToggleAllRowsSelectedHandler()}
						sx={{
							color: '#ACACAC',
							'&.Mui-checked': {
								color: '#333',
							},
							'&.MuiCheckbox-indeterminate': {
								color: 'black',
							},
							'& .MuiSvgIcon-root': {
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
							color: '#ACACAC',
							'&.Mui-checked': {
								color: '#333',
							},
							'& .MuiSvgIcon-root': {
								fontSize: 22,
							},
						}}
					/>
				</div>
			),
		}),
		columnHelper.accessor('invoice_number', {
			header: 'No.',
			enableSorting: false,
			enableColumnFilter: false,
		}),
		columnHelper.accessor('files_name', {
			header: 'Invoice',
			enableSorting: false,
			enableColumnFilter: false,
			cell: ({ getValue }) => (
				<div className="bold-text">
					<TruncatedCell content={getValue()} maxLength={25} />
				</div>
			),
		}),
		columnHelper.accessor('supplier', {
			header: 'Customer',
			enableSorting: false,
			enableColumnFilter: false,
			cell: (info) => (info.getValue() ? info.getValue() : 'Unknown'),
		}),
		columnHelper.accessor('state', {
			header: 'Status',
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
		columnHelper.accessor('invoice_date', {
			header: 'Invoice Date',
			enableSorting: true,
			enableColumnFilter: false,
			sortingFn: (rowA, rowB, columnId) => {
				const dateA = new Date(rowA.getValue(columnId));
				const dateB = new Date(rowB.getValue(columnId));
				return dateA.getTime() - dateB.getTime();
			},
			cell: ({ getValue }) => formatDate(getValue()),
		}),
		columnHelper.accessor('due_date', {
			header: 'Payment Due',
			enableSorting: true,
			enableColumnFilter: false,
			sortingFn: (rowA, rowB, columnId) => {
				const dateA = new Date(rowA.getValue(columnId));
				const dateB = new Date(rowB.getValue(columnId));
				return dateA.getTime() - dateB.getTime();
			},
			cell: ({ getValue }) => formatDate(getValue()),
		}),
		columnHelper.accessor('total', {
			header: 'Price',
			cell: ({ getValue }) => (
				<div className="bold-text">{formatPrice(getValue())}</div>
			),
			enableSorting: true,
			enableColumnFilter: false,
		}),
		columnHelper.display({
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => (
				<div className="actions-button-group">
					<Button>View</Button>
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

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		state: {
			globalFilter: searchValue,
			columnFilters,
			pagination,
		},
		onGlobalFilterChange: setSearchValue,
		onColumnFiltersChange: setColumnFilters,
		globalFilterFn: (row, columnId, filterValue) => {
			const escapedValue = filterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const searchRegex = new RegExp(escapedValue, 'i');
			return (
				searchRegex.test(row.getValue('files_name')) ||
				searchRegex.test(row.getValue('supplier'))
			);
		},
	});

	const [customPageSize, setCustomPageSize] = useState(
		table.getState().pagination.pageSize,
	);

	const renderCustomSizeChanger = () => (
		<Input
			type="number"
			value={customPageSize}
			onChange={(e) => {
				const newSize = parseInt(e.target.value, 10);
				if (newSize > 0) {
					setCustomPageSize(newSize);
					table.setPageSize(newSize);
				}
			}}
			style={{
				width: 50,
				marginLeft: 8,
				WebkitAppearance: 'none',
				MozAppearance: 'textfield',
				appearance: 'textfield',
				fontSize: 12,
			}}
		/>
	);

	const total = table.getFilteredRowModel().rows.length;
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const start = pageIndex * pageSize + 1;
	const end = Math.min((pageIndex + 1) * pageSize, total);

	const handleInvoiceDateChange = (date, dateString) => {
		// console.log('Selected date:', dateString);
		setSelectedDate(dateString);
		table.getColumn('invoice_date').setFilterValue(dateString);
	};

	const handleDueDateChange = (date, dateString) => {
		// console.log('Selected date:', dateString);
		setSelectedDueDate(dateString);
		table.getColumn('due_date').setFilterValue(dateString);
	};

	const handleStateChange = (value) => {
		setSelectedState(value);
		table.getColumn('state').setFilterValue(value);
	};
	return (
		<div className="table-container">
			<div className="search-bar">
				<div className="primary-search">
					<Input
						placeholder="Search anything..."
						prefix={
							<SearchOutlined
								style={{
									color: 'rgba(0,0,0,.25)',
								}}
							/>
						}
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="search-input"
					/>
				</div>
				<div className="second-search">
					<DatePicker
						onChange={handleInvoiceDateChange}
						className="date-picker"
						placeholder="Invoice Date"
					/>
					<DatePicker
						onChange={handleDueDateChange}
						className="date-picker"
						placeholder="Payment Due"
					/>
					<Select
						placeholder="Status"
						mode="multiple"
						tagRender={tagRender}
						options={[
							{
								value: 'Success',
								label: 'Success',
							},
							{
								value: 'Rejected',
								label: 'Rejected',
							},
							{
								value: 'Unvalidated',
								label: 'Unvalidated',
							},
						]}
						onChange={handleStateChange}
						className="state-select"
					/>
				</div>
			</div>
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
										style={{ display: 'flex', flexDirection: 'column' }}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
										{header.column.getIsSorted() &&
											(header.column.getIsSorted() === 'asc' ? '🔽' : '🔼')}
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
