import { Tab } from '@headlessui/react';
import TabButton from '../../TabButton';
import { __ } from '@wordpress/i18n';

const BadgeHeaderTabs = () => {
	const tabsButtons = [
		{
			id: 1,
			text: __('Setup', 'disco'),
			disabled: true,
		},

		{
			id: 2,
			text: __('Display', 'disco'),
			disabled: false,
		},
		{
			id: 3,
			text: __('Summary', 'disco'),
			disabled: true,
		},
	];

	return (
		<Tab.Group selectedIndex={1}>
			<Tab.List
				className={`disco-flex disco-z-50 disco-sticky disco-top-8 disco-bg-gray-50 disco-p-2 disco-rounded-t-xl`}
			>
				{tabsButtons.map((button) => (
					<TabButton
						key={button.id}
						disabled={button.disabled} // Use the disabled property
						className={({ selected }) =>
							`disco-px-4 disco-py-2 disco-rounded-lg ${
								selected
									? 'disco-bg-primary disco-text-white'
									: 'disco-bg-gray-200 disco-text-gray-600'
							} ${button.disabled ? 'disco-opacity-50 disco-cursor-not-allowed' : ''}`
						}
					>
						{button.text}
					</TabButton>
				))}
			</Tab.List>
		</Tab.Group>
	);
};

export default BadgeHeaderTabs;
