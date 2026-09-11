import { __ } from '@wordpress/i18n';

export default function SettingsTitle({
	title,
	subtitle,
	url = '',
	children,
	className = '',
}) {
	return (
		<div
			className={`disco:flex disco:items-center disco:justify-between disco:p-4 disco:bg-gray-50 disco:border disco:border-white disco:rounded-md ${className}`}
		>
			<span>
				<h1 className="disco:text-lg! disco:mb-2! disco:font-normal!">
					{title}
				</h1>
				<p className="disco:flex disco:text-sm disco:text-black disco:gap-2">
					{subtitle}
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={url}
						className="disco:text-primary! disco:hover:text-primary disco:focus:border-none disco:focus:shadow-none disco:focus:outline-hidden"
					>
						{__('Learn More', 'disco')}
					</a>
				</p>
			</span>
			{children}
		</div>
	);
}
