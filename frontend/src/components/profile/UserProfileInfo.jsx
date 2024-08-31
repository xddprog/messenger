import { Avatar, Button, Card, Typography, Image } from 'antd';

export default function UserProfileInfo() {
	return (
		<Card
			cover={
				<div>
					<Image
						src='https://storage.yandexcloud.net/mago-storage/base_files/base-profile-cover.jpeg'
						style={{ width: '100%' }}
					/>
				</div>
			}
		>
			<div className='flex justify-between'>
				<Card.Meta
					className='flex items-center'
					avatar={
						<Avatar
							style={{
								marginTop: '-100px',
								marginBottom: '10px',
								border: '5px solid #17191b',
							}}
							size={160}
							src='./images/ava.jpg'
							alt='profile-avatar'
						/>
					}
					title={
						<div>
							<Typography.Title level={3} style={{ margin: 0, padding: 0 }}>
								Stas Stas
							</Typography.Title>
						</div>
					}
					description={
						<Typography.Paragraph style={{ fontSize: '13px' }}>
							Ещкере чивапчис
						</Typography.Paragraph>
					}
				></Card.Meta>
				<Button>Редактировать профиль</Button>
			</div>
		</Card>
	);
}
