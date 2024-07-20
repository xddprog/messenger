import { Button } from "antd"
import { useEffect, useState } from "react"
import Post from "../../../components/cards/Post"
import { getAllPosts } from "../../../requests/posts"


export default function PostsPage() {
    const [posts, setPosts] = useState(null)
    const [postsLoading, setPostsLoading] = useState(true)

    useEffect(() => {
        getAllPosts().then(res => {
            console.log(res);
            setPosts(res)
        })
        setPostsLoading(false)
    }, [])

    return (
       <div style={{}}>
            <Button
                type="primary"
                style={{
                    width: '100%',
                    marginBottom:'10px',
                }}
                size={'large'}
            >
                Выложить пост
            </Button>
            <div style={{ marginTop: '10px'}}>
                {posts == null ? 'zxc': posts.map(post => <Post key={post.id} post={post} />)}
            </div>
       </div>
    )
}