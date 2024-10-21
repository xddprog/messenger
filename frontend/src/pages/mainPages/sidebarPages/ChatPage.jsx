import { Space } from "antd";
import { useEffect, useState } from "react";
import ChatWindow from "../../../components/ChatComponents/ChatWindow.jsx";
import UserChatsMenu from "../../../components/ChatComponents/UserChatsMenu.jsx";
import { getUserChats } from "../../../requests/api/users.js";


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
                <UserChatsMenu chats={chats} openChat={openChat} updateChats={updateChats} />
            </Space>
            <div className="w-[70%]">
                {openedChat && <ChatWindow chat={openedChat} />}
            </div>
        </div>
    )
}