export default function FollowingItem({ name, description, src }) {
	console.log(src)
	return (
		<div className='flex items-center gap-3 cursor-pointer hover:bg-[#1e2022] rounded-md p-2 duration-300'>
			<img className='w-12 h-12 rounded-3xl' src={src} alt='' />
			<div className=' '>
				<h4 className='text-sm'>{name}</h4>
				<p className='text-sm text-gray-500'>{description}</p>
			</div>
		</div>
	);
}
