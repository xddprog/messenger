import { SendOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import { useEffect, useState } from "react";
import ChatMessage from "../../../components/cards/ChatMessage.jsx";
import InputWithIEmoji from "../../../components/inputs/InputWithIEmoji.jsx";
import ChatHeader from "../../../components/menu/ChatHeader.jsx";
import UserChatsMenu from "../../../components/menu/UserChatsMenu.jsx";
import { getChatMessages } from "../../../requests/api/chats.js";
import { getUserChats } from "../../../requests/api/users.js";


function Chat({ chat, ws }) {
    const [messageValue, setMessageValue] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getChatMessages(chat.id).then(response => {
            setMessages(response.data)
        })

        ws.onmessage = (event) => {
            const data = event.data
            setMessages(prevState => [...prevState, JSON.parse(data)])
            setMessageValue('')
        }
    }, []);

    function sendMessage() {
        messageValue ? ws.send(messageValue) : null
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <div style={{ width: '100%' }}>
                <ChatHeader chat={chat} />
            </div>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    marginLeft: "5%",
                    overflow: 'scroll',
                    position: 'relative'
                }}
            >
                <div style={{ position: "absolute", width: '100%', bottom: 0, maxHeight: '100%', overflow: 'scroll' }}>
                    {messages.map((message, index) => {
                        return (
                            <div
                                style={{
                                    marginBottom: '15px',
                                    maxWidth: '50%',
                                }}
                                key={index}
                            >
                                <ChatMessage message={message} key={message.id} />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <div
                    style={{
                        padding: '18px 20px 18.5px 20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                        display: 'flex',
                    }}
                >
                    <div style={{ width: '100%', marginRight: 10 }}>
                        <InputWithIEmoji minRows={1} fieldValue={messageValue} setFieldValue={setMessageValue} />
                    </div>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                        }}
                        onClick={sendMessage}
                    >
                        <SendOutlined style={{ fontSize: '20px', color: '#fff' }} />
                    </button>
                </div>
            </div>
        </div>
    )
}


export default function ChatPage() {
    const baseChat = {
        id: 'favourite',
        title: 'Избранное',
        avatar: <Avatar alt="favourites-logo" src="/images/favourites_logo.jpg" size={50} />
    }
    const [chats, setChats] = useState([baseChat]);
    const [openedChat, setOpenedChat] = useState(null)
    const [ws, setWs] = useState(null)

    useEffect(() => {
        getUserChats().then(response => {
            setChats([...chats, ...response.data])
        })
    }, []);

    function openChat(chat) {
        let user_id = localStorage.getItem("user_id");
        setOpenedChat(chat)
        setWs(
            // new WebSocket(`ws://localhost:5000/api/chats/ws/${chat.id}/${user_id}`)
            new WebSocket(`ws://localhost:8000/api/chats/ws/${chat.id}/${user_id}`)
        )
    }

    return (
        <div style={{ backgroundColor: '#17191b', borderRadius: 10, display: 'flex', height: '83%', position: 'fixed', width: '51%' }}>
            <Space direction={"vertical"} style={{ padding: '5px 0 5px 15px', width: '30%', borderRight: '1px solid rgba(255, 255, 255, 0.07)' }}>
                <UserChatsMenu chats={chats} openChat={openChat} />
            </Space>
            <div style={{ width: '70%' }}>
                {openedChat ? <Chat chat={openedChat} ws={ws} key={openedChat} /> : null}
            </div>
        </div>
    )
}