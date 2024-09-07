import { Input, List, Typography } from 'antd';
import AppLogo from '../logo/AppLogo';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { logoutUser } from '../../requests/auth';
import { useNavigate } from 'react-router-dom';
import { searchUser } from '../../requests/users';
import { useState } from 'react';

export default function MainPageHeader() {
	const navigate = useNavigate();
	const [searchValue, setSearchValue] = useState('');
	const [users, setUsers] = useState([]);

	const handleLogout = async () => {
		try {
			await logoutUser();

			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const handleSearchUser = async (e) => {
		const value = e.target.value;
		setSearchValue(value);
		console.log(value);
		if (value) {
			try {
				const response = await searchUser(value);
				setUsers(response.data);
			} catch (err) {
				console.error(err);
			}
		} else {
			setUsers([]);
		}
	};

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
							<Input
								value={searchValue}
								placeholder='Поиск'
								style={{ width: '250px', backgroundColor: '#1e2022' }}
								size={'middle'}
								onChange={handleSearchUser}
								allowClear
							/>
							{!users.length ? (
								<Typography.Text type='secondary'>
									Нет результатов для поиска.
								</Typography.Text>
							) : (
								<List
									bordered
									dataSource={users}
									className='h-[400px] overflow-auto absolute top-[70px] z-10 bg-slate-600 '
									renderItem={(user) => (
										<List.Item className='cursor-pointer hover:bg-slate-400 transition-colors'>
											<div>
												<img
													src={user.avatar}
													alt={user.username}
													style={{
														width: '30px',
														borderRadius: '50%',
														marginRight: '10px',
													}}
												/>
												{user.username} (ID: {user.id})
											</div>
										</List.Item>
									)}
								/>
							)}
						</div>

						<div style={{ display: 'flex', alignItems: 'center' }}>
							<button
								style={{
									background: 'none',
									border: 'none',
									padding: 0,
									cursor: 'pointer',
								}}
							>
								<IoMdNotificationsOutline
									size={'30px'}
									color='#fff'
									style={{ marginLeft: '30px', marginRight: '10px' }}
								/>
							</button>
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

				<button className='text-white' onClick={handleLogout}>
					Выйти
				</button>

				<button
					style={{
						background: 'none',
						border: 'none',
						padding: 0,
						cursor: 'pointer',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<img
							src={localStorage.getItem('avatar') ?? ''}
							style={{ width: '35px', borderRadius: 50 }}
							alt='profile-image'
						/>
					</div>
				</button>
			</div>
		</div>
	);
}
