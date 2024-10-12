import { AutoComplete, Avatar, Dropdown } from 'antd';
import { useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../requests/api/auth';
import { searchUser } from '../../requests/api/users';
import AppLogo from '../logo/AppLogo';
import NotificationDropdown from '../dropdowns/NotificationDropdown';

export default function MainPageHeader({notifications}) {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const items = [
		{
			key: 'settings',
			label: (
				<a onClick={() => navigate('/settings')}>
					Настройки
				</a>
			),
		},
		{
			key: 'logout',
			label: (
				<a onClick={handleLogout}>
					Выйти
				</a>
			),
		},
	];

	async function handleLogout() {
		try {
			await logoutUser();

			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function handleSearchUser(value) {
		searchUser(value).then((res) => setUsers(res.data));
	}

	return (
		<div
			style={{
				background: '#17191b',
				borderBottomRightRadius: 10,
				borderBottomLeftRadius: 10,
				position: 'sticky',
			}}
		>
			<div
				style={{
					padding: '10px 200px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ marginRight: '50px' }}>
						<AppLogo />
					</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div className=''>
							<AutoComplete
								placeholder='Поиск'
								style={{ width: '250px', backgroundColor: '#1e2022' }}
								size={'middle'}
								onChange={handleSearchUser}
								options={users.map((user) => ({
									label: (
										<a onClick={() => navigate(`/users/${user.id}`, { state: { currentUserProfile: false } })}>
											<div className='flex align-middle'>
												<Avatar src={user.avatar} className='mr-5' size={'large'} />
												<div className='flex flex-col'>
													<p>{user.username}</p>
													<p>Город: {user.city}</p>
												</div>
											</div>
										</a>
									),
								}))}
							/>
						</div>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<NotificationDropdown notifications={notifications}/>
							<button
								style={{
									background: 'none',
									border: 'none',
									padding: 0,
									cursor: 'pointer',
								}}
							>
								<IoMusicalNotesOutline size='27px' color='white' />
							</button>
						</div>
					</div>
				</div>
				<Dropdown menu={{ items }}>
					<Avatar
						className='cursor-pointer min-w-[36px] min-h-[36px]'
						key='avatar'
						src={localStorage.getItem('avatar') ?? ''}
						alt='profile-image'
					/>
				</Dropdown>
			</div>
		</div>
	);
}
