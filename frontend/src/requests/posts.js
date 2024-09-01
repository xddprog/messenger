import axios from 'axios';

const BASE_URL = 'https://messenger-sm6n.onrender.com/api/posts';

export async function getAllPosts() {
	return await axios.get(`${BASE_URL}/all`).then((response) => response.data);
}

export async function createPost(values) {
	return await axios
		.post(`${BASE_URL}/create`, values, {
			headers: { 'content-type': 'multipart/form-data' },
		})
		.then((response) => response.data);
}

export async function likePost(postId) {
	return await axios
		.patch(`${BASE_URL}/${postId}/like/${localStorage.getItem('user_id')}`)
		.then((response) => {
			console.log(response.data);

			response.data;
		});
}
