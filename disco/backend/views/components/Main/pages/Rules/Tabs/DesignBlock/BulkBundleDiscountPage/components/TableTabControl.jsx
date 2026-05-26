import { useState } from 'react';
import HeadingTabSection from './HeadingTabSection';
import CellTabSection from './CellTabSection';
import ButtonTabSection from './ButtonTabSection';
import TabComponent from '../../components/TabComponent';
import { __ } from '@wordpress/i18n';

const TableTabControl = () => {
	const [activeTab, setActiveTab] = useState('heading');

	const tabData = [
		{
			id: 'heading',
			label: __('Heading', 'disco'),
			content: <HeadingTabSection />,
		},
		{
			id: 'cell',
			label: __('Cell', 'disco'),
			content: <CellTabSection />,
		},
		{
			id: 'button',
			label: __('Button', 'disco'),
			content: <ButtonTabSection />,
		},
	];

	return (
		<TabComponent
			tabs={tabData}
			activeTab={activeTab}
			onTabChange={(value) => setActiveTab(value)}
		/>
	);
};

export default TableTabControl;
