import { useEffect } from "react";
import { groupMessagesByDate } from "../components/ChatComponents/utils";
import { getChatMessages } from "../requests/api/chats";
import { createMessage, deleteMessage, editMessage, readMessage } from "../requests/websocket/chats";

export default function useChatWebsocket(chatId, setWs, setMessages, setFirstUnreadedMessageIndex) {
    useEffect(() => {
        setMessages([]);

        const webSocket = new WebSocket(`ws://localhost:8000/api/chat/ws/${chatId}/${localStorage.getItem('user_id')}`);
        setWs(webSocket);

        getChatMessages(chatId).then(response => {
            const groupedMessages = groupMessagesByDate(response.data, setFirstUnreadedMessageIndex);
            setMessages(groupedMessages);
        });

        webSocket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            
            setMessages(prevMessages => {
                if (parsedData.response_type === 'delete') {
                    return deleteMessage(parsedData.message, prevMessages);
                } else if (parsedData.response_type === 'create') {
                    if (parsedData.message.user.id == localStorage.getItem('user_id')) {
                        setFirstUnreadedMessageIndex(prev => prev + 1000000)
                    } else {
                        setFirstUnreadedMessageIndex(prev => prev + 1)
                    }
                    return createMessage(parsedData.message, prevMessages)
                } else if (parsedData.response_type === 'edit') {
                    return editMessage(parsedData.message, prevMessages);
                } else if (parsedData.response_type === 'read') {
                    return readMessage(parsedData.message, prevMessages);
                }
            })
        }

        return () => {
            webSocket.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);
}