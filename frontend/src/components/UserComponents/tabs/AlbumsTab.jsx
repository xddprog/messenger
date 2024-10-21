import Button from '../../ui/buttons/button';

export default function AlbumsTab() {
	return (
		<div className='content flex flex-col gap-3'>
			<div className='flex gap-3 '>
				<div className='w-[150px] h-[110px] border border-sky-500'></div>
				<div className='w-[150px] h-auto border border-sky-500'></div>
				<div className='w-[150px] h-auto border border-sky-500'></div>
			</div>
			<div className='grid grid-cols-2 gap-2 w-full'>
				<Button style={{ width: '100%' }} title='Create album' />
				<Button style={{ width: '100%' }} title='Show all' />
			</div>
		</div>
	);
}
