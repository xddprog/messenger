import { useEffect, useState } from 'react';
import { getPostComments } from '../../requests/api/posts';
import timeAgo from './utils';
export default function AllCommentsPost({ postId }) {
	let now = new Date();
	let img = localStorage.getItem('avatar');
	const [isComments, setIsComments] = useState([]);
	async function getComment() {
		const data = await getPostComments(postId);
		setIsComments(data);
	}

	useEffect(() => {
		getComment();
	}, []);
	return (
		<>
			{isComments.map((comment) => (
				<div
					key={comment.id}
					className='w-full bg-[#18191b] border-[1px] border-[#383838] rounded-b-lg h-auto flex items-center justify-between pb-3 text-white p-4'
				>
					<div className='flex gap-4 '>
						<img src={img} className='rounded-full w-14 h-14' alt='' />
						<div className='flex flex-col'>
							<p>{comment.author_fk}</p>
							<p className='text-[#b9b9b9]'>{comment.text}</p>
							<img src={comment.images} alt='' />
							<p>{timeAgo(now)}</p>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
