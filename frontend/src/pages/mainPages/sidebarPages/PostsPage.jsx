import { Empty, Typography } from 'antd';
import { useEffect, useState } from 'react';
import Post from '../../../components/cards/Post';
import CreatePostModal from '../../../components/modals/CreatePostModal.jsx';
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
				style={{ marginTop: '10px', width: '100%' }}
				className='flex flex-col items-center'
			>
				{posts == null ? (
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
