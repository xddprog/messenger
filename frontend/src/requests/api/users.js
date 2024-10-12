import axios from 'axios';
import { API_URL } from "../settings.js";

const BASE_URL = `${API_URL}/api/user`;

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

export async function addUserToFriendRequest(friendId) {
	return await axios
		.post(
			`${BASE_URL}/friends/add/${friendId}/request`,
			{ friend_id: friendId },
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
}

export async function addUserToFriendAccept(friendId) {
	return await axios
		.post(
			`${BASE_URL}/friends/add/${friendId}/accept`,
			{ friend_id: friendId },
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
}

export async function addUserToFriendRejected(friendId) {
	return await axios
		.post(
			`${BASE_URL}/friends/add/${friendId}/decline`,
			{ friend_id: friendId },
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
}


export async function removeFriend(friendId) {
	return await axios
		.delete(
			`${BASE_URL}/friends/remove/${friendId}`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
}

export async function getUserNotifications() {
	return await axios
		.get(
			`${BASE_URL}/notifications`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
}


export async function getUserUnReadedNotifications() {
	return await axios
		.get(
			`${BASE_URL}/notifications/unreaded`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			}
		)
		.then((response) => response);
}

