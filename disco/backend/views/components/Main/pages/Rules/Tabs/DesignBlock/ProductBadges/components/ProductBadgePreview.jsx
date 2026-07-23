import { useSelector } from 'react-redux';
import {
	getBorderRadius,
	renderBadgeText,
} from '../../../../../../utilities/utilities';

const ProductBadgePreview = ({ size }) => {
	const { badge } = useSelector((state) => state.discount.design_blocks);

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
						{renderBadgeText(badge?.title?.text)}
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
					{renderBadgeText(badge?.title?.text)}
				</p>
			)}
		</div>
	);
};

export default ProductBadgePreview;
