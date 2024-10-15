import { Avatar, Form, Image, Input, message, Modal, Select, Typography, Upload } from "antd";
import { useState } from "react";
import { RiChatNewLine } from "react-icons/ri";
import { createChat } from "../../requests/api/chats";
import { getUserFriends } from "../../requests/api/users";

const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

export default function CreateChatModal({isOpen, handleIsOpen, addChatAfterCreate}) {
    const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
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

    function checkFileType(file) {
		const isImage =
			file.type === 'image/png' ||
			file.type === 'image/jpeg' ||
			file.type === 'image/jpg';
		if (!isImage) {
			message.error(`${file.name} не является фотографией`);
		}
		return isImage || Upload.LIST_IGNORE;
	}

	const dummyRequest = ({ onSuccess }) => {
		setTimeout(() => {
			onSuccess('ok');
		}, 0);
	};
    const onRemove = (file) => {
		const index = fileList.indexOf(file);
		const newFileList = fileList.slice();

		newFileList.splice(index, 1);
		setFileList(newFileList);
	};

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};
    
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
        <>
            <button className="bg-none border-none cursor-pointer p-0" onClick={openModal}>
                <RiChatNewLine className="text-[#424242] text-[20px] p-0 m-0 ml-5" />
            </button>
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
                        <Upload
							fileList={fileList}
							maxCount={1}
							listType="picture-card"
							beforeUpload={checkFileType}
							onRemove={onRemove}
							customRequest={dummyRequest}
							onChange={(file) => setFileList(file.fileList)}
							onPreview={handlePreview}
						>
                            Загрузить фото
                        </Upload>
                        {previewImage && (
							<Image
								wrapperStyle={{
									display: 'none',
								}}
								preview={{
									visible: previewOpen,
									onVisibleChange: (visible) => setPreviewOpen(visible),
									afterOpenChange: (visible) => !visible && setPreviewImage(''),
								}}
								src={previewImage}
							/>
						)}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
} 