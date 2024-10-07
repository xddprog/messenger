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
			<Swiper
				modules={[Navigation]}
				style={{ maxWidth: '100%', width: '400px' }}
				spaceBetween={70}
				slidesPerView={2}
				loop={true}
				navigation
				className='content'
			>
				{!currentPhoto || !Object.keys(currentPhoto).length ? (
					<h1>Ничего нет</h1>
				) : Array.isArray(currentPhoto) ? (
					currentPhoto.map((el) => (
						<SwiperSlide key={el.id}>
							<Image
								style={{ width: 160, height: 160, objectFit: 'cover' }}
								src={el}
								alt={el.id}
							/>
						</SwiperSlide>
					))
				) : null}
			</Swiper>
			<div className='controls grid grid-cols-2 gap-2 w-full'>
				<Button style={{ width: '100%' }} title='Upload photo' />
				<Button style={{ width: '100%' }} title='Show all' />
			</div>
		</div>
	);
}
