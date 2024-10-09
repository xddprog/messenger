import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import MainPageHeader from '../../components/menu/MainPageHeader';
import SideBar from '../../components/menu/SideBar';
import { getCurrentUser } from '../../requests/api/auth';

export default function MainPage() {
	useEffect(() => {
		getCurrentUser().then((res) => {
			localStorage.setItem('avatar', res.data.avatar);
		})
	})
	return (
		<div style={{ backgroundColor: '#1e2022', height: '100vh' }}>
			<header
				style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}
			>
				<MainPageHeader />
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
						marginLeft: '23%',
						height: '100vh',
					}}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
