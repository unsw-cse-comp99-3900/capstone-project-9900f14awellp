import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export function ActionDropdown({ row }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleAction = (action) => {
		console.log(`Performing ${action} on row ${row.id}`);
		handleClose();
	};

	return (
		<div>
			<Button
				aria-controls={open ? 'action-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
			>
				Actions
			</Button>
			<Menu
				id="action-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={() => handleAction('validate')}>Validate</MenuItem>
				<MenuItem onClick={() => handleAction('send')}>Send</MenuItem>
				<MenuItem onClick={() => handleAction('print')}>Print</MenuItem>
			</Menu>
		</div>
	);
}
