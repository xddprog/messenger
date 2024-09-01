import { Button, Form, Input, Typography, DatePicker } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function SettingFormUser() {
	const form = Form.useForm();
	const config = {
		rules: [
			{
				type: 'object',
				required: true,
				message: 'Please select time!',
			},
		],
	};
	return (
		<div className='w-full text-center '>
			<Typography.Title level={1}>Заполнение профиля</Typography.Title>
			<Form form={form[0]} className='flex flex-col'>
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
					<Input
						prefix={<UserOutlined />}
						placeholder='Имя пользователя'
						size={'large'}
					/>
				</Form.Item>
				<Form.Item
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

				<Form.Item className='w-full' name='date-picker' label='' {...config}>
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
						>
							Закончить заполнение
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
}
