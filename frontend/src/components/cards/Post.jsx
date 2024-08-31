import { CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Card, Image, Space } from 'antd';
import { likePost } from '../../requests/posts.js';
import { useEffect, useState } from 'react';

export default function Post({ post, updatePost }) {
	const [postIsLiked, setPostIsLiked] = useState(false);
	console.log(post);
	useEffect(() => {
		let userId = localStorage.getItem('user_id');

		let userInLikedPost =
			post.likes.map((item) => item.id).indexOf(userId) !== -1;

		userInLikedPost ? setPostIsLiked(true) : setPostIsLiked(false);
	}, []);

	async function like() {
		await likePost(post.id).then((res) => {
			updatePost(res);
			setPostIsLiked(!postIsLiked);
		});
	}

	return (
		<Card
			style={{
				marginTop: '10px',
				height: '100%',
			}}
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
					</div>
				</div>
			}
			cover={
				<div style={{ display: 'flex' }}>
					{post.images
						? post.images.map((image) => (
								<Image
									src={image}
									key={image}
									style={{
										borderRadius: 0,
										height: '100%',
										objectFit: 'cover',
									}}
									width={`${100 / post.images.length}%`}
								/>
						  ))
						: null}
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
					onClick={like}
				>
					<Space direction='horizontal' key={'post-likes'}>
						<LikeOutlined
							key={'post-likes-icon'}
							style={{ color: postIsLiked ? '#05d77e' : '#6e7072' }}
						/>
						<p
							style={{
								margin: 0,
								fontSize: 14,
								fontWeight: 500,
								color: postIsLiked ? '#05d77e' : '#6e7072',
							}}
						>
							{post.likes.length}
						</p>
					</Space>
				</button>,
				<CommentOutlined key={3} width={40} />,
			]}
		>
			<p style={{ margin: 0 }}>{post.description}</p>
		</Card>
	);
}
