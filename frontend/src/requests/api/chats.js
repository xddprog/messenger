import axios from "axios";


const BASE_URL = `${API_URL}/api/chats`


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
