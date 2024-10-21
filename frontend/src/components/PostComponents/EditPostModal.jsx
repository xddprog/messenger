import { Form, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import InputWithIEmoji from '../ui/inputs/InputWithIEmoji.jsx';
import UploadImages from '../ui/uploads/UploadImages.jsx';


export default function EditPostModal({
	postDescription,
	postImages,
	isOpen,
	handleIsOpen,
}) {
	const form = Form.useForm();
	const [descriptionValue, setDescriptionValue] = useState('');
	const [fileList, setFileList] = useState([]);

	useEffect(() => {
		setFileList(postImages.map((image) => ({ url: image })))
	}, [])

	useEffect(() => {
		setDescriptionValue(postDescription)
	}, [])

	function closeModal() {
		setDescriptionValue('');
		setFileList([]);
		form[0].resetFields()
		handleIsOpen(false);
	}

	async function submitEditPost() {
		try {
			const formData = new FormData();
			if (fileList.length > 0) {
				fileList.forEach((file) => {
					formData.append('images', file.originFileObj);
				});
			} else {
				formData.append('images', [null]);
			}

			formData.append('description', descriptionValue);

		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<Modal
				centered
				open={isOpen}
				onCancel={closeModal}
				width={'700px'}
				okText={'Сохранить'}
				cancelText={'Отмена'}
				onOk={submitEditPost}
			>
				<Typography.Title level={3}>Поделитесь своими мыслями</Typography.Title>
				<Form form={form[0]} name={'zxc'} onFinish={submitEditPost}>
					<Form.Item name='description' label='Описание'>
						<InputWithIEmoji
							fieldValue={descriptionValue}
							setFieldValue={setDescriptionValue}
							minRows={3}
						/>
					</Form.Item>
					<Form.Item name='images' label='Фотографии'>
						<UploadImages fileList={fileList} setFileList={setFileList} maxCount={4} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
