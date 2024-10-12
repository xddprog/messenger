import { Dropdown, } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationListCard from "../cards/NotificationListCard";

export default function NotificationDropdown({ notifications }) {
    const items = notifications.map(item => {
        return {
            key: item.id,
            label: <NotificationListCard notification={item} />,
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