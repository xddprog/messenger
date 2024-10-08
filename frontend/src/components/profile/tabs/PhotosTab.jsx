import Button from '../../ui/button';
import { getCurrentUser } from '../../../requests/auth';
import { useState, useEffect } from 'react';
import { Image } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/modules';
export default function PhotosTab() {
	const [currentPhoto, setCurrentPhoto] = useState([]);
	useEffect(() => {
		getCurrentUser().then((res) => {
			setCurrentPhoto(res.data.images);
		});
	}, []);
	return (
		<div className='flex flex-col gap-3'>
			{!currentPhoto || !Object.keys(currentPhoto).length ? (
				<h1>Ничего нет</h1>
			) : Array.isArray(currentPhoto) ? (
				<div className='flex gap-1'>
					{currentPhoto.reverse().slice(0, 3).map((photo) => (
						<Image
							key={photo.id}
							className='rounded-md'
							src={photo}
							alt='img'
							style={{objectFit: 'cover', height: '100%', maxHeight: 170}}
							width={`${currentPhoto.length == 1 ? 100 : 100 / 3}%`}
						/>
					))}
				</div>
			) : null}
			<div className='controls grid grid-cols-2 gap-2 w-full'>
				<Button style={{ width: '100%' }} title='Загрузить фото' />
				<Button style={{ width: '100%' }} title='Показать все' />
			</div>
		</div>
	);
}
