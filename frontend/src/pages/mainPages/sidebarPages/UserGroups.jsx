import { List, Radio } from 'antd';
import { useEffect, useState } from 'react';
import GropListCard from '../../../components/cards/GroupListCard';
import InputWithIEmoji from '../../../components/inputs/InputWithIEmoji';
import CreateGroupModal from '../../../components/modals/CreateGroupModal';
import { getUserGroups } from '../../../requests/users';


function UserGroups() {
    const [CreateGroupModalVisible, setCreateGroupModalVisible] = useState(false)
    const [searchInputField, setSearchInputField] = useState('')
    const [userGroups, setUserGroups] = useState([])
    const radioOptions = [
        {
            label: "Все сообщетсва",
            value: "allGroups",
        },
        {
            label: "Управляемые",
            value: "adminedGroups",
        },
    ]

    useEffect(() => {
        getUserGroups(false).then(res => setUserGroups(res.data))
    }, [])

    async function switchGroupsTypes(event) {
        console.log(event.target.value)
        const userAdminedGroups = event.target.value == "adminedGroups" ? true : false
        await getUserGroups(userAdminedGroups).then(res => setUserGroups(res.data))
    }  

    function addGroupAfterCreate(post) {
		setUserGroups((prev) => [post, ...prev]);
        console.log(post)
        console.log(userGroups)
	}
    
    return (
        <List className='bg-[#17191b] p-5 rounded-xl flex flex-col w-[80%]' >
            <div className='mb-2'>
                <div className='flex justify-between mb-3 align-middle'>
                    <Radio.Group
                        block
                        options={radioOptions}
                        defaultValue="allGroups"
                        optionType="button"
                        onChange={switchGroupsTypes}
                    >
                        <Radio.Button value="allGroups">Все сообщетсва</Radio.Button>
                        <Radio.Button value="adminedGroups">Управляемые</Radio.Button>
                    </Radio.Group>     
                    <CreateGroupModal 
                        isOpen={CreateGroupModalVisible} 
                        handleIsOpen={setCreateGroupModalVisible}
                        addGroupAfterCreate={addGroupAfterCreate}
                    />
                </div>
                <InputWithIEmoji 
                    fieldValue={searchInputField}
                    setFieldValue={setSearchInputField}
                />
            </div>       
            {userGroups.map((group) => (
                <GropListCard
                    key={group.title}
                    title={group.title}
                    avatar={group.avatar}
                    tag={group.description}
                />
            ))}
        </List>
    );
}

export default UserGroups;