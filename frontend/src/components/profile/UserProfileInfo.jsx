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
export default function UserProfileInfo() {
	const [user, setUser] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	// useEffect(() => {
	// 	getCurrentUser()
	// 		.then((response) => {
	// 			console.log(response);
	// 			setUser(response.data);
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 		});
	// });
	return (
		<div className=''>
			<Card
				cover={
					<div>
						<Image
							src='https://storage.yandexcloud.net/mago-storage/base_files/base-profile-cover.jpeg'
							style={{ width: '100%' }}
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
								src=''
								alt='profile-avatar'
							/>
						}
						title={
							<div>
								<Typography.Title
									level={3}
									style={{ margin: 0, padding: 0 }}
								></Typography.Title>
							</div>
						}
						description={
							<Typography.Paragraph
								style={{ fontSize: '13px' }}
							></Typography.Paragraph>
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
				<Form layout='vertical'>
					<Form.Item label='Name'>
						<Input placeholder='Enter your name' />
					</Form.Item>
					<Form.Item label='Description'>
						<Input placeholder='Enter a description' />
					</Form.Item>
					<Form.Item label='Change Profile Picture'>
						<Upload>
							<Button icon={<UploadOutlined />}>Upload New Picture</Button>
						</Upload>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
