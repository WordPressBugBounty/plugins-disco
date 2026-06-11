import { __ } from '@wordpress/i18n';
import PluginIcon from './PluginIcon';
import StatusBadge from './StatusBadge';

function PluginCard({ plugin }) {
	// eslint-disable-next-line no-undef
	const isPro = DISCO_COMPATIBLE_PLUGINS.is_pro_active;

	const handleClick = () => {
		window.open(
			'https://discoplugin.com/?utm_source=Compatible_page&utm_medium=button&utm_campaign=free-pro&utm_id=1#pricing',
			'_blank',
			'noopener,noreferrer'
		);
	};

	return (
		<div className="disco-bg-white disco-border disco-border-[#10c88a] disco-rounded-[14px] disco-overflow-hidden disco-flex disco-flex-col disco-shadow-[0px_0px_0px_3px_rgba(245,158,11,0.07)]">
			{/* Top accent bar */}
			<div
				className="disco-h-[3px] disco-shrink-0"
				style={{
					backgroundImage:
						'linear-gradient(90deg, rgb(16, 200, 138) 0%, rgb(16, 200, 138) 100%)',
				}}
			/>

			{/* Card body */}
			<div className="disco-flex disco-flex-col disco-flex-1 disco-p-[18px]">
				{/* Icon + status */}
				<div className="disco-flex disco-items-start disco-justify-between disco-mb-5">
					<div className="disco-w-[48px] disco-overflow-hidden disco-shrink-0">
						<PluginIcon plugin={plugin} />
					</div>
					<StatusBadge status={plugin.status} />
				</div>

				{/* Name + category + description */}
				<div className="disco-flex disco-flex-col disco-gap-2 disco-mb-3">
					<h3 className="disco-text-[14px] disco-font-extrabold disco-text-[#0f172a] disco-leading-[18.2px]">
						{plugin.name}
					</h3>
					<p className="disco-text-[10.5px] disco-font-semibold disco-text-[#94a3b8] disco-uppercase disco-tracking-[0.42px] disco-leading-none">
						{plugin.category}
					</p>
					<p className="disco-text-[12.5px] disco-font-normal disco-text-[#475569] disco-leading-[19.38px]">
						{plugin.description}
					</p>
				</div>

				{/* Feature tags */}
				{plugin.tags && plugin.tags.length > 0 && (
					<div className="disco-flex disco-flex-wrap disco-gap-[5px] disco-mt-auto disco-mb-3">
						{plugin.tags.map((tag) => (
							<span
								key={tag}
								className="disco-bg-[#f0fdf4] disco-border disco-border-[#dcfce7] disco-text-[#15803d] disco-text-[10.5px] disco-font-semibold disco-rounded-full disco-px-2 disco-py-[4.5px] disco-leading-none"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>

			{/* Bottom action bar */}
			<div className="disco-border-t disco-border-[#f1f5f9] disco-px-[18px] disco-h-14 disco-flex disco-items-center disco-justify-between disco-gap-3 disco-shrink-0">
				{!isPro ? (
					<>
						<button
							className="disco-flex disco-items-center disco-gap-1.5 disco-h-[31px] disco-px-[14px] disco-rounded-[10px] disco-text-[12px] disco-font-bold disco-text-black disco-shrink-0 hover:disco-scale-105"
							style={{
								backgroundImage:
									'linear-gradient(to bottom, #ffe55b, #ffbe5c)',
							}}
							onClick={handleClick}
						>
							<svg
								width="10"
								height="12"
								viewBox="0 0 10 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="disco-shrink-0"
							>
								<path
									d="M8.5 5.5H1.5C0.948 5.5 0.5 5.948 0.5 6.5V10.5C0.5 11.052 0.948 11.5 1.5 11.5H8.5C9.052 11.5 9.5 11.052 9.5 10.5V6.5C9.5 5.948 9.052 5.5 8.5 5.5Z"
									stroke="#573712"
									strokeWidth="1"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M3 5.5V3.5C3 2.837 3.263 2.201 3.732 1.732C4.201 1.263 4.837 1 5.5 1C6.163 1 6.799 1.263 7.268 1.732C7.737 2.201 8 2.837 8 3.5V5.5"
									stroke="#573712"
									strokeWidth="1"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							{__('Unlock Pro', 'disco')}
						</button>
						<a
							href={plugin.learnMoreUrl || '#'}
							target="_blank"
							rel="noopener noreferrer"
							className="disco-text-[11.5px] disco-font-semibold disco-text-[#2563eb] disco-no-underline hover:disco-underline"
						>
							{__('How it works →', 'disco')}
						</a>
					</>
				) : (
					<a
						href={plugin.learnMoreUrl || '#'}
						target="_blank"
						rel="noopener noreferrer"
						className="disco-w-full disco-text-xs disco-font-bold disco-text-primary-dark disco-no-underline disco-bg-primary-light disco-rounded-lg disco-px-5 disco-py-2 hover:disco-scale-105 hover:disco-text-primary-dark disco-transition-all disco-duration-300 disco-text-center"
					>
						{__('📄 View Docs →', 'disco')}
					</a>
				)}
			</div>
		</div>
	);
}

export default PluginCard;
