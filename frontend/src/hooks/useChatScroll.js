import { useEffect, useRef } from "react";


export default function useChatScroll(messages, handleReadMessage, chatId) {
    useEffect(() => {
        function checkMessagesVisibility() {
            const container = document.getElementById('chat-messages-parent');
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
    
            Object.entries(messages).forEach(([date, messagesFromDate]) => {
                messagesFromDate.forEach((message) => {
                    const messageElement = document.getElementById(`message-${message.id}`);
                    if (!messageElement) return;

                    const messageRect = messageElement.getBoundingClientRect();
                    const isVisible =
                        messageRect.top >= containerRect.top &&
                        messageRect.bottom <= containerRect.bottom &&
                        messageRect.left >= containerRect.left &&
                        messageRect.right <= containerRect.right;

                    if (
                        isVisible && 
                        !message.users_who_readed.some(user => user.id === localStorage.getItem('user_id')) && 
                        message.user.id !== localStorage.getItem('user_id')
                    ) {
                        handleReadMessage(message.id);
                    }
                   
                });
            });
        }

        checkMessagesVisibility();
        const container = document.getElementById('chat-messages-parent');
        container?.addEventListener('scroll', checkMessagesVisibility);
    
        return () => container?.removeEventListener('scroll', checkMessagesVisibility);
    }, [messages, handleReadMessage, chatId]);
}