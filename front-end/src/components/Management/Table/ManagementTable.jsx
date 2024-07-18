import React, { useEffect, useState } from 'react';

import { invoiceBasicInfo } from '../../../apis/management';
import { ActionDropdown } from '../DropdownButton/ActionDropdown';
import { Label } from './Label/Label';

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
import { DatePicker, Select, Input, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './global.css';

const defaultData = [
	{
		id: 44,
		timestamp: '2024-07-10 16:16:24',
		userid: 34,
		uuid: 'htghaqdfdgfsd',
		file: '/staticfiles/34/string.json',
		files_name: 'string',
		supplier: 'ABC company',
		total: '1367.00',
		state: 'unverified',
		payDate: '2024-07-10',
		creation_method: 'gui',
	},
	{
		id: 45,
		timestamp: '2024-07-10 16:47:19',
		userid: 34,
		uuid: 'dgrwhsehrhr',
		file: '/staticfiles/34/invoice_data.json',
		files_name: 'invoice_data',
		supplier: 'Cardiac dimensi',
		total: '1375.20',
		state: 'unverified',
		payDate: '2024-07-11',
		creation_method: 'upload',
	},
	{
		id: 46,
		timestamp: '2024-07-19 16:16:24',
		userid: 34,
		uuid: 'ssfafafweg',
		file: '/staticfiles/34/bcd.json',
		files_name: 'bcd',
		supplier: 'EFG company',
		total: '397.60',
		state: 'success',
		payDate: '2024-09-02',
		creation_method: 'gui',
	},
	{
		id: 76,
		timestamp: '2024-07-10 16:18:24',
		userid: 34,
		uuid: 'abcd123',
		file: '/staticfiles/34/bcd.json',
		files_name: 'b222',
		supplier: 'qwe company',
		total: '388.20',
		state: 'rejected',
		payDate: '2024-07-10',
		creation_method: 'gui',
	},
	{
		id: 77,
		timestamp: '2024-07-11 16:18:24',
		userid: 34,
		uuid: '123adcer',
		file: '/staticfiles/34/bcd.json',
		files_name: 'b22343',
		supplier: 'qwewe company',
		total: '382.90',
		state: 'success',
		payDate: '2024-07-30',
		creation_method: 'gui',
	},
	{
		id: 78,
		timestamp: '2024-01-11 16:18:24',
		userid: 34,
		uuid: '123adcedfsdfsdr',
		file: '/staticfiles/34/bweq.json',
		files_name: '343wqee',
		supplier: 'qwe company',
		total: '342.50',
		state: 'unverified',
		payDate: '2024-02-30',
		creation_method: 'gui',
	},
	{
		id: 79,
		timestamp: '2024-03-11 16:18:24',
		userid: 34,
		uuid: '123fasfasfgdsfdsr',
		file: '/staticfiles/34/bcde343.json',
		files_name: 'feg43',
		supplier: 'qwewe company',
		total: '582.00',
		state: 'rejected',
		payDate: '2024-04-30',
		creation_method: 'gui',
	},
	{
		id: 80,
		timestamp: '2024-05-11 16:18:24',
		userid: 34,
		uuid: '123adc32r34er',
		file: '/staticfiles/34/bcd3434.json',
		files_name: 'dgsda',
		supplier: 'qwewesafg company',
		total: '452.00',
		state: 'rejected',
		payDate: '2024-07-30',
		creation_method: 'gui',
	},
	{
		id: 80,
		timestamp: '2024-05-11 16:18:24',
		userid: 34,
		uuid: '123adc32r34er',
		file: '/staticfiles/34/bcd3434.json',
		files_name: 'dgwesda',
		supplier: 'qwewesafg company',
		total: '452.20',
		state: 'unverified',
		payDate: '2024-07-30',
		creation_method: 'gui',
	},
	{
		id: 81,
		timestamp: '2024-05-11 16:18:24',
		userid: 34,
		uuid: '123adc32r34er',
		file: '/staticfiles/34/bcd3434.json',
		files_name: 'dgwrsda',
		supplier: 'qwewesafg company',
		total: '496.80',
		state: 'unverified',
		payDate: '2024-07-30',
		creation_method: 'gui',
	},
	{
		id: 82,
		timestamp: '2023-12-11 16:18:24',
		userid: 34,
		uuid: '123adc32rsffd34er',
		file: '/staticfiles/34/bcd3434.json',
		files_name: 'dgstryda',
		supplier: 'qwewesafg company',
		total: '452',
		state: 'unverified',
		payDate: '2024-01-20',
		creation_method: 'gui',
	},
	{
		id: 83,
		timestamp: '2023-12-11 16:18:24',
		userid: 34,
		uuid: '123adc32rsffd3wrqw4er',
		file: '/staticfiles/34/bcd3434.json',
		files_name: '34tryda',
		supplier: 'qweafg company',
		total: '423.50',
		state: 'rejected',
		payDate: '2024-01-20',
		creation_method: 'gui',
	},
];

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
		header: 'State',
		enableSorting: false,
		enableColumnFilter: true,
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue || filterValue.length === 0) return true;
			return filterValue.includes(row.getValue(columnId));
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

const tagColors = {
	success: '#D5F9F0',
	rejected: '#FFD4D4',
	unverified: '#E9E9ED',
};

const textColors = {
	success: '#006D5B',
	rejected: '#C06167',
	unverified: '#344054',
};

const tagRender = (props) => {
	const { label, value, closable, onClose } = props;
	const backgroundColor = tagColors[value];
	const textColor = textColors[value];

	return (
		<Tag
			closable={closable}
			onClose={onClose}
			style={{
				marginRight: 3,
				backgroundColor: backgroundColor,
				color: textColor,
				border: 'none',
			}}
		>
			{label}
		</Tag>
	);
};

export function ManageTable() {
	const data = defaultData;
	// const [data, _setData] = React.useState([]);
	// const rerender = React.useReducer(() => ({}), {})[1];
	const [searchValue, setSearchValue] = useState('');
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedState, setSelectedState] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 8,
	});

	// useEffect(() => {
	// 	invoiceBasicInfo()
	// 		.then((response) => {
	// 			_setData(response.data);
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// }, []);

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

	const handleDateChange = (date, dateString) => {
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
					<DatePicker onChange={handleDateChange} className="date-picker" />
					<Select
						placeholder="State"
						mode="multiple"
						tagRender={tagRender}
						options={[
							{
								value: 'success',
								label: 'success',
								className: 'tag-success',
							},
							{
								value: 'rejected',
								label: 'rejected',
								className: 'tag-rejected',
							},
							{
								value: 'unverified',
								label: 'unverified',
								className: 'tag-unverified',
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
