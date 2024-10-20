import { CopyOutlined, DeleteOutlined, EditOutlined, PushpinOutlined, RollbackOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Card, Dropdown, Image, Input, Menu, Modal, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import InputWithIEmoji from "../inputs/InputWithIEmoji";
import { deleteMessage, editMessage } from "../../requests/api/chats";
import DeleteMessageModal from "../modals/DeleteMessageModal";

function formatCreatedAt(value) {
    const date = new Date(value);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export default function ChatMessage({ chatId, messageProp, handleDelete, ws }) {
    const [messageIsEdit, setMessageIsEdit] = useState(false);
    const [message, setMessage] = useState(messageProp);
    const [messageNewValue, setMessageNewValue] = useState(messageProp.message);
    const [messageDeleteModalIsOpen, setMessageDeleteModalIsOpen] = useState(false);
    
    const contextMenu = (
        <Menu>
            <Menu.Item key="pushpin" icon={<PushpinOutlined />}>Закрепить</Menu.Item>
            <Menu.Item key="reply" icon={<RollbackOutlined />}>Ответить</Menu.Item>
            {message.user.id === localStorage.getItem('user_id') && (
                <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => setMessageDeleteModalIsOpen(true)}>
                    Удалить
                </Menu.Item>
            )}
            {message.user.id === localStorage.getItem('user_id') && (
                <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => setMessageIsEdit(true)}>
                    Редактировать
                </Menu.Item>
            )}
            <Menu.Item key="copy" icon={<CopyOutlined />} onClick={copyMessageText}> Копировать</Menu.Item>
            <Menu.Item key="send" icon={<SendOutlined />}>Переслать</Menu.Item>
        </Menu>
    );

    useEffect(() => {
        setMessage(messageProp);
    }, [messageProp]);

    async function handleSubmitEditMessage(e) {
        const formData = new FormData();
        formData.append('message', messageNewValue);

        if (e.key === 'Enter') {
            setMessageIsEdit(false);
            if (messageNewValue !== message.message) {
                ws.send(JSON.stringify({
                    type: 'edit',
                    message_id: message.id,
                    message: messageNewValue
                }));
            }
            
        } else if (e.key === 'Escape') {
            setMessageIsEdit(false);
        }
        
    }

    function copyMessageText() {
        navigator.clipboard.writeText(message.message);
    }

    return (
        <div>
            <DeleteMessageModal 
                isOpen={messageDeleteModalIsOpen}
                handleDelete={handleDelete} 
                message={message} 
                handleIsOpen={setMessageDeleteModalIsOpen}
            />
            <Dropdown trigger={['contextMenu']} overlay={contextMenu} key={message.id}>
                <div className="flex items-end">
                    <button className="bg-none cursor-pointer border-none p-0 mr-2">
                        <Avatar src={message.user.avatar} size={32} />
                    </button>
                    <div className="flex flex-col rounded-xl items-start bg-[#1e2022]" style={{ scrollBehavior: 'smooth' }}>
                        <div >
                            <div className="flex justify-between items-center p-[5px_12px_0px_12px]">
                                <Typography.Title level={5} style={{ margin: 0, color: '#05d77e', fontWeight: 500, fontSize: '15px' }}>
                                    {message.user.username}
                                </Typography.Title>
                                <div>
                                    {message.is_edited && <Typography.Text type="secondary  " style={{ fontSize: '12px',  marginLeft: '30px' }}>Изменено</Typography.Text>}
                                    <Typography.Text type="secondary" style={{ margin: 0, fontSize: '12px', marginLeft: '5px' }}>
                                        {formatCreatedAt(message.created_at)}
                                    </Typography.Text>
                                </div>
                            </div>
                            {message.images.length !== 0 && (
                                <div className="flex flex-col gap-0.5 mt-[10px] mb-[10px]">
                                    <div className="flex gap-0.5">
                                        {message.images.slice(0, 3).map((image) => {
                                            return (
                                                <Image
                                                    src={image}
                                                    key={image}
                                                    className='border-none object-cover h-full max-h-[150px] min-h-[150px]'
                                                    width={`${
                                                        message.images.slice(0, 3).length == 1 ? 100 : 100 /  message.images.slice(0, 3).length
                                                    }%`}
                                                />
                                            )
                                        })}
                                    </div>
                                    <div className="flex gap-0.5">
                                        {message.images.slice(3, 5).map((image) => {
                                            return (
                                                <Image
                                                    src={image}
                                                    key={image}
                                                    className='border-none object-cover h-full max-h-[150px] min-h-[150px]'
                                                    width={`${
                                                        message.images.slice(3, 5).length == 1 ? 100 : 100 / message.images.slice(3, 5).length
                                                    }%`}
                                                />
                                            )
                                        })}   
                                    </div>
                                    <div >
                                        {message.images.slice(6, 8).map((image) => {
                                            return (
                                                <Image
                                                    src={image}
                                                    key={image}
                                                    className='border-none object-cover h-full max-h-[150px] min-h-[150px]'
                                                    width={`${
                                                        message.images.slice(6, 8).length == 1 ? 100 : 100 / message.images.slice(6, 8).length
                                                    }%`}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            {!messageIsEdit ? (
                                <div>
                                    <Typography.Paragraph style={{ margin: 0 }} className="pb-[10px] pl-[12px] pr-[10px] text-[14px]">
                                        {message.message}
                                    </Typography.Paragraph>
                                </div>
                                ): (
                                    <div className="p-[12px]">
                                        <InputWithIEmoji 
                                            minRows={1} 
                                            fieldValue={messageNewValue} 
                                            setFieldValue={setMessageNewValue} 
                                            enterHandler={handleSubmitEditMessage}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </Dropdown>
        </div>
    );
}
