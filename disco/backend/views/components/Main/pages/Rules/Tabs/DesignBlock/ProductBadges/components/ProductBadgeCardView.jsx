import { __ } from '@wordpress/i18n';
import { useDispatch } from 'react-redux';
import product1 from '../../../../../../../../asset/img/badge-images/product-placeholder/product1.svg';
import Button from '../../../../../../components/Button';
import { updateBadge } from '../../../../../../features/discount/discountSlice';
import productBadgeDesign, {
	DEFAULT_PRODUCT_BADGE_DESIGN,
} from '../../../../../../utilities/product-badge-design';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import Rating from '../../components/Rating';
import ProductBadgePreview from './ProductBadgePreview';

const ProductBadgeCardView = ({ setSelectedBadge }) => {
	const dispatch = useDispatch();

	const handleResetBanner = () => {
		// Reset to first banner design (banner1)
		dispatch(
			updateBadge({
				name: 'container',
				value: productBadgeDesign.editable[0].container,
			})
		);
		dispatch(
			updateBadge({
				name: 'title',
				value: productBadgeDesign.editable[0]?.title,
			})
		);
		dispatch(
			updateBadge({
				name: 'selected_design',
				value: DEFAULT_PRODUCT_BADGE_DESIGN,
			})
		);

		dispatch(
			updateBadge({
				name: 'badge_type',
				value: 'editable',
			})
		);

		setSelectedBadge('editable');
	};

	return (
		<BadgeCardContainer className="disco-bg-white disco-max-h-[480px] !disco-rounded-xl disco-top-20 !disco-sticky disco-flex-col">
			<div className="disco-bg-gray-25 disco-border-2 disco-border-white disco-rounded-xl disco-p-4">
				<div className="disco-bg-white disco-flex disco-items-start disco-justify-center disco-rounded-lg disco-py-6 disco-px-6 disco-relative">
					<img
						src={product1}
						alt="img"
						className="disco-h-52 disco-w-50"
					/>
					{/* Preview badge */}
					<ProductBadgePreview />
					{/* Preview badge */}
				</div>
				<p className="disco-text-xl disco-font-medium disco-text-black disco-mt-1">
					{__('Summer Kids T-shirt', 'disco')}
				</p>
				<Rating
					ratingHight={4}
					ratingWidth={4}
					ratingAvgClass="!disco-text-lg"
					totalReviewClass="!disco-text-base"
				/>
				<div className="disco-mt-1 disco-flex disco-justify-between disco-items-center">
					<div className="disco-flex disco-gap-2 disco-items-center">
						<span className="!disco-text-xl disco-font-bold">
							$165
						</span>
						<span className="disco-text-xl disco-line-through disco-decoration-red-500">
							$285
						</span>
					</div>
				</div>
			</div>
			<div className="disco-flex disco-justify-center disco-gap-2 disco-py-2">
				<Button
					type="transparent"
					className="disco-border-red-500"
					onClick={handleResetBanner}
				>
					{__('Reset All', 'disco')}
				</Button>
			</div>
		</BadgeCardContainer>
	);
};

export default ProductBadgeCardView;
