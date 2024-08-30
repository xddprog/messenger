import users from '../../utils/users.json';

export default function FriendList() {
	const displayedUsers = users.slice(0, 8);
	return (
		<div className='border-2 border-[#383838] rounded-2xl bg-[#141414] text-[#d7d7d9] p-4'>
			<h2>Friends {users.length}</h2>
			<div className='flex flex-wrap gap-1 justify-between'>
				{displayedUsers.map((user) => (
					<div
						key={user.id}
						className='flex flex-col items-center cursor-pointer'
					>
						<img
							className='w-16 h-auto rounded-[50%]'
							src={user.img}
							alt='img'
						/>
						<p>{user.name}</p>
					</div>
				))}
			</div>
		</div>
	);
}
