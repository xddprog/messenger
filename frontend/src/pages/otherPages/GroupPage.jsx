import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroup } from "../../requests/api/groups";
import GroupInfo from "../../components/GroupComponents/GroupInfo";
import FollowingList from "../../components/ui/following/FollowingList";
import Navigation from "../../components/ui/navigation/Navigation";
import PostsList from "../../components/UserComponents/PostsList";

function GroupPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState({});
    const userId = localStorage.getItem('user_id');
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        getGroup(groupId).then((res) => {
            setGroup(res.group);
            setIsSubscriber(res.is_subscriber);
            setIsAdmin(res.is_admin);
        });
    }, [groupId]);

    return (
        <div>
            <GroupInfo 
                group={group} 
                isSubscriber={isSubscriber} 
                isAdmin={isAdmin}
                handleJoinToGroup={setIsSubscriber}
                setGroup={setGroup}
            />
            <div className='grid grid-cols-[60%,40%] gap-1'>
				<div className=''>
					<Navigation images={group.images} currentUserProfile={group.creator?.id == userId} />
                    <PostsList 
                        isCreator={group.creator?.id == userId} 
                        itemId={groupId} 
                        page={'group'}
                    />
				</div>
				<div className=''>
					{/* <GroupAdminsList /> */}
					<FollowingList itemId={groupId} page={'group'} />
				</div>
			</div>
        </div>
    )
}

export default GroupPage