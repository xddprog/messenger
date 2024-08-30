import { Button, Form, message, Modal, Typography, Upload } from 'antd';
// import EmojiPicker from 'emoji-picker-react';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { createPost } from '../../requests/posts.js';
import InputWithIEmoji from '../inputs/InputWithIEmoji.jsx';

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
		handleIsOpen(false);
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

	async function submitCreatePost() {
		try {
			const values = await form[0].validateFields();
			const formData = new FormData();

			if (values.images && values.images.fileList) {
				values.images.fileList.forEach((file) => {
					formData.append('images', file.originFileObj);
				});
			}

			formData.append('description', descriptionValue);
			formData.append('author', localStorage.getItem('user_id'));

			const res = await createPost(formData);
			if (res) {
				addPostAfterCreate(res);
				handleIsOpen(false);
				setFileList([]);
				setDescriptionValue('');
				message.success('Пост успешно создан');
			} else {
				throw new Error('Не удалось создать пост');
			}
		} catch (error) {
			console.error('Ошибка при создании поста:', error);
			message.error('Не удалось создать пост. Пожалуйста, попробуйте еще раз.');
		}
	}

	const onRemove = (file) => {
		const index = fileList.indexOf(file);
		const newFileList = fileList.slice();

		newFileList.splice(index, 1);
		setFileList(newFileList);
	};

	return (
		<>
			<Button
				type='primary'
				style={{
					width: '100%',
					marginBottom: '10px',
				}}
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
						<Upload
							fileList={fileList}
							maxCount={4}
							beforeUpload={checkFileType}
							onRemove={onRemove}
							customRequest={dummyRequest}
							onChange={(file) => setFileList(file.fileList)}
						>
							<Button icon={<UploadOutlined />}>
								Upload (Максимум 4 фото)
							</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
