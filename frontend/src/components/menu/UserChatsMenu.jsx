import {Avatar, Input, List} from "antd";
import CreateChatModal from "../modals/CreateChatModal";
import { useState } from "react";


export default function UserChatsMenu({chats, openChat, updateChats}) {
    const [createChatModalOpen, setCreateChatModalOpen] = useState(false);

    return (
        <List itemLayout="horizontal">
            <List.Item>
                <div className="flex items-center fixed w-[14%]">
                    <Input
                        placeholder="Найти чат"
                        className="border-t-0 border-r-0 border-l-0 rounded-none"
                        style={{backgroundColor: '#17191b'}}
                        size='middle'
                        variant="filled"
                    />
                    <CreateChatModal 
                        isOpen={createChatModalOpen} 
                        handleIsOpen={setCreateChatModalOpen} 
                        addChatAfterCreate={updateChats}
                    />
                </div>
            <List.Item className="mt-[6.5px]"/>
            </List.Item>
           <div className="h-full overflow-scroll">
                <List
                    className="h-[570px] overflow-scroll"
                    dataSource={chats}
                    renderItem={(item, index) => {
                        return (
                            <List.Item onClick={() => openChat(item)} className="cursor-pointer" key={index}>
                                <div className="flex items-center gap-3">
                                    <Avatar src={item.avatar} size={54} className="min-w-[54px] min-h-[54px]"/>
                                    <div className="flex flex-col">
                                        <p className="text-[16px] font-medium">{item.title}</p>
                                        <p className="text-[14px] text-gray-500">Example last mesage</p>
                                    </div>
                                </div>
                            </List.Item>
                        )
                    }}
                />
           </div>
        </List>
    )
}