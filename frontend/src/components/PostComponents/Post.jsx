import {
	CommentOutlined,
	EllipsisOutlined,
	EyeOutlined,
	LikeOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Card, Dropdown, Image, Space } from 'antd';
import { useEffect, useState } from 'react';
import { deletePost, likePost } from '../../requests/api/posts.js';
import EditPostModal from './EditPostModal.jsx';


export default function Post({ post, updatePost, isCreator }) {
	const [postIsLiked, setPostIsLiked] = useState(false);
	const [countIsLiked, setCountIsLiked] = useState(0);
	const [editModalIsOpen, setEditModalIsOpen] = useState(false);
	const items = [
		{
			key: 'editPost',
			label: (
				<a onClick={handleEdit}>
					Редактировать
				</a>
			)
		},
		{
			key: 'deletePost',
			label: (
				<a onClick={handeDelete}>
					Удалить
				</a>
			),
		}
	]

	useEffect(() => {
		let userId = localStorage.getItem('user_id');

		let userInLikedPost =
			post.likes.map((item) => item.id).indexOf(userId) !== -1;

		userInLikedPost ? setPostIsLiked(true) : setPostIsLiked(false);
		userInLikedPost ? setCountIsLiked(post.likes.length) : setCountIsLiked(post.likes.length);
	}, [post.likes]);

	async function handeDelete() {
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

	async function handeLike() {
		try {
			await likePost(post.id);

			setPostIsLiked(!postIsLiked);
			setCountIsLiked(postIsLiked ? countIsLiked - 1 : countIsLiked + 1);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<Card
				className='mt-2 h-auto w-[100%] border-none'
				title={
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							marginTop: '10px',
							marginBottom: '10px',
							justifyContent: 'space-between',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<img
								src={post.author.avatar}
								style={{
									width: '40px',
									height: '40px',
									borderRadius: 50,
									marginRight: '15px',
								}}
								alt='author-profile-photo'
							/>
							<div>
								<a style={{ fontSize: 16 }}>{post.author.username}</a>
								<p
									style={{
										margin: 0,
										fontSize: 14,
										fontWeight: 500,
										color: '#6e7072',
									}}
								>
									{post.created_at}
								</p>
							</div>
						</div>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<EyeOutlined style={{ color: '#6e7072', marginRight: '5px' }} />
							<p
								style={{
									margin: 0,
									fontSize: 14,
									fontWeight: 500,
									color: '#6e7072',
								}}
							>
								{post.views}
							</p>
							{isCreator ? (
								<Dropdown
									className="w-[30px] h-[30px]"
									menu={{
										items,
									}}
								>
									<a onClick={(e) => e.preventDefault()} className="ml-3">
										<EllipsisOutlined className="text-3xl" />
									</a>
								</Dropdown>
							) : ''}
						</div>
					</div>
				}
				cover={
					<div style={{ display: 'flex' }}>
						{!!post.images &&
							post.images.map((image) => (
								<Image
									src={image}
									key={image}
									className='border-none object-cover h-full max-h-[500px] min-h-[500px]'
									width={`${post.images.length == 1 ? 100 : 100 / post.images.length
										}%`}
								/>
							))
						}
					</div>
				}
				actions={[
					<button
						style={{
							background: 'none',
							border: 'none',
							padding: 0,
							cursor: 'pointer',
						}}
						key={'like-button'}
						onClick={handeLike}
					>
						<Space direction='horizontal' key={'post-likes'}>
							<LikeOutlined
								key={'post-likes-icon'}
								style={{ color: postIsLiked ? '#07BA6E' : '#6e7072' }}
							/>
							<p
								style={{
									margin: 0,
									fontSize: 14,
									fontWeight: 500,
									color: postIsLiked ? '#07BA6E' : '#6e7072',
								}}
							>
								{countIsLiked}
							</p>
						</Space>
					</button>,
					<CommentOutlined key={3} width={40} />,
					<SendOutlined key={4} width={40} />,
				]}
			>
				<p style={{ margin: 0 }}>{post.description}</p>
			</Card>
			{<EditPostModal
				isOpen={editModalIsOpen}
				handleIsOpen={setEditModalIsOpen}
				postImages={post.images}
				postDescription={post.description}
			/>}
		</>
	);
}
