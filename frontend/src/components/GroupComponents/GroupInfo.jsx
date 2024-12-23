import { Avatar, Button, Card, Image, Typography } from "antd";
import { useState } from "react";
import UpdateGroupInfoModal from "./UpdateGroupInfoModal";
import { joinUserToGroup } from "../../requests/api/groups";

export default function GroupInfo(
    {
        group, 
        isSubscriber, 
        isAdmin, 
        handleJoinToGroup, 
        setGroup
    }
) {
    const [modalIsVisible, setModalIsVisible] = useState(false);

    function openModal() {
        setModalIsVisible(true);
    }

    async function joinToGroup() {
        joinUserToGroup(group.id).then((res) => handleJoinToGroup(res))
    }

    return (
        <div>
            <Card
                className='border-none'
                cover={
                    <div>
                        <Image
                            src={group.cover}
                            className='w-full rounded-xl'
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
                                src={group.avatar}
                                alt='profile-avatar'
                            />
                        }
                        title={
                            <div>
                                <Typography.Title level={3} style={{ margin: 0, padding: 0 }}>
                                    {group.title}
                                </Typography.Title>
                            </div>
                        }
                        description={
                            <Typography.Paragraph style={{ fontSize: '13px' }}>
                                {group.description}
                            </Typography.Paragraph>
                        }
                    ></Card.Meta>
                    <div className='flex gap-3'>
                        <Button type="primary" style={{ width: '100%' }} onClick={joinToGroup}>
                            {isSubscriber ? 'Отписаться' : 'Подписаться'}
                        </Button>
                        {isAdmin && (
                            <Button onClick={openModal}>Редактировать группу</Button>
                        )}
                    </div>
                </div>
            </Card>
            <UpdateGroupInfoModal 
                groupId={group.id}
                isOpen={modalIsVisible} 
                handleOpen={setModalIsVisible}
                updateGroupState={setGroup}
            />
         </div>           
    )
}