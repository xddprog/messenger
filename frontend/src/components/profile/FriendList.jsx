import { useEffect, useState } from "react";
import { getUserFriends } from "../../requests/api/users";
import { Avatar, Typography } from "antd";

export default function FriendList({userId}) {
	const [friends, setFriends] = useState([]);

	useEffect(() => {
		getUserFriends(userId).then((res) => setFriends(res.data));
	}, [userId]);

	return (
		<div className='border-[#383838] rounded-xl bg-[#17191b] text-white mt-2 ml-2 p-4'>
			<Typography.Title level={5}>Друзья {friends.length}</Typography.Title>
			<div className='flex flex-wrap gap-1 justify-between'>
				{friends.map((user) => (
					<div
						key={user.id}
						className='flex flex-col items-center cursor-pointer '
					>
						<Avatar
							src={user.avatar}
							alt='img'
							size={64}
						/>
						<p className='text-sm'>{user.username}</p>
					</div>
				))}
			</div>
		</div>
	);
}
