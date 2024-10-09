import { useEffect, useState } from "react";
import { getUserPosts } from "../../requests/api/users";
import { Empty, Typography } from "antd";
import Post from "../cards/Post";
import CreatePostModal from "../modals/CreatePostModal";

function UserPosts({currentUserProfile, userId}) {
    const [userPosts, setUserPosts] = useState([]);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    useEffect(() => {
        getUserPosts(userId).then((res) => setUserPosts(res.data));
    }, [userId])

	function updatePost(postId) {
		setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
	}

    function addPostAfterCreate(post) {
		setUserPosts((prev) => [post, ...prev]);
	}

    return (
        <div
            className='flex flex-col items-center w-full mt-4'
        >
            {currentUserProfile && (
                <CreatePostModal 
                    isOpen={createModalIsOpen} 
                    handleIsOpen={setCreateModalIsOpen} 
                    addPostAfterCreate={addPostAfterCreate} 
                />
            )}
            {userPosts.length == 0 ? (
                <Empty description={<Typography.Text>Нет постов</Typography.Text>} />
            ) : (
                userPosts.map((post) => (   
                    <Post 
                        key={post.id} 
                        post={post} 
                        updatePost={updatePost} 
                        isCreator={currentUserProfile}
                    />
                ))
            )}  
        </div>
    );
}

export default UserPosts;