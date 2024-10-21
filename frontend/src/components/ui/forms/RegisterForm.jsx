import { Button, DatePicker, Form, Input, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../requests/api/auth.js';
export default function RegisterForm() {
	const form = Form.useForm();
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const config = {
		rules: [
			{
				type: 'object',
				required: true,
				message: 'Please select time!',
			},
		],
	};

	async function registerSubmit() {
		try {
			const values = await form[0].validateFields();
			const response = await registerUser(values);

			localStorage.setItem('user_id', response.data.new_user.id);
			localStorage.setItem('token', response.data.token);

			messageApi.open({
				type: 'success',
				content: response.data.message,
			});
			navigate('/profile');
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
					<Input type='email' placeholder='Почта' size={'large'} />
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
					<Input type='password' placeholder='Пароль' size={'large'} />
				</Form.Item>

				<Form.Item
					name='username'
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Пожалуйста, введите свое имя!',
							whitespace: true,
						},
					]}
				>
					<Input placeholder='Имя пользователя' size={'large'} />
				</Form.Item>
				<Form.Item
					name='id'
					rules={[
						{
							required: true,
							message: 'Please input your id!',
							whitespace: true,
						},
					]}
				>
					<Input placeholder='Уникальный id ' size={'large'} />
				</Form.Item>
				<Form.Item
					name='description'
					rules={[
						{
							required: true,
							message: 'Please input Intro',
						},
					]}
				>
					<Input.TextArea
						placeholder='Расскажите о себе'
						showCount
						maxLength={100}
					/>
				</Form.Item>
				<Form.Item
					name='city'
					rules={[
						{
							required: true,
							message: 'Please input your city!',
							whitespace: true,
						},
					]}
				>
					<Input placeholder='Родной город ' size={'large'} />
				</Form.Item>

				<Form.Item className='w-full' name='birthday' label='' {...config}>
					<DatePicker placeholder='Дата рождения' />
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
