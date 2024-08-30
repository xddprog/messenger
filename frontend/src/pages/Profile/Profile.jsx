import Header from '../../components/profile/header.jsx';
import Navigation from '../../components/profile/navigation/navigation.jsx';
import FriendList from '../../components/profile/FriendList.jsx';
import FollowingList from '../../components/profile/following/FollowingList.jsx';
export default function Profile() {
	return (
		<>
			<Header />
			<div className='grid grid-cols-[60%,40%] gap-1'>
				<div className=''>
					<Navigation />
				</div>
				<div className=''>
					<FriendList />
					<FollowingList />
				</div>
			</div>
		</>
	);
}
