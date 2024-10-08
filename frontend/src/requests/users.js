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

export async function getUserPosts(userId) {
	return await axios
		.get(
			`${BASE_URL}/posts`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
				params: {
					user_id: userId ? userId : null
				}
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


export async function getUserGroups(userAdminedGroups, userId) {
	return await axios
		.get(
			`${BASE_URL}/groups`, 
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
				params: {
					user_admined_groups: userAdminedGroups,
					user_id: userId ? userId : null
				}
			}
		)
		.then((response) => response);
}

export async function getUserFriends(userId) {
	return await axios
		.get(
			`${BASE_URL}/friends/all`, 
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
				params: {
					user_id: userId ? userId : null
				}
			}
		)
		.then((response) => response);
}

export async function getOtherUser(userId) {
	return await axios
		.get(
			`${BASE_URL}/${userId}`, 
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
			},

		})
		.then((response) => response);
}