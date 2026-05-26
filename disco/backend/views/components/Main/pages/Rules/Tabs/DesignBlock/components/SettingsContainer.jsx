const SettingsContainer = ({ title = '', children, className = '' }) => {
	return (
		<div className={className}>
			<h1 className="disco-text-sm disco-font-semibold disco-mb-2">
				{title}
			</h1>
			<div className="disco-flex disco-justify-between 2xl:disco-justify-start disco-gap-4 disco-bg-white disco-p-2 disco-rounded-md">
				{children}
			</div>
		</div>
	);
};

export default SettingsContainer;
