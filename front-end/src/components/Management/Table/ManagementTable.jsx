import React, { useEffect, useState } from 'react';

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
import { DatePicker, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './global.css';

const statusMapping = {
	Failed: 'Rejected',
	unvalidated: 'Unvalidated',
	success: 'Success',
};
const reverseStatusMapping = Object.fromEntries(
	Object.entries(statusMapping).map(([key, value]) => [value, key]),
);

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
					className="check-box"
				/>
			</div>
		),

		cell: ({ row }) => (
			<div className="checkbox-container">
				<Checkbox
					checked={row.getIsSelected()}
					onChange={row.getToggleSelectedHandler()}
					className="check-box"
				/>
			</div>
		),
	}),
	columnHelper.accessor('id', {
		header: 'ID NO.',
		enableSorting: false,
		enableColumnFilter: false,
	}),
	columnHelper.accessor('files_name', {
		header: 'Invoice',
		enableSorting: false,
		enableColumnFilter: false,
	}),
	columnHelper.accessor('supplier', {
		header: 'Customer',
		enableSorting: false,
		enableColumnFilter: false,
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
	columnHelper.accessor('timestamp', {
		header: 'Created At',
		enableSorting: true,
		enableColumnFilter: false,
		sortingFn: (rowA, rowB, columnId) => {
			const dateA = new Date(rowA.getValue(columnId));
			const dateB = new Date(rowB.getValue(columnId));
			return dateA.getTime() - dateB.getTime();
		},
	}),
	columnHelper.accessor('payDate', {
		header: 'Payment Due',
		enableSorting: true,
		enableColumnFilter: false,
	}),
	columnHelper.accessor('total', {
		header: 'Price',
		enableSorting: true,
		enableColumnFilter: false,
	}),
	columnHelper.display({
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => (
			<div className="actions-button-group">
				<button>View</button>
				<button>Actions</button>
			</div>
		),
	}),
];

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
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedState, setSelectedState] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 7,
	});

	useEffect(() => {
		invoiceBasicInfo()
			.then((response) => {
				_setData(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

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

	const handleCreateDateChange = (date, dateString) => {
		// console.log('Selected date:', dateString);
		setSelectedDate(dateString);
		table.getColumn('timestamp').setFilterValue(dateString);
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
						onChange={handleCreateDateChange}
						className="date-picker"
						placeholder="Select Create Date"
					/>
					<Select
						placeholder="State"
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
				<button
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}
				>
					&lt;
				</button>
				<div>
					Page{table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</div>
				<button
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}
				>
					&gt;
				</button>
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
			{/* <button onClick={() => rerender()} className="border p-2">
				Rerender
			</button> */}
			<div className="pagination-group">
				<button
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}
				>
					&lt;
				</button>
				<div>
					Page{table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</div>
				<button
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}
				>
					&gt;
				</button>
			</div>
		</div>
	);
}
