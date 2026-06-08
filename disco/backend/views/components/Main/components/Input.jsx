import { __ } from '@wordpress/i18n';
import cn from '../utilities/cn';

const Input = ({
	testid = '',
	className = '',
	placeholder = '',
	id = '',
	name = '',
	type = 'text',
	onChange = () => {},
	value = '',
	disabled = false,
	icon = '',
}) => {
	return (
		<div className="disco-relative disco-inline-flex disco-items-center disco-w-full">
			{disabled && (
				<a
					href="https://discoplugin.com/pricing/?utm_source=pro-text&utm_medium=free-to-pro&utm_campaign=free-to-pro&utm_id=1"
					target="_blank"
					rel="noreferrer"
					className="disco-absolute disco-pl-2 disco-flex disco-items-center disco-text-base disco-text-red-500 hover:disco-text-red-500 focus:!disco-outline-none visited:disco-text-red-500 focus:!disco-ring-0"
				>
					{__('(Pro)', 'disco')}
				</a>
			)}
			<input
				autoComplete="off"
				className={cn(
					`!disco-rounded-md !disco-bg-white !disco-ps-3 leading-[2] !disco-py-1 !disco-border-[0.5px] !disco-border-primary focus:!disco-border-primary focus:!disco-shadow-none disco-text-base !disco-leading-loose !disco-min-h-[30px] disco-outline-none disabled:disco-cursor-not-allowed`,
					className
				)}
				type={type}
				name={name}
				id={id}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				min={0}
				data-testid={testid}
				disabled={disabled}
			/>
			{icon && icon}
		</div>
	);
};

export default Input;
