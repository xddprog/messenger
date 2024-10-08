import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, Typography, Upload } from 'antd';
import { useState } from 'react';
import { createGroup } from '../../requests/api/groups';
import InputWithIEmoji from '../inputs/InputWithIEmoji';

function CreateGroupModal({ isOpen, handleIsOpen, addGroupAfterCreate }) {
    const form = Form.useForm();
    const [descriptionValue, setDescriptionValue] = useState('');
    const [fileList, setFileList] = useState([]);
    const tagOptions = [
        {
            value: 'Футбол',
            label: 'Футбол'
        },
        {
            value: 'Хоккей',
            label: 'Хоккей'
        },
        {
            value: 'Баскетбол',
            label: 'Баскетбол'
        },
        {
            value: 'Волейбол',
            label: 'Волейбол'
        },
        {
            value: 'Программирование',
            label: 'Программирование'
        },
        {
            value: 'Математика',
            label: 'Математика'
        },
        {
            value: 'Музыка',
            label: 'Музыка'
        },
        {
            value: 'Английский',
            label: 'Английский'
        },
    ]
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    function closeModal() {
        setDescriptionValue('');
        setFileList([]);
        handleIsOpen(false);
        form[0].resetFields()
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

    function onRemove(file) {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();

        newFileList.splice(index, 1);
        setFileList(newFileList);
    }


    async function submitCreateGroup() {
        try {
            const formData = new FormData();
            const values = await form[0].validateFields();

            if (fileList.length > 0) {
                formData.append('avatar', fileList[0].originFileObj);
            } else {
                formData.append('avatar', [null]);
            }

            formData.append('title', values.title);
            formData.append('description', descriptionValue);
            formData.append('tags', values.tags)

            await createGroup(formData).then(res => {
                addGroupAfterCreate(res)
                closeModal()
            });
        } catch (error) {
            console.error(error);
        }
    }

    function openModal() {
        handleIsOpen(true);
    }

    return (
        <div>
            <Button type='primary' onClick={openModal}>Создать сообщество </Button>
            <Modal
                centered
                open={isOpen}
                onCancel={closeModal}
                width={'700px'}
                okText={'Создать'}
                cancelText={'Отмена'}
                onOk={submitCreateGroup}
            >
                <Typography.Title level={3}>Создай свой личный блог!</Typography.Title>
                <Form form={form[0]} onFinish={submitCreateGroup} {...layout}>
                    <Form.Item
                        name='title'
                        label='Название'
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, введите название сообщества',
                            },
                        ]}
                    >
                        <Input placeholder='Введите название' />
                    </Form.Item>
                    <Form.Item
                        name='title'
                        label='Описание'
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, введите описание сообщества'
                            }
                        ]}
                    >
                        <InputWithIEmoji
                            fieldValue={descriptionValue}
                            setFieldValue={setDescriptionValue}
                            minRows={3}
                        />
                    </Form.Item>
                    <Form.Item name='tags' label='Теги' wrapperCol={{ span: 10 }}>
                        <Select mode='multiple' options={tagOptions} />
                    </Form.Item>
                    <Form.Item name='avatar' label='Аватар' >
                        <Upload
                            fileList={fileList}
                            maxCount={1}
                            beforeUpload={checkFileType}
                            onRemove={onRemove}
                            customRequest={dummyRequest}
                            onChange={(file) => setFileList(file.fileList)}
                        >
                            <Button icon={<UploadOutlined />}>
                                Загрузить фото
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CreateGroupModal;