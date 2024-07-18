import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';

export const CustomAlert = ({ message, severity, onClose, duration = 3000 })=>{
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!visible) return null;

	return (
		<Alert
			severity={severity}
			onClose={() => {
				setVisible(false);
				onClose();
			}}
			style={{
				position: 'fixed',
				top: '0',
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 1000,
			}}
		>
			{message}
		</Alert>
	);
}
