import FollowingItem from './FollowindItem';

export default function FollowingList() {
	const followingData = [
		{
			name: 'BTS',
			description: 'BTS идут в АРМИЮ?',
			avatar: './images/ava.jpg',
		},
		{ name: 'Три дня дождя', description: '', avatar: './images/ava.jpg' },
		{
			name: 'Сплетни K-POP',
			description: 'не хейт, а объективное мнение',
			avatar: './images/ava.jpg',
		},
		{
			name: 'Stanizlavsky - Формула 1 | Автоспорт',
			description: 'Трансляции Формулы 1',
			avatar: './images/ava.jpg',
		},
		{
			name: 'лефортово.',
			description: 'лефортово движение клуб',
			avatar: './images/ava.jpg',
		},
		{
			name: 'лефортово.',
			description: 'лефортово движение клуб',
			avatar: './images/ava.jpg',
		},
		{
			name: 'лефортово.',
			description: 'лефортово движение клуб',
			avatar: './images/ava.jpg',
		},
	];
	const displayedFollow = followingData.slice(0, 5);

	return (
		<div className='border-[#383838] rounded-xl bg-[#17191b] text-white mt-2 ml-2 p-4'>
			<h3>Following {followingData.length}</h3>
			{displayedFollow.map((item, index) => (
				<FollowingItem
					key={index}
					name={item.name}
					description={item.description}
					src={item.avatar}
				/>
			))}
		</div>
	);
}
