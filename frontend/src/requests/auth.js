import axios from 'axios';

const BASE_URL = 'https://cefa0520cfadf6a0.mokky.dev';

export async function registerUser(values) {
	return await axios
		.post(`${BASE_URL}/register`, values, { withCredentials: true })
		.then((response) => response);
}

export async function loginUser(values) {
	return await axios
		.post(`${BASE_URL}/auth`, values, { withCredentials: true })
		.then((response) => response);
}

export async function getCurrentUser() {
	return await axios
		.get(`${BASE_URL}/auth_me`, { withCredentials: true })
		.then((response) => response);
}

export async function logoutUser() {
	return await axios
		.post(`${BASE_URL}/logout`, { withCredentials: true })
		.then((response) => response);
}
