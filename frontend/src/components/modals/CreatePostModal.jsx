import { Button, Form, Image, message, Modal, Typography, Upload } from 'antd';
import { useState } from 'react';
import { createPost } from '../../requests/posts.js';
import InputWithIEmoji from '../inputs/InputWithIEmoji.jsx';

const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});


export default function CreatePostModal({
	isOpen,
	handleIsOpen,
	addPostAfterCreate,
}) {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
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

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
		  	file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

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
						<Upload
							fileList={fileList}
							maxCount={4}
							listType="picture-card"
							beforeUpload={checkFileType}
							onRemove={onRemove}
							customRequest={dummyRequest}
							onChange={(file) => setFileList(file.fileList)}
							onPreview={handlePreview}
						>
								Загрузить (Максимум 4 фото)
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
	);
}
