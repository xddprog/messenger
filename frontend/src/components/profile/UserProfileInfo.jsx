import { UploadOutlined } from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Form,
	Image,
	Input,
	Modal,
	Typography,
	Upload,
} from 'antd';
import { useState } from 'react';
import { updateUserProfile } from '../../requests/api/users';

export default function UserProfileInfo({ user, currentUserProfile }) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState([]);

	const handleUploadChange = ({ fileList }) => {
		setFileList(fileList);
	};
	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const addToFriends = async () => {

	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			const formData = new FormData();
			formData.append('username', values.username);
			formData.append('description', values.description);

			if (fileList.length > 0) {
				formData.append('avatar', fileList[0].originFileObj);
				console.log(true);
			}

			await updateUserProfile(formData);
		} catch (err) {
			console.error(err);
		}
		setIsModalVisible(false);
	};

	return (
		<div >
			<Card
				className='border-none'
				cover={
					<div>
						<Image
							src={user.cover}
							className='w-full rounded-xl'
						/>
					</div>
				}
			>
				<div className='flex justify-between'>
					<Card.Meta
						className='flex items-center'
						avatar={
							<Avatar
								style={{
									marginTop: '-100px',
									marginBottom: '10px',
									border: '5px solid #17191b',
								}}
								size={160}
								src={user.avatar}
								alt='profile-avatar'
							/>
						}
						title={
							<div>
								<Typography.Title level={3} style={{ margin: 0, padding: 0 }}>
									{user.username}
								</Typography.Title>
							</div>
						}
						description={
							<Typography.Paragraph style={{ fontSize: '13px' }}>
								{user.description}
							</Typography.Paragraph>
						}
					></Card.Meta>
					{currentUserProfile && <Button onClick={showModal}>Редактировать профиль</Button>}
					{!currentUserProfile && <Button type='primary' onClick={addToFriends}>Добавить в друзья</Button>}
				</div>
			</Card>
			<Modal
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText='Save'
				cancelText='Cancel'
			>
				<Typography.Title level={3}>Редактирование профиля</Typography.Title>
				<Form form={form} layout='horizontal' labelCol={{ span: 4 }}>
					<Form.Item label='Имя' name='username'>
						<Input placeholder='Введите имя' />
					</Form.Item>
					<Form.Item label='Описание' name='description'>
						<Input placeholder='Введите описание' />
					</Form.Item>
					<Form.Item label='Аватар'>
						<Upload onChange={handleUploadChange} fileList={fileList}>
							<Button icon={<UploadOutlined />}>Загрузить фото</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
