import { SendOutlined } from "@ant-design/icons";
import SendImagesMessageModal from "../MessageComponents/SendImagesMessageModal";
import InputWithIEmoji from "../ui/inputs/InputWithIEmoji";
import { Empty, Typography } from "antd";
import { useEffect, useState } from "react";
import formatMessagesDateTitle from "./utils";
import ChatHeader from "./ChatHeader";
import MessageCard from "../MessageComponents/MessageCard";
import useChatWebsocket from "../../hooks/useChatWebsocket";


export default function ChatWindow({ chat }) {
    const [messageValue, setMessageValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [sendImagesModalIsOpen, setSendImagesModalIsOpen] = useState(false);
    const [ws, setWs] = useState(null)
    const [firstUnreadedMessageIndex, setFirstUnreadedMessageIndex] = useState(null)

    useChatWebsocket(chat.id, setWs, setMessages, setFirstUnreadedMessageIndex);

    function sendMessage() {
        messageValue.trim() && ws.send(JSON.stringify({ message: messageValue, type: 'create' }))
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
                <div className="absolute w-full -bottom-4 max-h-full overflow-x-scroll flex flex-col gap-3">
                    {Object.keys(messages).length == 0 ? (<Empty description="Нет сообщений" className="mb-[38%]" />) :
                        Object.entries(messages).map(([date, messagesFromDate], index) => {
                            return (
                                <div key={index}>
                                    <div className="rounded-xl bg-[#1e2022] max-w-[130px] mx-auto">
                                        <Typography.Paragraph className="text-white text-sm text-center p-1 mt-2">
                                            {formatMessagesDateTitle(new Date(date))}
                                        </Typography.Paragraph>
                                    </div>
                                    <div className="flex flex-col">
                                        {messagesFromDate.map((message, messageIndex) => (
                                            <div key={message.id}>
                                                {messageIndex * (index + 1) == firstUnreadedMessageIndex && (
                                                    <div className="rounded-xl bg-[#1e2022] max-w-[220px] mx-auto">
                                                        <Typography.Paragraph className="text-white text-sm text-center p-1 mt-2">
                                                            Непрочитанные сообщения
                                                        </Typography.Paragraph>
                                                    </div>
                                                )}
                                                <div className="max-w-[80%] mb-3" key={messageIndex * (index + 1)}>
                                                    <MessageCard
                                                        messageProp={message}
                                                        chatId={chat.id}
                                                        key={message.id}
                                                        handleDelete={handleDeleteMessage}
                                                        ws={ws}
                                                    />
                                                </div>
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
                    <SendImagesMessageModal isOpen={sendImagesModalIsOpen} handleIsOpen={setSendImagesModalIsOpen} ws={ws} />
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
