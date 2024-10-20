import axios from "axios";
import { API_URL} from "../settings.js";


const BASE_URL = `${API_URL}/api/chat`


export async function getChatMessages(chatId) {
    return await axios.get(
        `${BASE_URL}/${chatId}/messages/0`,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }
    ).then(response => response);
}

export async function createChat(values) {
    return await axios.post(
        `${BASE_URL}`,
        values,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                "content-type": "multipart/form-data"
            },
        }
    )
}

export async function deleteMessage(chatId, messageId) {
    return await axios.delete(
        `${BASE_URL}/${chatId}/messages/${messageId}`,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }
    )
}

export async function editMessage(chatId, messageId, values) {
    return await axios.put(
        `${BASE_URL}/${chatId}/messages/${messageId}`,
        values,
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        }
    )
}
