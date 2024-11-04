import { Input, Popover } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { SmileOutlined, UploadOutlined } from '@ant-design/icons';

export default function InputComments({
	fieldValue,
	setFieldValue,
	minRows,
	enterHandler,
}) {
	function addEmojiToFieldValue(emoji) {
		setFieldValue((prevValue) => prevValue + emoji.emoji);
	}

	return (
		<div className='flex justify-between relative'>
			<Input.TextArea
				autoSize
				minRows={minRows}
				value={fieldValue}
				maxLength={500}
				onChange={(e) => {
					setFieldValue(e.target.value);
				}}
				placeholder='Введите...'
				onKeyDown={enterHandler ? enterHandler : null}
				className='w-[410px]'
			/>
			<Popover content={<EmojiPicker onEmojiClick={addEmojiToFieldValue} />}>
				<SmileOutlined className='text-[#fff] cursor-pointer ml-[10px] text-[20px] hover:text-[#b9b9b9] absolute right-2 top-1.5' />
			</Popover>
			<Popover>
				<UploadOutlined
					key={'uploadImages'}
					className='text-[#fff] cursor-pointer ml-[10px] text-[20px] hover:text-[#b9b9b9] absolute right-10 top-1.5'
				/>
			</Popover>
		</div>
	);
}
