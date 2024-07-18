import React from 'react';
import { ResponsiveAppBar } from '../../components/Navbar';
import { ManageTable } from '../../components/Management/Table/ManagementTable';
import './global.css';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { Button } from 'antd';

export default function InvoiceManagement() {
	const navigate = useNavigate();
	const goCreation = () => {
		navigate('/create');
	};
	return (
		<div className="full-page">
			<ResponsiveAppBar />
			<div className="container">
				<div className="title-container">
					<div className="invoice-title">Invoices</div>
					<div className="button-group">
						<Tooltip title="Export as Excel" arrow>
							<Button className="second-button">Export</Button>
						</Tooltip>
						<Tooltip title="Print as PDF" arrow>
							<Button className="second-button">Print</Button>
						</Tooltip>
						<Tooltip title="Create a new invoice" arrow>
							<Button
								type="primary"
								onClick={goCreation}
								className="primary-button"
							>
								New Invoice
							</Button>
						</Tooltip>
					</div>
				</div>
				<div className="full-table">
					<ManageTable />
				</div>
			</div>
		</div>
	);
}
