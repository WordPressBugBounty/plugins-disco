import { StarIcon } from '@heroicons/react/16/solid';
import { __ } from '@wordpress/i18n';

const Rating = ({
	ratingAvgClass = '',
	ratingHight = 3,
	ratingWidth = 3,
	totalReviewClass = '',
}) => {
	return (
		<div className="disco-flex disco-gap-1 disco-items-center disco-mt-0.5">
			<div className={`disco-font-bold disco-text-xs ${ratingAvgClass}`}>
				{__('4.0', 'disco')}
			</div>
			<div className="disco-flex">
				{[...Array(5)].map((_, index) => (
					<StarIcon
						key={index}
						className={`disco-w-${ratingWidth} disco-h-${ratingHight} ${
							index < 4
								? 'disco-text-yellow-500'
								: 'disco-text-gray-300'
						}`}
					/>
				))}
			</div>
			<div
				className={`disco-text-[10px] disco-text-gray-500 disco-underline ${totalReviewClass}`}
			>
				{__('935 reviews', 'disco')}
			</div>
		</div>
	);
};

export default Rating;
