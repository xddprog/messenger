import {Avatar, Card, Typography} from "antd";
import {useEffect} from "react";


function formatCreatedAt(value) {
    const date = new Date(value);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}


export default function ChatMessage({message}) {

    return (
        <div className="flex items-end" >
            <button className="bg-none cursor-pointer border-none p-0 mr-2">
                <Avatar src={message.user.avatar} size={32}/>
            </button>
            <div className="flex flex-col rounded-xl items-start bg-[#1e2022]" style={{scrollBehavior: 'smooth'}}>
                <div className="p-[5px_12px_10px_12px]">
                    <div className="flex justify-between items-baseline">
                        <Typography.Title level={5} style={{margin: 0, color: '#05d77e', fontWeight: 400}}>
                            {message.user.username}
                        </Typography.Title>
                        <Typography.Paragraph style={{margin: 0, marginLeft: '12px', fontSize: '12px', color: 'rgb(107 114 128 / 1' }}>
                            {formatCreatedAt(message.created_at)}
                        </Typography.Paragraph>
                    </div>
                    <Typography.Paragraph style={{margin: 0, fontSize: '14px'}}>{message.message}</Typography.Paragraph>
                </div>
            </div>
        </div>
    )
}