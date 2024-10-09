import axios from "axios";
import { API_URL } from "../settings.js";


const BASE_URL = `${API_URL}/api/groups`;


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