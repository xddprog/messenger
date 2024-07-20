import { BookOutlined, FolderOutlined, MessageOutlined, PauseCircleOutlined, ReadOutlined, SettingOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function SaidBar() {
    const navigate = useNavigate()
    const [seelectedKey, setSelectedKey] = useState(window.location.pathname.split('/')[1])
    const menuItems = [
        {
            label: 'Профиль',
            key: 'profile',
            icon: <UserOutlined />
        },
        {
            label: 'Новости',
            key: 'posts',
            icon: <ReadOutlined />
        },
        {
            label: 'Сообщества',
            key: 'groups',
            icon: <FolderOutlined />
        },
        {
            label: 'Чаты',
            key: 'chats',
            icon: <MessageOutlined />
        },
        {
            label: 'Друзья',
            key: 'friends',
            icon: <TeamOutlined />
        },
        {
            label: 'Музыка',
            key: 'music',
            icon: <PauseCircleOutlined />
        },
        {
            label: 'Закладки',
            key: 'bookmarks',
            icon: <BookOutlined />
        },
        {
            label:'Настройки',
            key: 'settings',
            icon: <SettingOutlined />
        }
    ]

    async function clickMenuItem(item) {
        navigate(`/${item.key}`)
        setSelectedKey(item.key)
    }

    return (
        <Menu
            style={{ borderRadius: 10 }}
            items={menuItems}
            onClick={clickMenuItem}
            selectedKeys={[seelectedKey]}
        />
    )
}