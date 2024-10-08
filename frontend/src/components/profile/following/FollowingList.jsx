import { useEffect, useState } from 'react';
import FollowingItem from './FollowindItem';
import { getUserGroups } from '../../../requests/api/users';
import { Typography } from 'antd';

export default function FollowingList({userId}) {
	const [userGroups, setUserGroups] = useState([]);

	useEffect(() => {
		getUserGroups(false, userId).then((res) => setUserGroups(res.data));
	}, [userId]);

	return (
		<div className='border-[#383838] rounded-xl bg-[#17191b] text-white mt-2 ml-2 p-4'>
			<Typography.Title level={5}>Подписки {userGroups.length}</Typography.Title>
			{userGroups.reverse().slice(0, 7).map((item, index) => (
				<FollowingItem
					key={index}
					name={item.title}
					description={item.description}
					src={item.avatar}
				/>
			))}
		</div>
	);
}
