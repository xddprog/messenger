export default function formatMessagesDateTitle(date) {
    const months = [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря'
    ]
    const month = months[date.getMonth()]
    const day = String(date.getDate())
    return `${day} ${month}`;
}


export function groupMessagesByDate(messages, setFirstUnreadedMessageIndex) {
    let firstUnreadedMessageIndex = null

    return messages.reduce((acc, message, index) => {
        const date = new Date(message.created_at).toISOString().split('T')[0]

        if (!acc[date]) {
            acc[date] = [];
        }
        if (!firstUnreadedMessageIndex && message.users_who_readed.indexOf(localStorage.getItem('user_id')) === -1) {
            firstUnreadedMessageIndex = index
            setFirstUnreadedMessageIndex(index)
        }

        acc[date].push(message);
        return acc;
    }, {});
}

export function choosePlural(amount, variants) {
    let variant = 2;
    if (amount % 10 === 1 && amount % 100 !== 11) {
        variant = 0;
    } else if (amount % 10 >= 2 && amount % 10 <= 4 && (amount % 100 < 10 || amount % 100 >= 20)) {
        variant = 1; 
    }
    return `${amount} ${variants[variant]}`;
}
