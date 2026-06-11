import { Tab } from '@headlessui/react';
import { Fragment } from 'react';

const TabButton = ({ children, disabled }) => {
	return (
		<Tab as={Fragment}>
			{({ selected }) => (
				<button
					className={`first:disco-rounded-l-xl last:disco-rounded-r-xl disco-box-border disco-border disco-border-gray-100 disco-pt-3.5 disco-pb-3 disco-flex-grow disco-justify-between disco-outline-none disco-text-base disco-bg-white ${
						selected
							? 'disco-bg-primary-light !disco-border !disco-bg-primary !disco-border-solid disco-text-white'
							: ''
					} ${
						!disabled ? 'disco-text-primary' : 'disco-text-gray-400'
					}`}
				>
					{children}
				</button>
			)}
		</Tab>
	);
};
export default TabButton;
