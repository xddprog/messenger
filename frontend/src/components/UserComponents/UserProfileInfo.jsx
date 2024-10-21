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
import { addUserToFriendAccept, removeFriend, updateUserProfile } from '../../requests/api/users';
import { getCurrentUser } from '../../requests/api/auth';

export default function UserProfileInfo(
	{ 
		user, 
		currentUserProfile, 
		notificationWs,
		requestAddFriendIsSend,
		requestAddFriendIsGet,
		setRequestAddFriendIsSend,
		setRequestAddFriendIsGet,
		isFriend,
		setIsFriend
	}
) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState([]);

	function handleUploadChange ({ fileList }){
		setFileList(fileList);
	}
	function showModal(){
		setIsModalVisible(true);
	}
	function handleCancel() {
		setIsModalVisible(false);
	}

	async function handleAddToFriendsRequest() {
		const currentUser = await getCurrentUser().then(res => res.data)

		notificationWs.send(JSON.stringify({
			type: 'add_friend',
			friend_id: user.id,
			notification_sender_id: currentUser.id,
			notification_sender_name: currentUser.username
		}))
	}

	async function handleAddUserToFriendAccept() {
		const currentUser = await getCurrentUser().then(res => res.data)

		await addUserToFriendAccept(user.id).then(() => {
			setRequestAddFriendIsSend(false)
			setRequestAddFriendIsGet(false)
			setIsFriend(true)
			notificationWs.send(JSON.stringify({
				type: 'add_friend_accept',
				friend_id: user.id,
				notification_sender_id: currentUser.id,
				notification_sender_name: currentUser.username
			}
			))
		})
	}


	async function handleRemoveFriend() {
		const currentUser = await getCurrentUser().then(res => res.data)

		await removeFriend(user.id).then(() => {
			setIsFriend(false)
			setRequestAddFriendIsSend(false)
			setRequestAddFriendIsGet(false)
			notificationWs.send(JSON.stringify({
				type: 'remove_friend',
				friend_id: user.id,
				notification_sender_id: currentUser.id,
				notification_sender_name: currentUser.username
			}))
		})
	}


	async function handleAddUserToFriendRejected() {
		
	}
	
	async function handleOk(){
		try {
			const values = await form.validateFields();
			const formData = new FormData();
			formData.append('username', values.username);
			formData.append('description', values.description);

			if (fileList.length > 0) {
				formData.append('avatar', fileList[0].originFileObj);
			}

			await updateUserProfile(formData);
		} catch (err) {
			console.error(err);
		}
		setIsModalVisible(false);
	}

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
					<div className='flex gap-3'>
						{currentUserProfile ? (
							<Button onClick={showModal}>Редактировать профиль</Button>
							) : (
									<>
										{(!isFriend && !requestAddFriendIsSend && !requestAddFriendIsGet) && (
											<Button type='primary' onClick={handleAddToFriendsRequest}>
												Добавить в друзья
											</Button>
										)}
										{(!isFriend && requestAddFriendIsGet) && (
											<Button onClick={handleAddUserToFriendAccept}>
												Принять заявку
											</Button>
										)}
										{isFriend && (
											<Button type='primary' onClick={handleRemoveFriend}>
												Удалить из друзей
											</Button>
										)}
									</>
								)
						}
						{!currentUserProfile && <Button>Написать</Button>}
					</div>
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
