import axios from "axios";


const BASE_URL = 'http://127.0.0.1:5000/api/chats'


export async function getChatMessages(chatId) {
    return await axios.get(
        `${BASE_URL}/${chatId}/messages/0`
    ).then(response => response);
}

