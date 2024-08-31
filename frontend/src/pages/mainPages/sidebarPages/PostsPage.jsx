import { Empty, Typography } from 'antd';
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import Post from '../../../components/cards/Post';
import { getAllPosts } from '../../../requests/posts';
=======
import { useState, useEffect} from 'react';
import Post from '../../../components/cards/Post';
import { getAllPosts } from "../../../requests/posts"
>>>>>>> a7772bf (add delete post, add redis cache)
import CreatePostModal from '../../../components/modals/CreatePostModal.jsx';

export default function PostsPage() {
	const [posts, setPosts] = useState([]);
	const [createPostModalIsOpen, setCreatePostModalIsOpen] = useState(false);

	useEffect(() => {
<<<<<<< HEAD
		getAllPosts().then((res) => setPosts(res));
	}, []);
=======
	    getAllPosts().then(res => setPosts(res))
	}, [])
>>>>>>> a7772bf (add delete post, add redis cache)

	function updatePost(updatablePostData) {
		let newPosts = posts.map((post) => {
			if (post.id === updatablePostData.id) {
				return updatablePostData;
			} else {
				return post;
			}
		});
		console.log(newPosts.map((item) => item.likes));
		setPosts(newPosts);
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
			<div className='flex flex-col items-center w-full mt-3'>
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
