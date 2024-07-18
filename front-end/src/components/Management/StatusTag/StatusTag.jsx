import React from 'react';
import { Tag } from 'antd';

const tagColors = {
	Success: '#D5F9F0',
	Rejected: '#FFD4D4',
	Unvalidated: '#E9E9ED',
};

const textColors = {
	Success: '#006D5B',
	Rejected: '#C06167',
	Unvalidated: '#344054',
};

const baseTagStyle = (value) => ({
	marginRight: 3,
	backgroundColor: tagColors[value],
	color: textColors[value],
	border: 'none',
});

const largerTagStyle = (value) => ({
	...baseTagStyle(value),
	fontSize: '14px',
	padding: '4px 8px',
	cursor: 'pointer',
});

export function StatusTag({ value, label }) {
	return <Tag style={largerTagStyle(value)}>{label}</Tag>;
}

export function StatusClosableTag({ value, label, closable, onClose }) {
	return (
		<Tag closable={closable} onClose={onClose} style={baseTagStyle(value)}>
			{label}
		</Tag>
	);
}
