import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/user';

export async function getUserChats() {
	return await axios
		.get(
			`${BASE_URL}/chats`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
}

export async function getUserPosts() {
	return await axios
		.get(
			`${BASE_URL}/posts`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
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
			`${BASE_URL}/`,
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


export async function getUserGroups(userAdminedGroups) {
	return await axios
		.get(
			`${BASE_URL}/groups?user_admined_groups=${userAdminedGroups}`, 
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
			},

		})
		.then((response) => response);
}

export async function getUserFriends() {
	return await axios
		.get(
			`${BASE_URL}/friends/all`, 
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
			},

		})
		.then((response) => response);
}