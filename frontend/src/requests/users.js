import axios from 'axios';

const BASE_URL = 'https://messenger-sm6n.onrender.com/api/users';

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
		.get(`${BASE_URL}/all`, { withCredentials: true })
		.then((response) => console.log(response));
}
