import axios from 'axios';
import { API_URL} from "../settings.js";

const BASE_URL = `${API_URL}/api/auth`;


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
	localStorage.removeItem('token');
	return await axios
		.delete(`${BASE_URL}/logout`)
		.then((response) => response);
}


export async function getCities(input) {
	return await axios
		.get(`${BASE_URL}/cities`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			params: {
				city: input
			}
	}).then((response) => response.data);
}