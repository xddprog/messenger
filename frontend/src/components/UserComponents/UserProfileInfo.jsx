import {
	Avatar,
	Button,
	Card,
	Image,
	Typography,
} from 'antd';
import { useState } from 'react';
import { addUserToFriendAccept, removeFriend } from '../../requests/api/users';
import { getCurrentUser } from '../../requests/api/auth';
import UpdateUserProfileInfoModal from './UpdateUserProfileInfoModal';

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
		setIsFriend,
		setUser
	}
) {
	const [isModalVisible, setIsModalVisible] = useState(false);

	function showModal(){
		setIsModalVisible(true);
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
			}))
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
			<UpdateUserProfileInfoModal 
				isOpen={isModalVisible} 
				handleOpen={setIsModalVisible}
				updateUserState={setUser}
			/>
		</div>
	);
}
