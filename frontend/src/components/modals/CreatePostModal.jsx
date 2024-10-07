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
		form[0].resetFields()
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
			const formData = new FormData();
			if (fileList.length > 0) {
				fileList.forEach((file) => {
					formData.append('images', file.originFileObj);
				});
			} else {
				formData.append('images', [null]);
			}

			formData.append('description', descriptionValue);
			formData.append('author', localStorage.getItem('user_id'));
			await createPost(formData).then((res) => {
				addPostAfterCreate(res)
				closeModal()
			});

			
		} catch (error) {
			console.error(error);
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
								Загрузить (Максимум 4 фото)
							</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
