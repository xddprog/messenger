import { useEffect, useState } from "react";
import { getUserPosts } from "../../requests/users";
import { Empty, Typography } from "antd";
import Post from "../cards/Post";

function UserPosts(){
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        getUserPosts().then((res) => setUserPosts(res.data));
    }, [])

	function updatePost(postId) {
		setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
	}

    return (
        <div
            style={{ marginTop: '10px', width: '100%' }}
            className='flex flex-col items-center'
        >
            {userPosts.length == 0 ? (
                <Empty description={<Typography.Text>Нет постов</Typography.Text>} />
            ) : (
                userPosts.map((post) => (
                    <Post key={post.id} post={post} updatePost={updatePost} />
                ))
            )}
        </div>
    );
};

export default UserPosts;