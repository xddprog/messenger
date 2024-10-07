import {
	Card,
	Avatar,
	Button,
	Modal,
	Form,
	Input,
	Upload,
	Image,
	Typography,
} from 'antd';
import { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { getCurrentUser } from '../../requests/auth';
import { updateUserProfile } from '../../requests/users';

export default function UserProfileInfo() {
	const [user, setUser] = useState({});
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

	useEffect(() => {
		try {
			getCurrentUser().then((res) => {
				setUser(res.data);
			});
		} catch (error) {
			console.error(error);
		}
	}, [isModalVisible]);
	return (
		<div >
			<Card
				className='border-none'
				cover={
					<div>
						<Image
							src='https://storage.yandexcloud.net/mago-storage/base_files/base-profile-cover.jpeg'
							className='w-full'
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
					<Button onClick={showModal}>Редактировать профиль</Button>
				</div>
			</Card>
			<Modal
				title='Edit Profile'
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText='Save'
				cancelText='Cancel'
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Name' name='username'>
						<Input placeholder='Enter your name' />
					</Form.Item>
					<Form.Item label='Description' name='description'>
						<Input placeholder='Enter a description' />
					</Form.Item>
					<Form.Item label='Change Profile Picture'>
						<Upload onChange={handleUploadChange} fileList={fileList}>
							<Button icon={<UploadOutlined />}>Upload New Picture</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
