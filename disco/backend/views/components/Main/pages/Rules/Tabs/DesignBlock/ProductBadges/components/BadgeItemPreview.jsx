import {
	getBorderRadius,
	renderBadgeText,
} from '../../../../../../utilities/utilities';

const TILE_MAX_SIZE = 84;

const BadgeDesignPreview = ({ design }) => {
	const container = design?.container || {};
	const title = design?.title || {};

	const width = parseInt(container?.width) || 0;
	const height = parseInt(container?.height) || 0;
	const largestSide = Math.max(width, height);
	const scale = largestSide > TILE_MAX_SIZE ? TILE_MAX_SIZE / largestSide : 1;

	return (
		<div style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}>
			<div
				style={{
					...container,
					position: 'relative',
					left: 'auto',
					top: 'auto',
					right: 'auto',
					margin: '0px',
					'border-radius': getBorderRadius(container?.radius),
					'box-sizing': 'border-box',
				}}
			>
				<span
					style={{
						...title,
						'font-weight': `${title?.['font-weight'] || '400'}`,
					}}
				>
					{renderBadgeText(title?.text)}
				</span>
			</div>
		</div>
	);
};

export default BadgeDesignPreview;
