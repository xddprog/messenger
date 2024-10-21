import Button from '../../ui/buttons/button';
export default function MusicTab() {
	return (
		<div className='flex flex-col gap-3'>
			<div className='music-albums flex justify-between'>
				<div className=''>album</div>
				<div className=''>album</div>
				<div className=''>album</div>
				<div className=''>album</div>
			</div>
			<div className='last-song'>
				<div className='grid grid-cols-2'>
					<div className=''>какая-то песня</div>
					<div className=''>какая-то песня</div>
					<div className=''>какая-то песня</div>
					<div className=''>какая-то песня</div>
				</div>
			</div>
			<Button style={{ width: '100%' }} title='Show all' />
		</div>
	);
}
