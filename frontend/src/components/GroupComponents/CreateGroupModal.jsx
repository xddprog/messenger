import { Button, Form, Input, Modal, Select, Typography } from 'antd';
import { useState } from 'react';
import { createGroup } from '../../requests/api/groups';
import InputWithIEmoji from '../ui/inputs/InputWithIEmoji';
import UploadImages from '../ui/uploads/UploadImages';

function CreateGroupModal({ isOpen, handleIsOpen, addGroupAfterCreate }) {
    const form = Form.useForm();
    const [descriptionValue, setDescriptionValue] = useState('');
    const [fileList, setFileList] = useState([]);
    const tagOptions = []
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
                        <UploadImages fileList={fileList} setFileList={setFileList} maxCount={1} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CreateGroupModal;