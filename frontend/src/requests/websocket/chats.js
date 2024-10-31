export function deleteMessage(message, updatedMessages) {
    const date = new Date(message.created_at).toISOString().split('T')[0];

    if (updatedMessages[date]) {
        updatedMessages[date] = updatedMessages[date].filter(
            stateMessage => stateMessage.id !== message.id
        );

        if (updatedMessages[date].length === 0) {
            delete updatedMessages[date];
        }
    }

    return updatedMessages;
}

export function editMessage(message, updatedMessages) {
    const date = new Date(message.created_at).toISOString().split('T')[0];

    if (updatedMessages[date]) {
        updatedMessages[date] = updatedMessages[date].map(stateMessage => {
            if (stateMessage.id === message.id) {
                return message;
            }
            return stateMessage;
        });
    }

    return updatedMessages;
}

export function createMessage(message, updatedMessages) {
    console.log("create")
    const date = new Date(message.created_at).toISOString().split('T')[0];

    if (!updatedMessages[date]) {
        updatedMessages[date] = [];
    }

    updatedMessages[date].push(message);

    return updatedMessages;
}

export function readMessage(message, updatedMessages) {
    const date = new Date(message.created_at).toISOString().split('T')[0];
    
    if (updatedMessages[date]) {
        updatedMessages[date] = updatedMessages[date].map(stateMessage => {
            if (stateMessage.id === message.id) {
                return message;
            }
            return stateMessage;
        });
    }

    return updatedMessages;
}