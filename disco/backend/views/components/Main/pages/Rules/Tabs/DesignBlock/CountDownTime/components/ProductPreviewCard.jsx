import { __ } from '@wordpress/i18n';
import product2 from '../../../../../../../../asset/img/badge-images/product-placeholder/product2.svg';
import Rating from '../../components/Rating';

/**
 * ProductPreviewCard component - Renders the product card preview
 */
const ProductPreviewCard = ({ children }) => {
	return (
		<div className="disco-flex disco-items-start disco-gap-3 disco-bg-gray-white disco-shadow-md disco-border disco-border-white disco-rounded-xl disco-p-6">
			<div className="disco-flex disco-flex-shrink-0 disco-bg-white disco-justify-center disco-items-center disco-rounded-md disco-p-2">
				<img src={product2} alt="img" className="disco-h-32" />
			</div>
			<div className="disco-w-full">
				<p className="disco-text-lg disco-font-medium disco-text-black">
					{__('Man Half T-Shirt', 'disco')}
				</p>
				<div className="disco-mt-1 disco-flex disco-justify-between disco-items-center">
					<div className="disco-flex disco-gap-2 disco-items-center">
						<span className="disco-text-lg disco-font-bold">
							$165
						</span>
						<span className="disco-text-base disco-line-through disco-decoration-red-500">
							$285
						</span>
					</div>
				</div>
				<div className="disco-flex disco-gap-1 disco-items-center disco-mt-1">
					<Rating
						ratingHight={4}
						ratingWidth={4}
						ratingAvgClass="!disco-text-base"
						totalReviewClass="!disco-text-sm"
					/>
				</div>
				<button className="disco-text-blue-400 disco-text-sm disco-border disco-border-blue-400 disco-w-full disco-p-1 disco-mt-1">
					{__('Add to Cart', 'disco')}
				</button>
				<div className="disco-mt-3">{children}</div>
			</div>
		</div>
	);
};

export default ProductPreviewCard;
