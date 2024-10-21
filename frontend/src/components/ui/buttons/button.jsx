export default function Button({ title, icon, style }) {
	return (
		<div>
			<button
				style={style}
				className='bg-[#252729] text-[#d7d7d9] text-s px-1.5 py-1.5 cursor-pointer border-none rounded-md flex items-center justify-center gap-2 text-center hover:bg-[#393939] transition-colors w-full'
			>
				{title}
				{icon && icon}
			</button>
		</div>
	);
}
