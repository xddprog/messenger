import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Avatar, ConfigProvider, theme } from 'antd';
import MainPage from './pages/mainPages/MainPage.jsx';
import RegisterPage from './pages/authPages/RegisterPage.jsx';
import LoginPage from './pages/authPages/LoginPage.jsx';
import PostsPage from './pages/mainPages/sidebarPages/PostsPage.jsx';
import ChatPage from './pages/mainPages/sidebarPages/ChatPage.jsx';
import UserGroups from './pages/mainPages/sidebarPages/UserGroups.jsx';
import Profile from './pages/mainPages/sidebarPages/Profile.jsx';
import useNotification from 'antd/es/notification/useNotification.js';
import { useEffect, useState } from 'react';
import { getUserUnReadedNotifications } from './requests/api/users.js';
import useMessage from 'antd/es/message/useMessage.js';

export default function App() {
	const [notification, notificationHolder] = useNotification()
	const [notificationWs, setNotificationWs] = useState(null)
	const [allNotifications, setAllNotifications] = useState([])
	const [message, messageHolder] = useMessage()

	useEffect(() => {
		getUserUnReadedNotifications().then(response => {
			setAllNotifications(response.data)
		})
		
		const ws = new WebSocket(
			`ws://localhost:8000/api/user/ws/notifications/${localStorage.getItem('user_id')}`
		)
    
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data)
			notificationHandler(data)
			updateNotifications(data)
		}

		setNotificationWs(ws)
	}, [])

	function updateNotifications(notification) {
		setAllNotifications(prevState => [...prevState, notification])
	}

	function notificationHandler(data) {
		notification.open({
			message: (
				<div className='flex gap-3 mb-0'>
					<Avatar src={data.image} className='min-w-[50px] min-h-[50px]'/>
					{data.message}
				</div>
			),
			placement: 'bottomRight',
		})
	}

    return (
        <ConfigProvider
		theme={{
			algorithm: theme.darkAlgorithm,
			token: {
				colorPrimary: '#05d77e',
				colorBgContainer: '#17191b',
			},
		}}
		>
			{notificationHolder}
			{messageHolder}
			<BrowserRouter>
				<Routes>
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/*' element={<MainPage notifications={allNotifications} />}>
						<Route path='posts' element={<PostsPage />} />
						<Route path='chats' element={<ChatPage />} />
						<Route 
							path='profile' 
							element={
								<Profile 
									currentUserProfile={true} 
									updateNotifications={updateNotifications}
								/>
							} 
						/>
						<Route path='groups' element={<UserGroups />} />
						<Route 
							path='users/:userId' 
							element={
								<Profile 
									currentUserProfile={false} 
									notificationWs={notificationWs}
								/>
							} 
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</ConfigProvider>
    )
}