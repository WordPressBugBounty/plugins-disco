import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import product3 from '../../../../../../../../asset/img/badge-images/product-placeholder/product3.svg';
import Button from '../../../../../../components/Button';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import {
	cartBannerDesign,
	shippingBannerDesign,
} from '../../../../../../utilities/cart-banner-design';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import BannerView from './BannerView';

const CartPageView = () => {
	const dispatch = useDispatch();
	const { discount_intent } = useSelector((state) => state.discount);

	const handleResetBanner = () => {
		// Reset to first banner design (banner1)
		dispatch(
			updateCartPage({
				name: 'banner',
				value:
					discount_intent === 'Shipping'
						? shippingBannerDesign.banner1
						: cartBannerDesign.banner1,
			})
		);
		dispatch(updateCartPage({ name: 'selected_design', value: 'banner1' }));
	};

	return (
		<BadgeCardContainer className="disco-bg-white disco-h-[500px] disco-w-full disco-top-32 !disco-sticky">
			<div className="disco-w-full">
				<div className="disco-mx-14 disco-p-4 disco-shadow-md disco-rounded-md">
					<h1 className="disco-text-base disco-font-semibold">
						{__('Shopping Cart', 'disco')}
					</h1>

					{/* Dynamic Banner with Shop Now button */}
					<div className="disco-mt-3">
						<BannerView />
					</div>

					{/* Product Item 1 */}
					<div className="disco-flex disco-p-1 disco-bg-gray-50 disco-gap-2 disco-mt-3 disco-rounded">
						<div className="disco-bg-white disco-flex disco-justify-center disco-items-center disco-rounded disco-px-4 disco-py-2">
							<img
								src={product3}
								alt="productImage"
								className="disco-h-10"
							/>
						</div>
						<div className="disco-mt-1">
							<p className="disco-text-sm disco-flex disco-font-semibold">
								{__('Havit H655BT ANC Noise Cance...', 'disco')}
							</p>
							<div className="disco-text-sm disco-my-0.5 disco-font-light">
								$28
							</div>
						</div>
					</div>

					{/* Product Item 2 */}
					<div className="disco-flex disco-p-1 disco-bg-gray-50 disco-gap-2 disco-mt-3 disco-rounded">
						<div className="disco-bg-white disco-flex disco-justify-center disco-items-center disco-rounded disco-px-4 disco-py-2">
							<img
								src={product3}
								alt="productImage"
								className="disco-h-10"
							/>
						</div>
						<div className="disco-mt-1">
							<p className="disco-text-sm disco-flex disco-font-semibold">
								{__('Havit H655BT ANC Noise Cance...', 'disco')}
							</p>
							<div className="disco-text-sm disco-my-0.5 disco-font-light">
								$28
							</div>
						</div>
					</div>

					{/* Cart Summary */}
					<div className="disco-flex disco-py-1 disco-mt-2 disco-justify-between">
						<span className="disco-text-base">
							{__('Sub-Total', 'disco')}
						</span>
						<span className="disco-text-base">$56</span>
					</div>
					<div className="disco-flex disco-py-0.5 disco-justify-between">
						<span className="disco-text-base">
							{__('Saving', 'disco')}
						</span>
						<span className="disco-text-base">$10</span>
					</div>
					<div className="disco-h-[1px] disco-my-0.5 disco-bg-gray-200"></div>
					<div className="disco-flex disco-py-0.5 disco-justify-between">
						<span className="disco-text-lg disco-font-semibold">
							{__('Total', 'disco')}
						</span>
						<span className="disco-text-lg disco-font-semibold">
							$46
						</span>
					</div>
				</div>
				<div className="disco-flex disco-justify-center disco-gap-4 disco-py-4">
					<Button
						type="transparent"
						className="disco-border-red-500"
						onClick={handleResetBanner}
					>
						{__('Reset All', 'disco')}
					</Button>
				</div>
			</div>
		</BadgeCardContainer>
	);
};

export default CartPageView;
