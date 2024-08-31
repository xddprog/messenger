import { useEffect } from 'react';
import { getCurrentUser } from '../../requests/auth.js';

import { useNavigate } from 'react-router-dom';

export default function AccountChecker() {
	const navigate = useNavigate();
	useEffect(() => {
		getCurrentUser()
			.then((response) => {
				const user = response.data[0];
				if (user.length == 0) {
					navigate('/register');
				} else {
					localStorage.setItem('user_id', user.id);
					// localStorage.setItem('avatar', user.avatar);
				}
			})
			.catch((error) => console.error(error));
	}, [navigate]);
	return null;
}
