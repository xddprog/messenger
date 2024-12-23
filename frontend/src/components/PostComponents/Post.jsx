import { useEffect, useRef, useState } from 'react';
import { deletePost, likePost } from '../../requests/api/posts.js';
import usePostsScroll from '../../hooks/usePostsScroll.jsx';
import PostInfo from './PostInfo.jsx';
import { Modal } from 'antd';
import CommentsList from '../Comments/CommentsList.jsx';


export default function Post({ postProps, updatePost, isCreator }) {
	const [postIsLiked, setPostIsLiked] = useState(false);
	const [countIsLiked, setCountIsLiked] = useState(0);
	const [editModalIsOpen, setEditModalIsOpen] = useState(false);
	const [post, setPost] = useState(null);
	const [isRead, setIsRead] = useState(false);
	const [postInModal, setPostInModal] = useState(false);
	const [counter, setCounter] = useState(0);
	const postRef = useRef(null);

	usePostsScroll(setPost, isRead, setIsRead, post, postRef);

	useEffect(() => {
		let userId = localStorage.getItem('user_id');
		setPost(postProps)

		let userInLikedPost = postProps.likes.map((item) => item.id).indexOf(userId) !== -1;

		userInLikedPost ? setPostIsLiked(true) : setPostIsLiked(false);
		userInLikedPost ? setCountIsLiked(postProps.likes.length) : setCountIsLiked(postProps.likes.length);
	}, [postProps]);

	async function handleDelete() {
		try {
			await deletePost(post.id);
			updatePost(post.id);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleEdit() {
		setEditModalIsOpen(true)
	}

	async function handleLike() {
		try {
			await likePost(post.id);

			setPostIsLiked(!postIsLiked);
			setCountIsLiked(postIsLiked ? countIsLiked - 1 : countIsLiked + 1);
		} catch (error) {
			console.error(error);
		}
	}
	return post && (
		<>
			<PostInfo 
				post={post} 
				postRef={postRef} 
				setPost={setPost}
				handeDelete={handleDelete}
				handleEdit={handleEdit}
				isCreator={isCreator}
				setEditModalIsOpen={setEditModalIsOpen}
				countIsLiked={countIsLiked}
				postIsLiked={postIsLiked}
				editModalIsOpen={editModalIsOpen}
				handleLike={handleLike}
				setPostInModal={setPostInModal}
				setCounter={setCounter}
			/>
			<Modal
				centered
				open={postInModal}
				className="custom-modal"
				footer={null}
				onCancel={() => setPostInModal(false)}
			>
				<div className='mt-7'>
					<PostInfo 
						post={post} 
						postRef={postRef} 
						setPost={setPost}
						handeDelete={handleDelete}
						handleEdit={handleEdit}
						isCreator={isCreator}
						setEditModalIsOpen={setEditModalIsOpen}
						countIsLiked={countIsLiked}
						postIsLiked={postIsLiked}
						editModalIsOpen={editModalIsOpen}
						handleLike={handleLike}
						setPostInModal={setPostInModal}
						postInModal={true}
						setCounter={setCounter}
					/>
					<CommentsList postId={post.id} postInModalIsOpen={postInModal} trigger={counter} />
				</div>
			</Modal>
		</>
	)
}
