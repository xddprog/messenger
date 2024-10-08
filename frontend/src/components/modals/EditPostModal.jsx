import { Form, Image, message, Modal, Typography, Upload } from 'antd';
import { useEffect, useState } from 'react';
import InputWithIEmoji from '../inputs/InputWithIEmoji.jsx';

const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});


export default function EditPostModal({
    postDescription,
    postImages,
	isOpen,
	handleIsOpen,
}) {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const form = Form.useForm();
	const [descriptionValue, setDescriptionValue] = useState('');
	const [fileList, setFileList] = useState([]);

    useEffect(() => {
        setFileList(postImages.map((image) => ({url: image})))
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
