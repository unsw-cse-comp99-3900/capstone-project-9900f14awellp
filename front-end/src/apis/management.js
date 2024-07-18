import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/invoice';

export function invoiceBasicInfo() {
	return axios.get(`${API_BASE_URL}/invoice-info/`, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
}

export function invoiceUrl(uuid) {
	return axios.get(`${API_BASE_URL}/invoice-creation-upload`, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
}
