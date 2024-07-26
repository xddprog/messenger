import {Avatar, Button, Card, Typography, Image} from "antd";


export default function UserProfileInfo() {
    return (
        <Card
            cover={
                <div>
                    <Image
                        src="https://storage.yandexcloud.net/mago-storage/base_files/base-profile-cover.jpeg"
                        style={{ width: "100%" }}
                    />
                </div>
            }
        >
            <Card.Meta
                style={{ width: "100%" }}
                avatar={
                    <Avatar
                        style={{ marginTop: '-100px', marginBottom: '10px', border: '5px solid #17191b' }}
                        size={160}
                        src="https://storage.yandexcloud.net/mago-storage/base_files/base-profile-avatar.jpeg"
                        alt="profile-avatar"
                    />
                }
                title={
                    <div style={{ display: 'flex'}}>
                        <Typography.Title
                        level={3}
                        style={{ margin: 0, padding: 0 }}
                        >
                            Мариф Магомедов
                        </Typography.Title>
                        <Button style={{backgroundColor: '#1e2022', marginLeft: '26%'}}>Редактировать профиль</Button>
                    </div>
                }
                description={
                    <Typography.Paragraph style={{ fontSize: '13px'}}>
                        Жопа пися хуй дрочить
                    </Typography.Paragraph>
                }
            >
            </Card.Meta>
        </Card>
    )
}