import { Avatar, Typography } from 'antd';

export default function ChatHeader({ chat }) {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
				backgroundColor: '#17191b',
				position: 'relative',
			}}
		>
			<div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: '17px 20px 17.5px 20px',
					}}
				>
					<div 
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'end',
						}}
					>
						<Typography.Title level={5} style={{ margin: 0 }}>
							{chat.title}
						</Typography.Title>
						<Typography.Paragraph style={{ margin: '0px 0px 0px 10px', color: '#424242' }} >
							{chat.users.length} участника(-ов)
						</Typography.Paragraph>
					</div>
				</div>
			</div>
			<Avatar size={42} src={chat.avatar} className='mr-[5%]'/>
		</div>
	);
}
