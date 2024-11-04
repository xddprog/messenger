import { Empty, Typography } from 'antd';
import { useEffect, useState } from 'react';
import CreatePostModal from '../../../components/PostComponents/CreatePostModal.jsx';
import Post from '../../../components/PostComponents/Post.jsx';
import { getAllPosts } from '../../../requests/api/posts.js';

export default function PostsPage() {
	const [posts, setPosts] = useState([]);
	const [createPostModalIsOpen, setCreatePostModalIsOpen] = useState(false);

	useEffect(() => {
		getAllPosts().then((res) => setPosts(res.reverse()));
	}, []);

	function updatePost(postId) {
		setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
	}

	function addPostAfterCreate(post) {
		setPosts((prev) => [post, ...prev]);
	}

	return (
		<div
			style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
		>
			<CreatePostModal
				isOpen={createPostModalIsOpen}
				handleIsOpen={setCreatePostModalIsOpen}
				addPostAfterCreate={addPostAfterCreate}
			/>
			<div
				style={{ marginTop: '10px', width: '550px' }}
				className='flex flex-col items-center '
			>
				{posts.length == 0 ? (
					<Empty description={<Typography.Text>Нет постов</Typography.Text>} />
				) : (
					posts.map((post) => (
						<Post key={post.id} post={post} updatePost={updatePost} />
					))
				)}
			</div>
		</div>
	);
}
