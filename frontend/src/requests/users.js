import axios from 'axios';

const BASE_URL = 'https://messenger-oe3m.onrender.com/api/users';

export async function getUserChats() {
	return await axios
		.get(`${BASE_URL}/${localStorage.getItem('user_id')}/chats`)
		.then((response) => response);
}

export async function getUserPosts() {
	return await axios
		.get(`${BASE_URL}/${localStorage.getItem('user_id')}/posts`)
		.then((response) => response);
}

export async function getAllUsers() {
	return await axios
		.get(`${BASE_URL}/all`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			withCredentials: true,
		})
		.then((response) => console.log(response));
}

export async function searchUser(value) {
	return await axios
		.get(`${BASE_URL}/search`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
			params: { username: value },
		})
		.then((response) => response);
}

export async function updateUserProfile(value) {
	return await axios
		.put(
			`${BASE_URL}/${localStorage.getItem('user_id')}/profile/update`,
			value,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		.then((response) => response.data);
}
