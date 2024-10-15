import { Dropdown, } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationListCard from "../cards/NotificationListCard";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown({ notifications, notificationWs }) {
    const navigate = useNavigate();

    const items = notifications.map(item => {
        return {
            key: item.id,
            label: (
                <NotificationListCard 
                    notification={item} 
                    navigate={navigate} 
                    notificationWs={notificationWs} 
                />
            ),
        }
    })

    return (
        <Dropdown menu={{ items }} overlayStyle={{ width: '400px'}}>
            <a onClick={(e) => e.preventDefault()} className="ml-3">
                <IoMdNotificationsOutline
                    size={'30px'}
                    color='#fff'
                    className="cursor-pointer mr-2 ml-7"
                />
            </a>
        </Dropdown>
    )
}