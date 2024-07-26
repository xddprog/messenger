import {Card, Typography} from "antd";
import {useEffect} from "react";


export default function ChatMessage({message}) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end' }} >
            <button
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                }}
            >
                <img
                    src={message.user ? message.user.avatar ? message.user.avatar : '/images/profile_example.jpg' : ''}
                    alt=""
                    style={{width: '35px', borderRadius: 100, marginRight: '10px'}}
                />
            </button>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    borderRadius: 15,
                    backgroundColor: "#1e2022",
                }}
            >
                <div style={{ padding: "5px 12px 10px 12px" }}>
                    <Typography.Title level={5} style={{margin: 0, color: '#05d77e', fontWeight: 400}}>{message.user.username}</Typography.Title>
                    <Typography.Paragraph style={{margin: 0, fontSize: '14px'}}>{message.message}</Typography.Paragraph>
                </div>
            </div>
        </div>
    )
}