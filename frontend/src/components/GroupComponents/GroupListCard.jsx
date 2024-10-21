import {  EllipsisOutlined } from "@ant-design/icons"
import { Avatar, Dropdown, List } from "antd"
import Title from "antd/es/typography/Title"
import { useNavigate } from "react-router-dom";
import {choosePlural} from "./utils";

function GropListCard({group}) {
    const navigate = useNavigate();
    const items = [
        {
            key: 'unsubscribe',
            label: (
                <a onClick={unsubscribe}>
                    Отписаться
                </a>
            ),
        },
        {
            key: 'notify',
            label: (
                <a onClick={notify}>
                    Уведомлять о записях
                </a>
            ),
        },
        {
            key: 'addToBookmarks',
            label: (
                <a onClick={addToBookmarks}>
                    Добавить в закладки
                </a>
            ),
        }
    ];

    function handleClickGroup() {
        navigate(`/groups/${group.id}`);
    }

    async function unsubscribe() {
        console.log('unsubscribe')
    }

    async function addToBookmarks() {
        console.log('addToBookmarks')
    }

    async function notify() {
        console.log('notify')
    }

    return (
        <List.Item onClick={handleClickGroup}>
            <List.Item.Meta
                avatar={<Avatar size={72} src={group.avatar} className='cursor-pointer'/>}
                description={
                    <div className="flex justify-between align-top">
                        <div>
                            <Title level={5} style={{margin: 0}} className='cursor-pointer'>{group.title}</Title>
                            <p>{group.description}</p>
                            <p>{choosePlural(group.users.length, ['подписчик', 'подписчика', 'подписчиков'])}</p>
                        </div>
                        <Dropdown className="w-[30px] h-[30px]" menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()} className="m-0">
                                <EllipsisOutlined className="text-3xl"/>
                            </a>
                        </Dropdown>
                    </div>
                }
            />
        </List.Item>
    )
}

export default GropListCard