import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const uploadFile = (file, title) => {
	const userId = localStorage.getItem('userId');
	const formData = new FormData();
	formData.append('file', file);
	formData.append('title', title);

	return axios.post(
		`${API_BASE_URL}/invoice/invoice-creation/${userId}/`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		},
	);
};
