import * as React from 'react';

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useReactTable,
} from '@tanstack/react-table';

const defaultData = [
	{
		id: 44,
		timestamp: '2024-07-10 16:16:24',
		userid: 34,
		uuid: 'string',
		file: '/staticfiles/34/string.json',
		supplier: 'ABC company',
		total: '1367',
		state: '已通过',
		creation_method: 'gui',
	},
	{
		id: 45,
		timestamp: '2024-07-10 16:47:19',
		userid: 34,
		uuid: '00',
		file: '/staticfiles/34/invoice_data.json',
		supplier: 'Cardiac dimensi',
		total: '1375',
		state: '未验证',
		creation_method: 'upload',
	},
	{
		id: 46,
		timestamp: '2024-07-19 16:16:24',
		userid: 34,
		uuid: 'string',
		file: '/staticfiles/34/bcd.json',
		supplier: 'EFG company',
		total: '397',
		state: '已通过',
		creation_method: 'gui',
	},
	{
		id: 76,
		timestamp: '2024-07-10 16:18:24',
		userid: 34,
		uuid: 'string',
		file: '/staticfiles/34/bcd.json',
		supplier: 'qwe company',
		total: '388',
		state: '已通过',
		creation_method: 'gui',
	},
];

const columnHelper = createColumnHelper();

const columns = [
	columnHelper.accessor('id', {
		header: 'ID NO.',
		enableSorting: false,
		enableColumnFilter: false,
	}),
	columnHelper.accessor('file', {
		header: 'Invoice',
		enableSorting: false,
		enableColumnFilter: true,
	}),
	columnHelper.accessor('supplier', {
		header: 'Customer',
		enableSorting: false,
		enableColumnFilter: true,
	}),
	columnHelper.accessor('state', {
		header: 'State',
		enableSorting: false,
		enableColumnFilter: true,
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
	columnHelper.accessor('total', {
		header: 'Price',
		enableSorting: true,
		enableColumnFilter: false,
	}),
];

export function ManageTable() {
	const data = defaultData;
	// const [data, _setData] = React.useState(() => [...defaultData]);
	const rerender = React.useReducer(() => ({}), {})[1];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className="p-2">
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
										{header.column.getCanFilter() && (
											<input
												type="text"
												onChange={(e) => {
													header.column.setFilterValue(() => e.target.value);
												}}
											></input>
										)}
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
			<button onClick={() => rerender()} className="border p-2">
				Rerender
			</button>
		</div>
	);
}
