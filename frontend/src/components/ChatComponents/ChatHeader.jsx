import { Avatar, Typography } from 'antd';
import { choosePlural } from './utils';

export default function ChatHeader({ chat }) {
	return (
		<div className="flex justify-between items-center border-b border-white/10 bg-[#17191b] relative">
			<div>
				<div className="flex justify-between items-center py-4 px-5">
					<div className="flex justify-between items-end">
						<Typography.Title level={5} className="m-0">
							{chat.title}
						</Typography.Title>
						<Typography.Paragraph className="ml-2.5 m-0 text-[#424242]">
							{choosePlural(chat.users.length, ['участник', 'участника', 'участников'])} участника(-ов)
						</Typography.Paragraph>
					</div>
				</div>
			</div>
			<Avatar size={42} src={chat.avatar} className="mr-[5%]" />
		</div>
	);
}
