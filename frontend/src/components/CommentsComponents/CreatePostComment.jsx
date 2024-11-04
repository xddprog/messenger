import { useState } from 'react';
import InputComments from '../ui/inputs/InputComment';
import AllCommentsPost from './AllCommentsPost';
import { SendOutlined } from '@ant-design/icons';
import { AddCommentToPost } from '../../requests/api/posts';

export default function PostComments({ isCommentsOpen, postId }) {
	const img = localStorage.getItem('avatar');
	const [fileList, setFileList] = useState([]);
	const [isComments, setIsComments] = useState('');
	const handleSubmit = async () => {
		await AddCommentToPost(postId, isComments, fileList);
		setIsComments('');
		setFileList([]);
	};

	return (
		<>
			{isCommentsOpen && (
				<div className='w-full bg-[#18191b] border-[1px] border-[#383838] rounded-b-lg h-auto flex items-center flex-col justify-center'>
					<AllCommentsPost postId={postId} />
					<div className='flex items-center justify-center gap-4 p-4'>
						<img src={img} className='rounded-full w-12 h-12' alt='' />

						<InputComments
							fieldValue={isComments}
							setFieldValue={setIsComments}
							minRows={3}
						/>
						<SendOutlined
							onClick={handleSubmit}
							className='text-white cursor-pointer text-lg ml-3 hover:text-[#b9b9b9]'
						/>
					</div>
				</div>
			)}
		</>
	);
}
