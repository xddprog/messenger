export default function Button({ title, icon, style }) {
	return (
		<div>
			<button
				style={style}
				className='bg-[#777] text-[#d7d7d9] text-sm px-2 py-2 cursor-pointer border-none rounded-md flex items-center justify-center gap-2 font-semibold text-center hover:bg-[#393939] transition-colors  '
			>
				{title}
				{icon && icon}
			</button>
		</div>
	);
}
