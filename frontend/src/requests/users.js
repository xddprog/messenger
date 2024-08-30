import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api/users';

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
