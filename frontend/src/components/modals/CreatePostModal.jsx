import { Button, Form, Image, message, Modal, Typography, Upload } from 'antd';
import { useState } from 'react';
import { createPost } from '../../requests/api/posts.js';
import InputWithIEmoji from '../inputs/InputWithIEmoji.jsx';
import UploadImages from '../ui/upload/UploadImages.jsx';


export default function CreatePostModal({
	isOpen,
	handleIsOpen,
	addPostAfterCreate,
}) {
	const form = Form.useForm();
	const [descriptionValue, setDescriptionValue] = useState('');
	const [fileList, setFileList] = useState([]);

	function closeModal() {
		setDescriptionValue('');
		setFileList([]);
		form[0].resetFields()
		handleIsOpen(false);
	}

	async function submitCreatePost() {
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
			await createPost(formData).then((res) => {
				addPostAfterCreate(res)
				closeModal()
			});


		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<Button
				type='primary'
				className='w-full mb-3'
				size={'large'}
				onClick={() => handleIsOpen(true)}
			>
				Выложить пост
			</Button>
			<Modal
				centered
				open={isOpen}
				onCancel={closeModal}
				width={'700px'}
				okText={'Создать'}
				cancelText={'Отмена'}
				onOk={submitCreatePost}
			>
				<Typography.Title level={3}>Поделитесь своими мыслями</Typography.Title>
				<Form form={form[0]} name={'zxc'} onFinish={submitCreatePost}>
					<Form.Item name='description' label='Описание'>
						<InputWithIEmoji
							fieldValue={descriptionValue}
							setFieldValue={setDescriptionValue}
							minRows={3}
						/>
					</Form.Item>
					<Form.Item name='images' label='Фотографии'>
						<UploadImages fileList={fileList} setFileList={setFileList} maxCount={4}/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
