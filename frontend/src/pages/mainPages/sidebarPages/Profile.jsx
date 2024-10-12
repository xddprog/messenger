import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FriendList from '../../../components/profile/FriendList.jsx';
import UserPosts from '../../../components/profile/UserPosts.jsx';
import UserProfileInfo from '../../../components/profile/UserProfileInfo.jsx';
import FollowingList from '../../../components/profile/following/FollowingList.jsx';
import Navigation from '../../../components/profile/navigation/navigation.jsx';
import { getCurrentUser } from '../../../requests/api/auth.js';
import { getOtherUser } from '../../../requests/api/users.js';
export default function Profile({ currentUserProfile, notificationWs }) {
	const [user, setUser] = useState([]);
	const { userId } = useParams()
	const [requestAddFriendIsSend, setRequestAddFriendIsSend] = useState(false)
	const [requestAddFriendIsGet, setRequestAddFriendIsGet] = useState(false)
	const [isFriend, setIsFriend] = useState(false)

	useEffect(() => {
		if (currentUserProfile) {
			getCurrentUser().then((res) => setUser(res.data));
		} else {
			getOtherUser(userId).then((res) => {
				setRequestAddFriendIsSend(res.data.request_add_friend_is_send)
				setRequestAddFriendIsGet(res.data.request_add_friend_is_get)
				setUser(res.data.current_user)
				setIsFriend(res.data.is_friend)
			});
		}
	}, [currentUserProfile, userId]);

	return (
		<>
			<UserProfileInfo 
				user={user} 
				currentUserProfile={currentUserProfile} 
				notificationWs={notificationWs} 
				requestAddFriendIsSend={requestAddFriendIsSend}
				requestAddFriendIsGet={requestAddFriendIsGet}
				setRequestAddFriendIsSend={setRequestAddFriendIsSend}
				setRequestAddFriendIsGet={setRequestAddFriendIsGet}
				isFriend={isFriend}
				setIsFriend={setIsFriend}
			/>
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
