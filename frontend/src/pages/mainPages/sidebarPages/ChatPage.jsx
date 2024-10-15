import { SendOutlined } from "@ant-design/icons";
import { Avatar, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import ChatMessage from "../../../components/cards/ChatMessage.jsx";
import InputWithIEmoji from "../../../components/inputs/InputWithIEmoji.jsx";
import ChatHeader from "../../../components/menu/ChatHeader.jsx";
import UserChatsMenu from "../../../components/menu/UserChatsMenu.jsx";
import { getChatMessages } from "../../../requests/api/chats.js";
import { getUserChats } from "../../../requests/api/users.js";


function groupMessagesByDate(messages) {
    return messages.reduce((acc, message) => {
        const date = new Date(message.created_at).toISOString().split('T')[0]

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(message);
        return acc;
    }, {});
}


function formatMessagesDateTitle(date) {
    const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ]
    const month = months[date.getMonth()]
    const day = String(date.getDate())
    return `${day} ${month}`;
}


function Chat({ chat, ws }) {
    const [messageValue, setMessageValue] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([])
        getChatMessages(chat.id).then(response => {
            const groupedMessages = groupMessagesByDate(response.data)
            setMessages(groupedMessages)
        })
        
        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data)
            const date = new Date(newMessage.created_at)
            
            setMessages(prevMessages => {
                const updatedMessages = { ...prevMessages };

                if (!updatedMessages[date]) {
                    updatedMessages[date] = [];
                }

                updatedMessages[date].push(newMessage);

                return updatedMessages;
            });
        }

        return () => {
            ws.close()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat.id]);

    function sendMessage() {
        messageValue ? ws.send(messageValue) : null
    }

    return (
        <div className="flex flex-col justify-between items-center h-full">
            <div className="w-full">
                <ChatHeader chat={chat} />
            </div>
            <div className="w-full h-full ml-[5%] overflow-scroll relative">
            <div className="absolute w-full bottom-0 max-h-full overflow-scroll flex flex-col gap-3 ">
                {Object.entries(messages).map(([date, messagesFromDate], index) => {
                    return (
                        <div key={index}>
                            <Typography.Title level={5}>{formatMessagesDateTitle(new Date(date))}</Typography.Title>
                            <div className="flex flex-col gap-2">
                                {messagesFromDate.map((message) => (
                                    <div className="max-w-[50%]" key={index} >
                                        <ChatMessage message={message} key={message.id} />
                                    </div> 
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>
            <div className="w-full">
                <div className='flex border-solid border-t border-t-[rgba(255,255,255,0.07)] p-[18px_20px_18.5px_20px]'>
                    <div className="w-full mr-[10px]">
                        <InputWithIEmoji minRows={1} fieldValue={messageValue} setFieldValue={setMessageValue} />
                    </div>
                    <button className="bg-none border-none p-0 cursor-pointer" onClick={sendMessage}>
                        <SendOutlined className="text-[20px] text-white"/>
                    </button>
                </div>
            </div>
        </div>
    )
}


export default function ChatPage() {
    const [chats, setChats] = useState([]);
    const [openedChat, setOpenedChat] = useState(null)
    const [ws, setWs] = useState(null)

    useEffect(() => {
        getUserChats().then(response => {
            setChats([...chats, ...response.data])
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function openChat(chat) {
        let user_id = localStorage.getItem("user_id");
        setOpenedChat(chat)
        setWs(
            new WebSocket(`ws://localhost:8000/api/chat/ws/${chat.id}/${user_id}`)
        )
    }

    function updateChats(chat) {
        setChats(prevState => [chat, ...prevState])
    }

    return (
        <div className="bg-[#17191b] flex fixed w-[56%] h-[83%] rounded-xl">
            <Space 
                direction="vertical" 
                className="w-[30%] border-r-[1px] border-r-[rgba(255,255,255,0.07)] border-solid pt-1 pb-1 pr-0 pl-4"
            >
                <UserChatsMenu chats={chats} openChat={openChat} updateChats={updateChats}/>
            </Space>
            <div className="w-[70%]">
                {openedChat && <Chat chat={openedChat} ws={ws} />}
            </div>
        </div>
    )
}