import { IoMdPhotos, IoIosMusicalNotes, IoIosAlbums } from 'react-icons/io';
import { useState } from 'react';
import PhotosTab from '../tabs/PhotosTab';
import MusicTab from '../tabs/MusicTab';
import AlbumsTab from '../tabs/AlbumsTab';
export default function Navigation({user, currentUserProfile}) {
	const [activeTab, setActiveTab] = useState('photos');

	const tabs = [
		{
			id: 'photos',
			name: 'Фотографии',
			icon: <IoMdPhotos />,
		},
		{
			id: 'music',
			name: 'Музыка',
			icon: <IoIosMusicalNotes />,
		},
		{
			id: 'albums',
			name: 'Альбомы',
			icon: <IoIosAlbums />,
		},
	];
	const handleTabClick = (tabId) => {
		setActiveTab(tabId === activeTab ? null : tabId);
	};

	const renderActiveTab = () => {
		switch (activeTab) {
			case 'photos':
				return <PhotosTab images={user.images} />;
			case 'music':
				return <MusicTab />;
			case 'albums':
				return <AlbumsTab />;
			default:
				return null;
		}
	};

	return (
		<div className='border-[#383838] rounded-xl bg-[#17191b] text-white mt-2'>
			<div className='navigation-content p-3 flex flex-col gap-3'>
				<div className='navigation-tabs flex items-center justify-center gap-4'>
					{tabs.map((tab) => (
						<div
							key={tab.id}
							className={`tabs-photo btn-tabs btn-tabs-flex font-normal ${
								activeTab === tab.id ? 'bg-[#252729] text-white' : ''
							}`}
							onClick={() => handleTabClick(tab.id)}
						>
							{tab.icon}
							{tab.name}
						</div>
					))}
				</div>
				<div className=''>{renderActiveTab()}</div>
			</div>
		</div>
	);
}
