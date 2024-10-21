import { useEffect, useState } from "react";
import { getUserFriends } from "../../requests/api/users";
import { Avatar, Typography } from "antd";
import { useNavigate } from "react-router-dom";

function FriendCard({ user, notificationWs, navigate }) {
	function handleClick() {
		if (user.id == localStorage.getItem("user_id")) {
			return navigate(`/profile`)
		}
		return navigate(
			`/users/${user.id}`,
			{
				currentUserProfile: false, 
				notificationWs: notificationWs 
			}
		)
	}

	return (
		<div
			key={user.id}
			className='flex flex-col items-center cursor-pointer '
			onClick={handleClick}
		>
			<Avatar
				src={user.avatar}
				alt='img'
				size={64}
			/>
			<p className='text-sm'>{user.username}</p>
		</div>
	)
}


export default function FriendList({userId, notificationWs}) {
	const [friends, setFriends] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		getUserFriends(userId).then((res) => setFriends(res.data));
	}, [userId]);

	return (
		<div className='border-[#383838] rounded-xl bg-[#17191b] text-white mt-2 ml-2 p-4'>
			<Typography.Title level={5}>Друзья {friends.length}</Typography.Title>
			<div className='flex flex-wrap gap-1 justify-between'>
				{friends.map((user) => (
					<FriendCard 
						key={user.id} 
						user={user} 
						notificationWs={notificationWs} 
						navigate={navigate}
					/>
				))}
			</div>
		</div>
	);
}
