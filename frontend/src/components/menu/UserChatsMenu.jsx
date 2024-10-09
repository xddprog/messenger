import {Avatar, Input, List} from "antd";
import {RiChatNewLine} from "react-icons/ri";


export default function UserChatsMenu({chats, openChat}) {

    return (
        <List
            itemLayout="horizontal"
        >
            <List.Item>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'end',
                        position: 'fixed',
                    }}
                >
                    <Input
                        placeholder="Найти чат"
                        style={{
                            backgroundColor: '#17191b',
                            borderTop: 'none',
                            borderRight: 'none',
                            borderLeft: 'none',
                            borderRadius: 0
                        }}
                        size={'middle'}
                        variant={"filled"}
                    />
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                        }}
                    >
                        <RiChatNewLine
                            style={{
                                fontSize: '20px',
                                color: "#424242",
                                padding: 0,
                                margin: 0, marginLeft: 10
                            }}
                        />
                    </button>
                </div>
                    <List.Item style={{ marginTop: 6.5}}/>
            </List.Item>
           <div style={{ height: '100%', overflow: 'scroll' }}>
                <List
                    style={{ height: '570px', overflow: 'scroll' }}
                    dataSource={chats}
                    renderItem={(item, index) => {
                        return (
                            <List.Item onClick={() => openChat(item)} style={{cursor: 'pointer'}} key={index}>
                                <List.Item.Meta
                                    avatar={item.avatar}
                                    title={<p style={{margin: 0}} >{item.title}</p>}
                                    description="Example last message"
                                />
                            </List.Item>
                        )
                    }}
                />
           </div>
        </List>
    )
}