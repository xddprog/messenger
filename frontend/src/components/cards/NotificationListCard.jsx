import { Avatar, List } from "antd";
import Button from "../ui/button";

export default function NotificationListCard({notification}) {
    return (
        <List.Item>
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