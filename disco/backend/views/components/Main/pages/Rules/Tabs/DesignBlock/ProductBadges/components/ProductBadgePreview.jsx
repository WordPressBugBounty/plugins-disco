import { useSelector } from 'react-redux';

const ProductBadgePreview = ({ size }) => {
	const { badge } = useSelector((state) => state.discount.design_blocks);

	const renderBannerText = () => {
		const rawText = badge?.title?.text;
		const text =
			typeof rawText === 'string'
				? rawText
				: '[discounted_percentage] OFF - Limited Time!';
		return text
			.replace(/\[discounted_percentage\]/g, '20%')
			.replace(/\[discounted_amount\]/g, '$10')
			.replace(/\[remaining_quantity\]/g, '5')
			.replace(/\[remaining_amount\]/g, '$50')
			.replace(/\[remaining_cart_items\]/g, '2');
	};

	// Get border radius with fallbacks
	const getBorderRadius = (radius) => {
		if (!radius) return '0px';
		return `${radius['top-left'] || '0px'} ${radius['top-right'] || '0px'} ${radius['bottom-right'] || '0px'} ${radius['bottom-left'] || '0px'}`;
	};

	// If badge type is upload and design has a url, show the image
	if (badge?.badge_type === 'upload' && badge?.image?.url) {
		const { container } = badge;
		return (
			<div
				style={{
					...container,
					maxWidth:
						size === 'small'
							? `${parseInt(container?.['max-width']) / 1.6}px`
							: container?.['max-width'],
					maxHeight:
						size === 'small'
							? `${parseInt(container?.['max-height']) / 1.6}px`
							: container?.['max-height'],
				}}
			>
				<img
					src={badge.image.url}
					alt="Product Badge"
					style={{
						width: '100%',
						height: '100%',
					}}
				/>
			</div>
		);
	}

	return (
		<div
			style={{
				...badge?.container,
				padding: '5px 7px',
				'border-radius': getBorderRadius(badge?.container?.radius),
				width:
					size === 'small'
						? `${parseInt(badge?.container?.width) / 1.6}px`
						: badge?.container?.width,
				height:
					size === 'small'
						? `${parseInt(badge?.container?.height) / 1.6}px`
						: badge?.container?.height,
			}}
		>
			{badge?.badge_type === 'value_editable' ? (
				<div
					style={{
						position: 'relative',
						width: '100%',
					}}
				>
					<img
						src={badge?.design?.url}
						alt="design"
						style={{
							width: '100%',
							height: '100%',
						}}
					/>
					<p
						style={{
							...badge?.title,
							'font-weight': `${badge.title?.['font-weight'] || '400'}`,
						}}
					>
						{renderBannerText()}
					</p>
				</div>
			) : (
				<p
					style={{
						...badge?.title,
						'font-weight': `${badge.title?.['font-weight'] || '400'}`,
						'font-size':
							size === 'small'
								? '8px'
								: badge?.title?.['font-size'],
						'line-height':
							size === 'small'
								? '9px'
								: badge?.title?.['line-height'],
					}}
				>
					{renderBannerText()}
				</p>
			)}
		</div>
	);
};

export default ProductBadgePreview;
