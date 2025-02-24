import { Avatar, Typography } from 'antd';

export default function ChatHeader({ chat, setChatInfoIsOpen }) {
	return (
		<div 
		className='relative flex justify-between'
			style={{
				alignItems: 'center',
				borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
				backgroundColor: '#17191b',
			}}
		>
			<div>
				<div className='flex justify-between align-middle p-[17px_20px_17.5px_20px]'>
					<div className='flex justify-between' style={{"alignItems": "end"}}
					>
						<button onClick={() => setChatInfoIsOpen(true)}>
							<Typography.Title level={5} style={{ margin: 0 }}>
								{chat.title}
							</Typography.Title>
						</button>
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