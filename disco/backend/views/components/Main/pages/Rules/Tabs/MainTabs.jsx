import { Tab } from '@headlessui/react';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import ProIcon from '../../../components/ProIcon';
import { setTab } from '../../../features/discount/discountSlice';
import {
	setComponentToEdit,
	setShowEditor,
} from '../../../features/interaction/interactionSlice';
import useIsPro from '../../../hooks/useIsPro';
import CampaignSetup from './CampaignSetup/CampaignSetup';
import DesignBlock from './DesignBlock/DesignBlock';
import Summary from './Summary/Summary';
import TabButton from './TabButton';

const MainTabs = () => {
	const isPro = useIsPro();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const edit = params.get('edit');

	const tabsButtons = [
		{
			id: 1,
			text: __('Setup', 'disco'),
		},

		{
			id: 2,
			text: __('Display', 'disco'),
		},
		{
			id: 3,
			text: __('Summary', 'disco'),
		},
	];
	const { ui } = useSelector((state) => state.discount);
	const dispatch = useDispatch();

	// Reset editor state whenever tab changes
	useEffect(() => {
		dispatch(setShowEditor(false));
		dispatch(setComponentToEdit(''));
	}, [ui[0], dispatch]);

	const handleTabChange = (index) => {
		// Tab disabled when creating a new campaign (no edit param) for index > 0.
		// Block the switch but keep the button enabled so ProIcon link stays clickable.
		if (!edit && index > 0) {
			return;
		}
		dispatch(setTab(index));
	};

	return (
		<Tab.Group
			onChange={handleTabChange}
			// selectedIndex={ 1 }
			selectedIndex={ui[0]}
			manual
		>
			<Tab.List className="disco-flex disco-z-50 disco-sticky disco-top-8 disco-bg-gray-50 disco-p-2 disco-rounded-t-xl">
				{tabsButtons.map((button, index) => (
					<TabButton key={button.id} disabled={!edit && index > 0}>
						<span className="disco-flex disco-justify-center disco-items-center disco-gap-2">
							{button.text}
							{!isPro && index === 1 ? <ProIcon /> : ''}
						</span>
					</TabButton>
				))}
			</Tab.List>
			<div className="">
				<Tab.Panels>
					<Tab.Panel>
						<CampaignSetup />
					</Tab.Panel>
					<Tab.Panel>
						<DesignBlock />
					</Tab.Panel>
					<Tab.Panel>
						<Summary />
					</Tab.Panel>
				</Tab.Panels>
			</div>
		</Tab.Group>
	);
};
export default MainTabs;
