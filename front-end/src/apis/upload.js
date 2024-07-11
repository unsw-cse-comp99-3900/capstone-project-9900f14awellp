import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/invoice';

export const uploadFile = (file, uuid) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('uuid', uuid);

	return axios.post(`${API_BASE_URL}/invoice-creation-upload/`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
};
