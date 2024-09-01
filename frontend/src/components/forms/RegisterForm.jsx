import { Button, Form, Input, message, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../requests/auth.js';

export default function RegisterForm() {
	const form = Form.useForm();
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();

	async function registerSubmit() {
		try {
			const values = await form[0].validateFields();
			const response = await registerUser(values).then((r) => r);
			localStorage.setItem('user_id', response.data.new_user.id);
			messageApi.open({
				type: 'success',
				content: response.data.message,
			});
			navigate('/setting');
		} catch (error) {
			messageApi.open({
				type: 'error',
				content: error.response.data.detail,
			});
		}
	}

	return (
		<div style={{ width: '100%' }}>
			{contextHolder}
			<Typography.Title
				level={1}
				style={{
					marginTop: 0,
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				Регистрация
			</Typography.Title>
			<Form form={form[0]}>
				<Form.Item
					name='email'
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Пожалуйста, введите свою почту!',
							type: 'email',
						},
					]}
				>
					<Input
						prefix={<MailOutlined className='site-form-item-icon' />}
						type='email'
						placeholder='Почта'
						size={'large'}
					/>
				</Form.Item>
				<Form.Item
					name='password'
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Пожалуйста, введите свой пароль!',
						},
					]}
				>
					<Input
						prefix={<LockOutlined className='site-form-item-icon' />}
						type='password'
						placeholder='Пароль'
						size={'large'}
					/>
				</Form.Item>
				<Form.Item>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Button
							type='primary'
							htmlType='submit'
							className='register-form-button'
							style={{
								width: '100%',
								marginBottom: '10px',
							}}
							size={'large'}
							onClick={registerSubmit}
						>
							Зарегистрироваться
						</Button>

						<a onClick={() => navigate('/login')}>Войти</a>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
}
