import Button from '../../ui/button';
import { Image } from 'antd';


export default function PhotosTab({images, currentUserProfile}) {
	return (
		<div className='flex flex-col gap-3'>
			{!images || !Object.keys(images).length ? (
				<h1>Ничего нет</h1>
			) : Array.isArray(images) ? (
				<div className='flex gap-1'>
					{images.reverse().slice(0, 3).map((photo) => (
						<Image
							key={photo.id}
							className='rounded-md'
							src={photo}
							alt='img'
							style={{objectFit: 'cover', height: '100%', maxHeight: 180}}
							width={`${images.length == 1 ? 50 : 100 / 3}%`}
						/>
					))}
				</div>
			) : null}
			<div className='controls grid grid-cols-2 gap-2'>
				{currentUserProfile && <Button style={{ width: '100%' }} title='Загрузить фото' />}
				<Button style={{ width: '100%' }} title='Показать все' />
			</div>
		</div>
	);
}
