import SettingFormUser from '../../components/forms/SettingForm';

export default function SettingPage() {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			<div
				style={{
					width: '350px',
				}}
			>
				<SettingFormUser />
			</div>
		</div>
	);
}
