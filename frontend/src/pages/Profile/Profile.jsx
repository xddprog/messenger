import Header from '../../components/profile/header.jsx';
import Navigation from '../../components/profile/navigation/navigation.jsx';
import FriendList from '../../components/profile/FriendList.jsx';
export default function Profile() {
	return (
		<>
			<Header />
			<div className='grid grid-cols-[65%,35%] gap-1'>
				<Navigation />
				<FriendList />
			</div>
		</>
	);
}
