import { Empty, Typography } from "antd";
import { useEffect, useState } from "react";
import { getUserPosts } from "../../requests/api/users";
import CreatePostModal from "../PostComponents/CreatePostModal";
import Post from "../PostComponents/Post";
import { getGroupPosts } from "../../requests/api/groups";

function PostsList({ currentUserProfile, itemId, page }) {
    const [posts, setPosts] = useState([]);
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    useEffect(() => {
        if (page == 'group') {
            getGroupPosts(itemId).then((res) => setPosts(res));
        } else {
            getUserPosts(itemId).then((res) => setPosts(res));
        }
    }, [itemId, page])

    function updatePost(postId) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    }

    function addPostAfterCreate(post) {
        setPosts((prev) => [post, ...prev]);
    }
    
    return (
        <div
            className='flex flex-col items-center w-full mt-4'
        >
            <CreatePostModal
                isOpen={createModalIsOpen}
                handleIsOpen={setCreateModalIsOpen}
                addPostAfterCreate={addPostAfterCreate}
                itemId={itemId}
                page={page}
            />
            {posts.length == 0 ? (
                <Empty description={<Typography.Text>Нет постов</Typography.Text>} />
            ) : (
                posts.map((post) => (
                    <Post
                        key={post.id}
                        postProps={post}
                        updatePost={updatePost}
                        isCreator={currentUserProfile}
                    />
                ))
            )}
        </div>
    );
}

export default PostsList;