import UserProfileInfo from '../../../components/profile/UserProfileInfo.jsx';
import Navigation from '../../../components/profile/navigation/navigation.jsx';
import FriendList from '../../../components/profile/FriendList.jsx';
import FollowingList from '../../../components/profile/following/FollowingList.jsx';
import UserPosts from '../../../components/profile/UserPosts.jsx';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../requests/auth.js';
export default function Profile() {
	const [user, setUser] = useState([]);
	
	useEffect(() => {
		getCurrentUser().then((res) => setUser(res.data));
	}, []);

	return (
		<>
			<UserProfileInfo user={user}/>
			<div className='grid grid-cols-[60%,40%] gap-1'>
				<div className=''>
					<Navigation />
					<UserPosts />
				</div>
				<div className=''>
					<FriendList />
					<FollowingList />
				</div>
			</div>
		</>
	);
}
