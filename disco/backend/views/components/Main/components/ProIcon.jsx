import { __ } from '@wordpress/i18n';

export default function ProIcon() {
	const handleClick = (e) => {
		e.stopPropagation();
		window.open(
			'https://discoplugin.com/?utm_source=display_tab&utm_medium=text_button&utm_campaign=free-pro&utm_id=1',
			'_blank'
		);
	};

	return (
		<div
			onClick={handleClick}
			className="disco-bg-[linear-gradient(0deg,#FFCF56_-0.01%,#F8B203_37.95%,#FFCE32_58.84%,#FFDB00_86.4%,#FFE259_97.52%,#FFD000_100%)] disco-px-1 disco-py-0 disco-rounded disco-cursor-pointer"
		>
			<div className="disco-text-[#24292E] disco-text-sm disco-font-semibold">
				{__('Pro', 'disco')}
			</div>
		</div>
	);
}
