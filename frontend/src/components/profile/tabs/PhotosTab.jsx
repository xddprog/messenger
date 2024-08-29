import Button from '../../ui/button';

export default function PhotosTab() {
	return (
		<div className='flex flex-col gap-3 '>
			<div className='content flex gap-1  '>
				<img className='w-40 h-auto' src='./images/chb.jpg' alt='' />
				<img className='w-40 h-auto' src='./images/ava.jpg' alt='' />
			</div>
			<div className='controls grid grid-cols-2 gap-2 w-full   '>
				<Button style={{ width: '100%' }} title='Upload photo' />
				<Button style={{ width: '100%' }} title='Show all' />
			</div>
		</div>
	);
}
