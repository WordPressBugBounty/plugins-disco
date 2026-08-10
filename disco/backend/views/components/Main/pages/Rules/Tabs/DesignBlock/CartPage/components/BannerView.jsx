import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';
import { getBorderRadius } from '../../../../../../utilities/utilities';

const BannerView = ({ showSuccess = false }) => {
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const banner = cart?.banner || {};
	const button = banner?.button || {};
	const success = banner?.success || {};

	// Preview the success message only when it is enabled and has text.
	const hasSuccess = success?.enable !== false && !!success?.text;
	const isSuccessView = showSuccess && hasSuccess;
	const textConfig = isSuccessView ? success : banner;

	// Container style (no font-style or text-decoration to prevent inheritance)
	const bannerContainerStyle = {
		background: banner?.background || '#07C889',
		color: banner?.color || '#ffffff',
		borderRadius: getBorderRadius(banner?.radius),
		border:
			banner?.border > 0
				? `${banner.border}px solid ${banner?.['border-color'] || '#07C889'}`
				: 'none',
		height: banner?.height || '45px',
		padding: '0 16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '12px',
	};

	// Banner text style (includes font-style and text-decoration)
	const bannerTextStyle = {
		fontFamily: textConfig['font-family'] || 'inherit',
		fontSize: textConfig['font-size'] || '14px',
		fontWeight: textConfig['font-weight'] || 600,
		fontStyle: textConfig['font-style'] || 'normal',
		textDecoration: textConfig['text-decoration'] || 'none',
		textAlign: 'center',
	};

	// Button style (completely independent from banner)
	const buttonStyle = {
		backgroundColor: button?.background || '#ffffff',
		color: button?.color || '#07C889',
		borderRadius: getBorderRadius(button?.radius),
		border:
			button?.border > 0
				? `${button.border}px solid ${button?.['border-color'] || '#ffffff'}`
				: 'none',
		fontFamily: button['font-family'] || 'inherit',
		fontSize: button['font-size'] || '12px',
		fontWeight: button['font-weight'] || 600,
		fontStyle: button['font-style'] || 'normal',
		textDecoration: button['text-decoration'] || 'none',
		textAlign: button['text-align'] || 'center',
		height: button?.height || '35px',
		width: button?.width || '100px',
		padding: '6px 14px',
		cursor: 'pointer',
		whiteSpace: 'nowrap',
		flexShrink: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const renderBannerText = () => {
		const text = isSuccessView
			? success.text
			: banner?.text || '[discounted_percentage] OFF - Limited Time!';
		return text
			.replace(/\[discounted_percentage\]/g, '20%')
			.replace(/\[discounted_amount\]/g, '$10')
			.replace(/\[remaining_quantity\]/g, '5')
			.replace(/\[remaining_amount\]/g, '$50')
			.replace(/\[remaining_cart_items\]/g, '2');
	};

	// With the success message off, the banner disappears once the discount is claimed.
	if (showSuccess && !isSuccessView) {
		return (
			<div className="disco-border disco-border-dashed disco-border-gray-300 disco-rounded disco-py-3 disco-text-center disco-text-xs disco-text-gray-500">
				{__('Banner is hidden after the discount is applied', 'disco')}
			</div>
		);
	}

	return (
		<div style={bannerContainerStyle}>
			<span style={bannerTextStyle}>{renderBannerText()}</span>
			{!isSuccessView && button?.enable !== false && (
				<button style={buttonStyle}>
					{button?.text || __('Shop Now', 'disco')}
				</button>
			)}
		</div>
	);
};

export default BannerView;
