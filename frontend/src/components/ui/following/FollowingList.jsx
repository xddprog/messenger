import { useEffect, useState } from 'react';
import FollowingItem from './FollowindItem';
import { getUserGroups } from '../../../requests/api/users';
import { Typography } from 'antd';
import { getGroupSubscribers } from '../../../requests/api/groups';

export default function FollowingList({itemId, page}) {
	const [items, setItems] = useState([]);

	useEffect(() => {
		if (page == 'group') {
			getGroupSubscribers(itemId).then(res => setItems(res));
		}
		getUserGroups(false, itemId).then((res) => setItems(res));
	}, [itemId, page]);

	return (
		<div className='border-[#383838] rounded-xl bg-[#17191b] text-white mt-2 ml-2 p-4'>
			<Typography.Title level={5}>Подписки {items.length}</Typography.Title>
			{items.reverse().slice(0, 7).map((item, index) => (
				<FollowingItem
					key={index}
					name={item.title}
					description={item.description}
					src={item.avatar}
				/>
			)).sort()}
		</div>
	);
}
