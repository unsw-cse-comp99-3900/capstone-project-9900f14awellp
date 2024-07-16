import React from 'react';
import { ResponsiveAppBar } from '../../components/Navbar';
import { ManageTable } from '../../components/Management/ManagementTable';

import './global.css';

export default function InvoiceManagement() {
	return (
		<div>
			<ResponsiveAppBar />
			<div className="container">
				<div className="title-container">
					<div className="invoice-title">Invoice</div>
					<div className="button-group"></div>
				</div>

				<ManageTable />
			</div>
		</div>
	);
}
