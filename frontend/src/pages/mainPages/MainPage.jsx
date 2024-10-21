import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../requests/api/auth';
import MainPageHeader from '../../components/ui/menu/MainPageHeader';
import SideBar from '../../components/ui/menu/SideBar';

export default function MainPage({ notifications }) {
	const navigate = useNavigate();

	useEffect(() => {
		getCurrentUser().then((res) => {
			localStorage.setItem('avatar', res.data.avatar);
		}).catch(() => navigate('/login'))
	})
	return (
		<div style={{ backgroundColor: '#1e2022', height: '100vh' }}>
			<header
				style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}
			>
				<MainPageHeader notifications={notifications}/>
			</header>
			<div
				style={{
					display: 'flex',
					paddingTop: '90px',
					paddingLeft: 200,
					paddingRight: 200,
				}}
			>
				<div style={{ width: '13%', position: 'fixed', top: '90px' }}>
					<SideBar />
				</div>
				<div
					style={{
						flex: 1,
						boxSizing: 'border-box',
						marginLeft: '21.5%',
						height: '100vh',
					}}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
