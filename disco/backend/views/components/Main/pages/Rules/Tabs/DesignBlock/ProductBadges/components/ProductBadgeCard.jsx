import { __ } from '@wordpress/i18n';
import product1 from '../../../../../../../../asset/img/badge-images/product-placeholder/product1.svg';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import Rating from '../../components/Rating';
import ProductBadgePreview from './ProductBadgePreview';

const ProductBadgeCard = ({ className }) => {
	return (
		<BadgeCardContainer className={`disco-p-4 ${className}`}>
			<div className="disco-bg-gray-50 disco-border disco-border-white disco-rounded-md disco-p-3">
				<div className="disco-bg-white disco-flex disco-items-start disco-justify-center disco-rounded-md disco-py-6 disco-relative">
					<img
						src={product1}
						alt="img"
						className="disco-h-24 disco-w-52"
					/>
					{/* Preview badge */}
					<ProductBadgePreview size="small" />
				</div>
				<p className="disco-text-sm disco-font-medium disco-text-black disco-mt-1">
					{__('Summer Kid&apos;s T-shirt', 'disco')}
				</p>
				<Rating />
				<div className="disco-mt-1 disco-flex disco-justify-between disco-items-center">
					<div className="disco-flex disco-gap-2 disco-items-center">
						<span className="disco-text-base disco-font-bold">
							$165
						</span>
						<span className="disco-text-sm disco-line-through disco-decoration-red-500">
							$285
						</span>
					</div>
				</div>
			</div>
		</BadgeCardContainer>
	);
};
export default ProductBadgeCard;
