import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FriendList from '../../../components/profile/FriendList.jsx';
import UserPosts from '../../../components/profile/UserPosts.jsx';
import UserProfileInfo from '../../../components/profile/UserProfileInfo.jsx';
import FollowingList from '../../../components/profile/following/FollowingList.jsx';
import Navigation from '../../../components/profile/navigation/navigation.jsx';
import { getCurrentUser } from '../../../requests/api/auth.js';
import { getOtherUser } from '../../../requests/api/users.js';
export default function Profile({ currentUserProfile }) {
	const [user, setUser] = useState([]);
	const { userId } = useParams()

	useEffect(() => {
		if (currentUserProfile) {
			getCurrentUser().then((res) => setUser(res.data));
		} else {
			getOtherUser(userId).then((res) => setUser(res.data));
		}
	}, [currentUserProfile, userId]);

	return (
		<>
			<UserProfileInfo user={user} currentUserProfile={currentUserProfile} />
			<div className='grid grid-cols-[60%,40%] gap-1'>
				<div className=''>
					<Navigation user={user} currentUserProfile={currentUserProfile} />
					<UserPosts currentUserProfile={currentUserProfile} userId={userId} />
				</div>
				<div className=''>
					<FriendList currentUserProfile={currentUserProfile} userId={userId} />
					<FollowingList currentUserProfile={currentUserProfile} userId={userId} />
				</div>
			</div>
		</>
	);
}
