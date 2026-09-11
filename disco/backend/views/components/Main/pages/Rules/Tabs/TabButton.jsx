import { Tab } from '@headlessui/react';
import { Fragment } from 'react';

const TabButton = ({ children, disabled }) => {
	return (
		<Tab as={Fragment}>
			{({ selected }) => (
				<button
					className={`disco:first:rounded-l-xl disco:last:rounded-r-xl disco:box-border disco:border disco:border-gray-100 disco:pt-3.5 disco:pb-3 disco:grow disco:justify-between disco:outline-hidden disco:text-base  ${
						selected
							? 'disco:bg-primary disco:border! disco:border-solid! disco:text-white'
							: 'disco:bg-white'
					} ${
						!disabled ? 'disco:text-primary' : 'disco:text-gray-400'
					}`}
				>
					{children}
				</button>
			)}
		</Tab>
	);
};
export default TabButton;
