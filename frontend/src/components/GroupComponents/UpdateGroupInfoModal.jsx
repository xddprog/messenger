import { Form, Input, Modal, Typography } from "antd";
import UploadImages from "../ui/uploads/UploadImages";
import { useState } from "react";
import { updateGroup } from "../../requests/api/groups";

export default function UpdateGroupInfoModal({groupId, isOpen, handleOpen, updateGroupState}) {
    const [fileList, setFileList] = useState([]);
    const form = Form.useForm();

    async function handleOk(){
		try {
			const values = await form[0].validateFields();
			const formData = new FormData();
			formData.append('title', values.username);
			formData.append('description', values.description);

			if (fileList.length > 0) {
				formData.append('avatar', fileList[0].originFileObj);
			}

			await updateGroup(groupId, formData).then(res => updateGroupState(res));
		} catch (err) {
			console.error(err);
		}
		handleOpen(false);
	}

    function handleCancel() {
        handleOpen(false);
    }

    return (
        <Modal
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Сохранить'
            cancelText='Отменить'
        >
            <Typography.Title level={3}>Редактирование профиля</Typography.Title>
            <Form form={form[0]} layout='horizontal' labelCol={{ span: 4 }}>
                <Form.Item label='Имя' name='username'>
                    <Input placeholder='Введите имя' />
                </Form.Item>
                <Form.Item label='Описание' name='description'>
                    <Input placeholder='Введите описание' />
                </Form.Item>
                <Form.Item label='Аватар'>
                    <UploadImages fileList={fileList} setFileList={setFileList} />
                </Form.Item>
            </Form>
        </Modal>
    )
}