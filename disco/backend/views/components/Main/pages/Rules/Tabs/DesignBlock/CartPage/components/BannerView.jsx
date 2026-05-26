import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';

const BannerView = () => {
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const banner = cart?.banner || {};
	const button = banner?.button || {};

	// Get border radius with fallbacks
	const getBorderRadius = (radius) => {
		if (!radius) return '8px';
		return `${radius['top-left'] || '8px'} ${radius['top-right'] || '8px'} ${radius['bottom-right'] || '8px'} ${radius['bottom-left'] || '8px'}`;
	};

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
		fontFamily: banner['font-family'] || 'inherit',
		fontSize: banner['font-size'] || '14px',
		fontWeight: banner['font-weight'] || 600,
		fontStyle: banner['font-style'] || 'normal',
		textDecoration: banner['text-decoration'] || 'none',
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
		const text =
			banner?.text || '[discounted_percentage] OFF - Limited Time!';
		return text
			.replace(/\[discounted_percentage\]/g, '20%')
			.replace(/\[discounted_amount\]/g, '$10')
			.replace(/\[remaining_quantity\]/g, '5')
			.replace(/\[remaining_amount\]/g, '$50')
			.replace(/\[remaining_cart_items\]/g, '2');
	};

	return (
		<div style={bannerContainerStyle}>
			<span style={bannerTextStyle}>{renderBannerText()}</span>
			{button?.enable !== false && (
				<button style={buttonStyle}>
					{button?.text || __('Shop Now', 'disco')}
				</button>
			)}
		</div>
	);
};

export default BannerView;
