import { Switch } from '@headlessui/react';
import { __ } from '@wordpress/i18n';

const Status = ({ status, handleStatus, disabled = false, dataTestid }) => {
	return (
		<div
			className={`disco-flex disco-items-center disco-gap-3 ${
				disabled ? 'disco-opacity-50 disco-cursor-not-allowed' : ''
			}`}
		>
			<div
				className="disco-text-[14px] disco-font-semibold"
				data-testid={`${dataTestid}-label`}
			>
				{status ? __('Enabled', 'disco') : __('Disabled', 'disco')}
			</div>

			<Switch
				data-testid={dataTestid}
				checked={status}
				onChange={!disabled ? handleStatus : () => {}}
				disabled={disabled}
				className={`${status ? 'disco-bg-primary' : 'disco-bg-gray-200'}
					${disabled ? 'disco-cursor-not-allowed' : 'disco-cursor-pointer'}
					disco-relative disco-inline-flex disco-h-5 disco-w-9 disco-flex-shrink-0
					disco-rounded-full disco-border-2 disco-border-transparent
					disco-transition-colors disco-duration-200 disco-ease-in-out
					focus:disco-outline-none`}
			>
				<span
					aria-hidden="true"
					className={`${status ? 'disco-translate-x-4' : 'disco-translate-x-0'}
						disco-pointer-events-none disco-inline-block disco-h-4 disco-w-4
						disco-transform disco-rounded-full disco-bg-white disco-shadow
						disco-ring-0 disco-transition disco-duration-200 disco-ease-in-out`}
				/>
			</Switch>
		</div>
	);
};

export default Status;
