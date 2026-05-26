import { useDispatch } from 'react-redux';
import product2 from '../../../../../../../../asset/img/badge-images/product-placeholder/product2.svg';
import Button from '../../../../../../components/Button';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import { bulkBundleTableDesign } from '../../../../../../utilities/bulk-bundle-table';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import Rating from '../../components/Rating';
import TableView from '../../components/TableView';
import { __ } from '@wordpress/i18n';

const DiscountView = () => {
	const dispatch = useDispatch();
	const handleReset = () => {
		const selectedDesign = bulkBundleTableDesign['table1'];

		if (selectedDesign) {
			for (const key in selectedDesign) {
				if (Object.prototype.hasOwnProperty.call(selectedDesign, key)) {
					dispatch(
						updateTable({
							name: key,
							value: selectedDesign[key],
						})
					);
				}
			}
		}
	};

	return (
		<BadgeCardContainer className=" disco-h-[400px] disco-top-0 !disco-sticky">
			<div>
				<div className="disco-flex disco-items-start disco-gap-3 disco-bg-gray-50 disco-border disco-border-white disco-rounded-md disco-p-4">
					<div className="disco-flex disco-flex-shrink-0 disco-bg-white disco-justify-center disco-items-center disco-rounded-md disco-p-2">
						<img src={product2} alt="img" className="disco-h-24" />
					</div>
					<div>
						<p className="disco-text-base disco-font-medium disco-text-black">
							{__('Man Half T-Shirt', 'disco')}
						</p>
						<div className="disco-mt-0.5 disco-flex disco-justify-between disco-items-center">
							<div className="disco-flex disco-gap-2 disco-items-center">
								<span className="disco-text-lg disco-font-bold">
									$165
								</span>
								<span className="disco-text-base disco-line-through disco-decoration-red-500">
									$285
								</span>
							</div>
						</div>
						<div className="disco-flex disco-gap-1 disco-items-center disco-mt-0.5">
							<Rating
								rating={4}
								ratingHight={4}
								ratingWidth={4}
								ratingAvgClass="!disco-text-base"
								totalReviewClass="!disco-text-xs"
							/>
						</div>
						<button className="disco-text-blue-400 disco-text-xs disco-border disco-border-blue-400 disco-w-full disco-p-0.5 disco-mt-2">
							{__('Add to Cart', 'disco')}
						</button>
						<div className="disco-mt-2">
							<TableView />
						</div>
					</div>
				</div>
				<div className="disco-flex disco-justify-center disco-gap-4 disco-py-4">
					<Button
						type="transparent"
						className="disco-border-red-500"
						onClick={handleReset}
					>
						{__('Reset All', 'disco')}
					</Button>
				</div>
			</div>
		</BadgeCardContainer>
	);
};

export default DiscountView;
