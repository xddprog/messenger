import Button from '../ui/button.jsx';
import { ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

export default function Header() {
	return (
		<div className='border-2 border-[#383838] rounded-2xl bg-[#141414] text-[#d7d7d9] mb-4'>
			<img
				className='profile-banner object-cover rounded-xl h-[200px] w-full'
				src='./images/alena.jpg'
				alt='banner'
			/>
			<div className='profile-info flex items-center px-3'>
				<img
					className='profile-avatar rounded-[50%] h-[150px] w-auto border-4 border-[#181818] -top-20 relative	'
					src={localStorage.getItem('avatar') ?? ''}
					alt='avatar'
				/>
				<div className='profile-wrapper flex  w-full justify-between'>
					<div className='profile-text flex flex-col gap-2'>
						<h1 className='profile-name text-2xl font-bold'>Stas Stas</h1>
						<p className='profile-description text-sm'>
							радуга земного тяготения
						</p>
						<div className='status'>
							<div className='status-icon'></div>
							<span className='cursor-pointer text-gray-600  hover:underline underline-offset-2 flex gap-1'>
								<InfoCircleOutlined /> Learn more
							</span>
						</div>
					</div>
					<div className='buttons flex gap-4'>
						<Button title='Edit Profle' />
						<Button title='More' icon={<ArrowDownOutlined />} />
					</div>
				</div>
			</div>
		</div>
	);
}
