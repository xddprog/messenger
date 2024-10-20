import { Avatar, Form, Image, Input, message, Modal, Select, Typography, Upload } from "antd";
import { useState } from "react";
import { RiChatNewLine } from "react-icons/ri";
import { createChat } from "../../requests/api/chats";
import { getUserFriends } from "../../requests/api/users";
import UploadImages from "../ui/upload/UploadImages";


export default function CreateChatModal({isOpen, handleIsOpen, addChatAfterCreate}) {
	const form = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [friends, setFriends] = useState([]);
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
    };

    function closeModal() {
		setFileList([]);
		form[0].resetFields()
		handleIsOpen(false);
	}

    function openModal() {
        handleIsOpen(true);
        getUserFriends().then((res) => setFriends(res.data));
    }

    async function submitCreateChat() {
        try {
            const values = await form[0].validateFields();
            const formData = new FormData();

            if (fileList.length > 0) {
				formData.append('avatar', fileList[0].originFileObj);
			}

            formData.append('title', values.title)
            if (values.users) {
                formData.append('users', values.users)
            }

            await createChat(formData).then((res) => {
                addChatAfterCreate(res.data)
                closeModal()
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex items-center">
            <RiChatNewLine className="text-[#424242] min-w-[20px] min-h-[20px] p-0 m-0 ml-5 hover:text-[#b9b9b9] cursor-pointer" onClick={openModal}/>
            <Modal
                centered
                open={isOpen}
                onOk={submitCreateChat}
                onCancel={closeModal}
                okText={'Создать'}
                cancelText={'Отмена'}
                width={'550px'}
            >
                <Typography.Title level={3}>Создать чат</Typography.Title>
                <Form form={form[0]} layout="horizontal" {...layout}>
                    <Form.Item
                        name="title"
                        label="Название"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, введите название чата',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="users" label="Пользователи" >
                        <Select 
                            mode='multiple'  
                            size="large"
                            options={friends.map(
                                (friend) =>  {return {
                                    value: friend.id,
                                    label: (
                                        <div className="flex gap-2">
                                            <Avatar src={friend.avatar} size={30} id={friend.id}/>
                                            <p>{friend.username}</p>
                                        </div>
                                    )
                                }}
                            )} 
                        />
                    </Form.Item>
                    <Form.Item name="avatar" label="Аватар" valuePropName="fileList" >
                        <UploadImages fileList={fileList} setFileList={setFileList} maxCount={1}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
} 