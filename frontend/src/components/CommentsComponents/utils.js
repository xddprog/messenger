export default function timeAgo(date) {
	const now = new Date();
	const seconds = Math.floor((now - new Date(date)) / 1000);

	const intervals = [
		{ label: 'год', seconds: 31536000 },
		{ label: 'месяц', seconds: 2592000 },
		{ label: 'день', seconds: 86400 },
		{ label: 'час', seconds: 3600 },
		{ label: 'минута', seconds: 60 },
		{ label: 'секунда', seconds: 1 },
	];

	for (const interval of intervals) {
		const count = Math.floor(seconds / interval.seconds);
		if (count > 0) {
			return `${count} ${interval.label}${count !== 1 ? ' назад' : ' назад'}`;
		}
	}

	return 'только что';
}
