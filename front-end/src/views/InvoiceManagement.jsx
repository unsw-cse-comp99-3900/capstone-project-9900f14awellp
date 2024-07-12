import React from 'react';
import { ResponsiveAppBar } from '../components/Navbar';
import { ManageTable } from '../components/ManageTable/Table';

export default function InvoiceManagement() {
	return (
		<div>
			<ResponsiveAppBar />
			<ManageTable />
		</div>
	);
}
