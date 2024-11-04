import axios from 'axios';
import { API_URL } from '../settings.js';

const BASE_URL = `${API_URL}/api/posts`;

export async function getAllPosts() {
	return await axios
		.get(`${BASE_URL}/all`, {
			headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
		})
		.then((response) => response.data);
}

export async function createPost(values) {
	return await axios
		.post(`${BASE_URL}/create`, values, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
				'content-type': 'multipart/form-data',
			},
		})
		.then((response) => response.data);
}

export async function likePost(postId) {
	return await axios
		.patch(
			`${BASE_URL}/${postId}/like`,
			{},
			{
				headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
			}
		)
		.then((response) => {
			response.data;
		});
}

export async function deletePost(postId) {
	return await axios
		.delete(`${BASE_URL}/${postId}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
			},
		})
		.then((response) => response.data);
}

export async function getPostComments(postId) {
	return await axios
		.get(`${BASE_URL}/${postId}/comments`, {
			headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
		})
		.then((response) => response.data);
}

export async function AddCommentToPost(postId, currentText, images) {
	const formData = new FormData();
	formData.append('text', currentText);

	if (images && images.length > 0) {
		images.forEach((file) => {
			formData.append('images', file.originFileObj);
		});
	}

	return await axios
		.post(`${BASE_URL}${postId}/comments/add`, formData, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((response) => {
			return response.data;
		});
}
