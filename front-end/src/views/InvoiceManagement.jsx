import React from 'react';
import { ResponsiveAppBar } from '../components/Navbar';
import { ManageTable } from '../components/Management/ManagementTable';

export default function InvoiceManagement() {
	return (
		<div>
			<ResponsiveAppBar />
			<ManageTable />
		</div>
	);
}
