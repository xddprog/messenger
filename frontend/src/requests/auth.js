import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/auth';

export async function registerUser(values) {
	return await axios
		.post(`${BASE_URL}/register`, values, { withCredentials: true })
		.then((response) => response);
}

export async function loginUser(values) {
	return await axios
		.post(`${BASE_URL}/login`, values, { withCredentials: true })
		.then((response) => response);
}

export async function getCurrentUser() {
	return await axios
		.get(`${BASE_URL}/current_user`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		})
		.then((response) => response);
}

export async function logoutUser() {
	return await axios
		.delete(`${BASE_URL}/logout`, { withCredentials: true })
		.then((response) => response);
}
