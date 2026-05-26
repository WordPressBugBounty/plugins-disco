import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleSelect from '../../../../../components/SingleSelect';
import { updateCountdown } from '../../../../../features/discount/discountSlice';
import BadgeHeader from '../components/BadgeHeader';
import TabComponent from '../components/TabComponent';
import AreaEdit from './components/AreaEdit';
import CountdownDisplay from './components/CountdownDisplay';
import CountdownEdit from './components/CountdownEdit';
import CountdownFontProperties from './components/CountdownFontProperties';
import CountdownTextInput from './components/CountdownTextInput';
import CountdownTimeItems from './components/CountdownTimeItems';
import CountdownTimeView from './components/CountdownTimeView';
import { __ } from '@wordpress/i18n';

const CountdownTimeEdit = () => {
	const dispatch = useDispatch();
	const design_blocks = useSelector((state) => state.discount?.design_blocks);
	const countdown = design_blocks?.countdown;
	const { discount_valid_to } = useSelector((state) => state.discount);
	const [activeTab, setActiveTab] = useState('area');
	const titleTextareaRef = useRef(null);
	const subtitleTextareaRef = useRef(null);

	const title = countdown?.title || {};
	const subtitle = countdown?.subtitle || {};

	const handleTitleTextChange = (e) => {
		dispatch(
			updateCountdown({
				name: 'title',
				value: { ...title, text: e.target.value },
			})
		);
	};

	const handleSubtitleTextChange = (e) => {
		dispatch(
			updateCountdown({
				name: 'subtitle',
				value: { ...subtitle, text: e.target.value },
			})
		);
	};

	const handlePositionChange = (value) => {
		dispatch(updateCountdown({ name: 'position', value }));
	};

	const tabData = [
		{
			id: 'area',
			label: 'Area',
			content: <AreaEdit />,
		},
		{
			id: 'countdown',
			label: 'Countdown',
			content: <CountdownEdit />,
		},
	];

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	// Ensure design_blocks and countdown are loaded
	if (!design_blocks || !countdown) {
		return null;
	}

	return (
		<div className="disco-bg-gray-50 disco-mr-4 disco-rounded-lg disco-pb-4">
			<div className="disco-px-5 disco-py-1">
				<BadgeHeader
					title={__('Countdown Timer', 'disco')}
					description="Customize your countdown timer on single product page."
				/>
				<div className="disco-max-h-[calc(100vh-225px)] disco-flex disco-gap-8 disco-pt-2 disco-mt-2 disco-justify-between">
					<div className="disco-w-1/2 disco-max-h-full disco-overflow-y-auto disco-no-scrollbar disco-overscroll-contain">
						<p className="disco-text-base">
							{__('Select Countdown Design', 'disco')}
						</p>
						<CountdownTimeItems />

						{/* Primary Text */}
						<CountdownFontProperties
							label={__('Primary Text', 'disco')}
							type="title"
						/>
						<CountdownTextInput
							ref={titleTextareaRef}
							onChange={handleTitleTextChange}
							value={title?.text || 'Exclusive Deals'}
						/>

						{/* Secondary Text */}
						<CountdownFontProperties
							label={__('Secondary Text', 'disco')}
							className="disco-mt-3"
							type="subtitle"
						/>
						<CountdownTextInput
							ref={subtitleTextareaRef}
							onChange={handleSubtitleTextChange}
							value={
								subtitle?.text ||
								'Available for a limited time only!'
							}
						/>

						{/* Select Position */}
						<div className="disco-flex disco-gap-2 disco-items-center disco-mt-3">
							<div className="disco-text-sm disco-font-semibold">
								{__('Select Position', 'disco')}
							</div>
							<SingleSelect
								items={{
									before_add_to_cart: __(
										'Before Add to Cart',
										'disco'
									),
									after_add_to_cart: __(
										'After Add to Cart',
										'disco'
									),
								}}
								selected={
									countdown?.position || 'after_add_to_cart'
								}
								onchange={handlePositionChange}
								className="disco-bg-white disco-w-44"
								buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
							/>
						</div>

						{/* Countdown Display */}
						<CountdownDisplay targetDate={discount_valid_to} />

						{/* Tabs */}
						<TabComponent
							tabs={tabData}
							activeTab={activeTab}
							onTabChange={(value) => setActiveTab(value)}
						/>
					</div>
					<div className="disco-w-1/2">
						<CountdownTimeView />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CountdownTimeEdit;
