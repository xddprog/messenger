import { SendOutlined } from "@ant-design/icons";
import { Empty, Space, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "../../../components/cards/ChatMessage.jsx";
import InputWithIEmoji from "../../../components/inputs/InputWithIEmoji.jsx";
import ChatHeader from "../../../components/menu/ChatHeader.jsx";
import UserChatsMenu from "../../../components/menu/UserChatsMenu.jsx";
import { deleteMessage, getChatMessages } from "../../../requests/api/chats.js";
import { getUserChats } from "../../../requests/api/users.js";
import SendImagesMessageModal from "../../../components/modals/SendImagesMessageModal.jsx";


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


function Chat({ chat }) {
    const [messageValue, setMessageValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [sendImagesModalIsOpen, setSendImagesModalIsOpen] = useState(false);
    const ref = useChatScroll(messages)
    const [ws, setWs] = useState(null)

    useEffect(() => {
        setMessages([]);
        const webSocket = new WebSocket(`ws://localhost:8000/api/chat/ws/${chat.id}/${localStorage.getItem('user_id')}`);
        setWs(webSocket);
    
        getChatMessages(chat.id).then(response => {
            const groupedMessages = groupMessagesByDate(response.data);
            setMessages(groupedMessages);
        });
    
        webSocket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
    
            if (parsedData.response_type === 'delete') {
                setMessages(prevMessages => {
                    const date = new Date(parsedData.created_at).toISOString().split('T')[0];
                    const updatedMessages = { ...prevMessages };
    
                    if (updatedMessages[date]) {
                        updatedMessages[date] = updatedMessages[date].filter(
                            stateMessage => stateMessage.id !== parsedData.id
                        );
    
                        if (updatedMessages[date].length === 0) {
                            delete updatedMessages[date];
                        }
                    }
    
                    return updatedMessages;
                });
            } else if (parsedData.response_type === 'create') {
                const newMessage = parsedData;
                const date = new Date(newMessage.created_at).toISOString().split('T')[0];
    
                setMessages(prevMessages => {
                    const updatedMessages = { ...prevMessages };
    
                    if (!updatedMessages[date]) {
                        updatedMessages[date] = [];
                    }
    
                    updatedMessages[date].push(newMessage.message);
    
                    return updatedMessages;
                });
            } else if (parsedData.response_type === 'edit') {
                const date = new Date(parsedData.message.created_at).toISOString().split('T')[0];
    
                setMessages(prevMessages => {
                    const updatedMessages = { ...prevMessages };
    
                    if (updatedMessages[date]) {
                        updatedMessages[date] = updatedMessages[date].map(stateMessage => {
                            if (stateMessage.id === parsedData.message.id) {
                                return parsedData.message;
                            }
                            return stateMessage;
                        });
                    }
    
                    return updatedMessages;
                });
            }
        };
        console.log(messages)
        // Clean up the WebSocket connection when the component unmounts or chat ID changes
        return () => {
            webSocket.close();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat.id]);
    
    function useChatScroll(dep){
        const ref = useRef();   
        useEffect(() => {
            if (ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, [dep]);
        return ref;
      }
      

    function sendMessage() {
        messageValue.trim() ? ws.send(JSON.stringify({ message: messageValue, type: 'create' })) : null
        setMessageValue('')
    }

    async function handleDeleteMessage(message) {
        ws.send(JSON.stringify({
            type: 'delete',
            message_id: message.id
        }))
    }

    return (
        <div className="flex flex-col justify-between items-center h-full">
            <div className="w-full r">
                <ChatHeader chat={chat} />
            </div>
            <div className="w-full h-full ml-[5%] relative">
                <div className="absolute w-full -bottom-4 max-h-full overflow-x-scroll flex flex-col gap-3" ref={ref}>
                    {Object.keys(messages).length == 0 ? (<Empty description="Нет сообщений" className="mb-[38%]"/>) : 
                        Object.entries(messages).map(([date, messagesFromDate], index) => {
                            return (
                                <div key={index}>
                                    <div className="rounded-xl bg-[#1e2022] max-w-[130px] mx-auto">
                                        <Typography.Paragraph className="text-white text-sm text-center p-1 mt-2">
                                            {formatMessagesDateTitle(new Date(date))}
                                        </Typography.Paragraph>
                                    </div>
                                    <div className="flex flex-col">
                                        {messagesFromDate.map((message) => (
                                            <div className="max-w-[80%] mb-3" key={index} >
                                                <ChatMessage 
                                                    messageProp={message} 
                                                    chatId={chat.id} 
                                                    key={message.id} 
                                                    handleDelete={handleDeleteMessage}
                                                    ws={ws}
                                                />
                                            </div> 
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
            <div className="w-full z-1">
                <div className='flex border-solid border-t border-t-[rgba(255,255,255,0.07)] p-[18px_20px_18.5px_20px] items-center'>
                    <SendImagesMessageModal isOpen={sendImagesModalIsOpen} handleIsOpen={setSendImagesModalIsOpen} ws={ws}/>
                    <div className="w-full mr-[10px] hover:text-[#b9b9b9]">
                        <InputWithIEmoji minRows={1} fieldValue={messageValue} setFieldValue={setMessageValue} />
                    </div>
                    <SendOutlined 
                        className="text-[20px] text-white cursor-pointer hover:text-[#b9b9b9]" 
                        onClick={sendMessage}
                    />
                </div>
            </div>
        </div>
    )
}


export default function ChatPage() {
    const [chats, setChats] = useState([]);
    const [openedChat, setOpenedChat] = useState(null)

    useEffect(() => {
        getUserChats().then(response => {
            setChats([...chats, ...response.data])
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function openChat(chat) {
        setOpenedChat(chat)        
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
                {openedChat && <Chat chat={openedChat}/>}
            </div>
        </div>
    )
}