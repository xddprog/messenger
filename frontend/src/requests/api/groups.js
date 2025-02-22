import axios from "axios";
import { API_URL } from "../settings.js";


const BASE_URL = `${API_URL}/groups`;


export async function createGroup(values) {
    return await axios
        .post(`${BASE_URL}/create`, values, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'content-type': 'multipart/form-data',
            },
        })
        .then((response) => response.data);
}

export async function getGroup(groupId) {
    return await axios
        .get(`${BASE_URL}/${groupId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
        .then((response) => {            
            return response.data
        });
}

export async function updateGroup(groupId, form) {
    return await axios
        .put(`${BASE_URL}/${groupId}`, form, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'content-type': 'multipart/form-data',
            },
        })
        .then((response) => {
            return response.data
        }
    )
}

export async function joinUserToGroup(groupId) {
    return await axios
        .patch(`${BASE_URL}/${groupId}/join`, {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            }
        )
        .then((response) => response.data);
}

export async function getGroupSubscribers(groupId) {
    return await axios
        .get(`${BASE_URL}/${groupId}/subscribers`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
        .then((response) => response.data);
}

export async function  getGroupPosts(groupId) {
    return await axios 
        .get(`${BASE_URL}/${groupId}/posts`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
        .then((response) => response.data);
}

export async function createGroupPost(groupId, form) {
    return await axios
        .post(`${BASE_URL}/${groupId}/posts/create`, form, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'content-type': 'multipart/form-data',
            },
        })
        .then((response) => response.data);
}