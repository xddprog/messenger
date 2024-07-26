import {Empty, Typography} from "antd"
import { useEffect, useState } from "react"
import Post from "../../../components/cards/Post"
import { getAllPosts } from "../../../requests/posts"
import CreatePostModal from "../../../components/modals/CreatePostModal.jsx";


export default function PostsPage() {
    const [posts, setPosts] = useState(null)
    const [createPostModalIsOpen, setCreatePostModalIsOpen] = useState(false)

    useEffect(() => {
        getAllPosts().then(res => setPosts(res))
    }, [])

    function updatePost(updatablePostData) {
        let newPosts = posts.map(post => {
            if (post.id === updatablePostData.id) {
                return updatablePostData
            } else {
                return post
            }
        })
        console.log(newPosts.map(item => item.likes))
        setPosts(newPosts)
    }

    function addPostAfterCreate(post) {
        setPosts((prev) => [ post, ...prev])
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
           <CreatePostModal
               isOpen={createPostModalIsOpen}
               handleIsOpen={setCreatePostModalIsOpen}
               addPostAfterCreate={addPostAfterCreate}
           />
            <div style={{ marginTop: '10px', width: '100%'}}>
                {posts == null ?
                    <Empty description={<Typography.Text>Нет постов</Typography.Text>} />:
                    posts.map(post => <Post key={post.id} post={post} updatePost={updatePost} />)
                }
            </div>
        </div>
    )
}