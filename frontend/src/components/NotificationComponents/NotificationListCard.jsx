import { Avatar, List } from "antd";

export default function NotificationListCard({ notification, navigate, notificationWs }) {
    async function handleClick() {
        switch (notification.notification_type) {
            case 'add_friend' || 'add_friend_accept':
                navigate(
                    `/users/${notification.notification_sender_id}`,
                    {
                        currentUserProfile: false,
                        notificationWs: notificationWs
                    }
                )
                break
            default:
                break
        }
    }
    
    return (
        <List.Item onClick={handleClick}>
            <List.Item.Meta
                description={
                    <div className='flex gap-3 text-wrap items-center'>
                        <Avatar
                            className='min-w-[50px] min-h-[50px]'
                            src={notification.image}
                            size={50}
                        />
                        <div>
                            <p>{notification.message}</p>
                        </div>
                    </div>
                }
            />
        </List.Item>
    )
}