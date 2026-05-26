import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartPage } from '../../../../../features/discount/discountSlice';
import BadgeHeader from '../components/BadgeHeader';
import TabComponent from '../components/TabComponent';
import BannerFontProperties from './components/BannerFontProperties';
import BannerTextInput from './components/BannerTextInput';
import ButtonArea from './components/ButtonArea';
import ButtonSection from './components/ButtonSection';
import CartBadgeItems from './components/CartBadgeItems';
import CartPageView from './components/CartPageView';
import NoticeArea from './components/NoticeArea';
import { __ } from '@wordpress/i18n';

const CartPageEdit = () => {
	const dispatch = useDispatch();
	const design_blocks = useSelector((state) => state.discount?.design_blocks);
	const cart = design_blocks?.cart;
	const banner = cart?.banner || {};
	const [activeTab, setActiveTab] = useState('bannerArea');
	const textareaRef = useRef(null);

	const handleBannerTextChange = (e) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: { ...banner, text: e.target.value },
			})
		);
	};

	const tabData = [
		{
			id: 'bannerArea',
			label: __('Banner Style', 'disco'),
			content: <NoticeArea />,
		},
		{
			id: 'button',
			label: __('Button Style', 'disco'),
			content: <ButtonArea />,
		},
	];

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	// Ensure design_blocks and cart are loaded
	if (!design_blocks || !cart) {
		return null;
	}

	return (
		<div className="disco-bg-gray-50 disco-mr-4 disco-rounded-lg disco-pb-4">
			<div className="disco-px-5 disco-py-1">
				<BadgeHeader
					title={__('Cart Notice', 'disco')}
					description={__(
						'Customize your promotional banner on Cart Page.',
						'disco'
					)}
				/>
				<div className="disco-max-h-[calc(100vh-225px)] disco-flex disco-gap-8 disco-pt-2 disco-mt-2 disco-justify-between">
					<div className="disco-w-1/2 disco-max-h-full disco-overflow-y-auto disco-no-scrollbar disco-overscroll-contain">
						<CartBadgeItems />
						<BannerFontProperties
							label={__('Banner Text', 'disco')}
							textareaRef={textareaRef}
						/>
						<BannerTextInput
							ref={textareaRef}
							onChange={handleBannerTextChange}
							value={banner?.text || ''}
						/>
						<ButtonSection />
						{/*<CheckoutSection />*/}
						<TabComponent
							tabs={tabData}
							activeTab={activeTab}
							onTabChange={(value) => setActiveTab(value)}
						/>
					</div>

					{/*view section*/}
					<div className="disco-w-1/2">
						<CartPageView />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPageEdit;
