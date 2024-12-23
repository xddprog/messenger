import { Form, Input, Modal, Typography } from "antd";
import { updateUserProfile } from "../../requests/api/users";
import UploadImages from "../ui/uploads/UploadImages";
import { useState } from "react";

export default function UpdateUserProfileInfoModal({isOpen, handleOpen, updateUserState}) {
    const [fileList, setFileList] = useState([]);
    const form = Form.useForm();

    async function handleOk(){
		try {
			const values = await form[0].validateFields();
			const formData = new FormData();
			if (values.username) {
				formData.append('username', values.username);
			}
			if (values.description) {
				formData.append('description', values.description);
			}

			if (fileList.length > 0) {
				formData.append('avatar', fileList[0].originFileObj);
			}

			await updateUserProfile(formData).then(res => updateUserState(res));
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
			okText='Save'
			cancelText='Cancel'
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
					<UploadImages fileList={fileList} setFileList={setFileList} maxCount={1} />
				</Form.Item>
			</Form>
		</Modal>
    )
}