import { useDispatch, useSelector } from 'react-redux';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import {
	cartBannerDesign,
	shippingBannerDesign,
} from '../../../../../../utilities/cart-banner-design';
import { __ } from '@wordpress/i18n';

const CartBadgeItems = ({ className = '' }) => {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const { discount_intent } = useSelector((state) => state.discount);

	// Use shipping-specific designs when intent is Shipping
	const bannerDesigns =
		discount_intent === 'Shipping'
			? shippingBannerDesign
			: cartBannerDesign;

	const handleBannerSelect = (designKey) => {
		// Update selected design key
		dispatch(updateCartPage({ name: 'selected_design', value: designKey }));

		// Apply the design to banner state (use intent-specific designs)
		const selectedDesign = bannerDesigns[designKey];
		if (selectedDesign) {
			dispatch(updateCartPage({ name: 'banner', value: selectedDesign }));
		}
	};

	// Helper to replace variables with sample values
	const replaceVariables = (text) => {
		return text
			.replace(/\[discounted_percentage\]/g, '20%')
			.replace(/\[discounted_amount\]/g, '$10')
			.replace(/\[remaining_quantity\]/g, '5')
			.replace(/\[remaining_amount\]/g, '$50')
			.replace(/\[remaining_cart_items\]/g, '2');
	};

	return (
		<>
			<p className="disco-text-sm disco-mt-4 disco-font-semibold">
				{__('Select Banner Design', 'disco')}
			</p>
			<div
				className={`disco-max-h-[300px] disco-overflow-y-auto disco-no-scrollbar disco-overscroll-contain disco-rounded-lg disco-bg-white disco-my-4 disco-py-4 disco-px-4 disco-border-1 ${className}`}
			>
				<div className="disco-grid disco-gap-4 disco-grid-cols-1">
					{Object.entries(bannerDesigns).map(([key, design]) => {
						const isSelected = cart?.selected_design === key;

						const buttonStyle = {
							backgroundColor: design.button.background,
							color: design.button.color,
							borderRadius: `${design.button.radius['top-left']} ${design.button.radius['top-right']} ${design.button.radius['bottom-right']} ${design.button.radius['bottom-left']}`,
							padding: '4px 12px',
							fontSize: design.button['font-size'],
							fontWeight: design.button['font-weight'],
						};
						const bannerStyle = {
							background: design.background,
							color: design.color,
							borderRadius: `${design.radius['top-left']} ${design.radius['top-right']} ${design.radius['bottom-right']} ${design.radius['bottom-left']}`,
							border: design.border
								? `${design.border}px solid ${design['border-color']}`
								: 'none',
							padding: '12px 16px',
							fontSize: design['font-size'],
							fontWeight: design['font-weight'],
						};

						return (
							<div
								key={key}
								onClick={() => handleBannerSelect(key)}
								className={`disco-border disco-rounded-md disco-p-3 disco-cursor-pointer disco-transition-all ${
									isSelected
										? 'disco-border-primary disco-bg-primary/5'
										: 'hover:disco-border-gray-300'
								}`}
							>
								{/* Preview of banner design */}
								<div
									style={bannerStyle}
									className="disco-flex disco-items-center disco-justify-center disco-gap-4 disco-text-center"
								>
									<span>{replaceVariables(design.text)}</span>
									{design.button.enable && (
										<button
											style={buttonStyle}
											className="disco-flex-shrink-0 disco-whitespace-nowrap"
										>
											{design.button.text}
										</button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default CartBadgeItems;
