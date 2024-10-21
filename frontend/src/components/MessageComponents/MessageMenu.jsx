import { CopyOutlined, DeleteOutlined, EditOutlined, PushpinOutlined, RollbackOutlined, SendOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';

function MessageMenu({ message, setMessageDeleteModalIsOpen, setMessageIsEdit, copyMessageText }) {
    return (
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
};

export default MessageMenu;