import {
	ArrowTopRightOnSquareIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../components/Button';
import Popup from '../../../../../components/PopUp';
import { setTab } from '../../../../../features/discount/discountSlice';
import { dateTimeFormatter } from '../../../../../utilities/utilities';
import ConditionPreview from './ConditionPreview';
import { __ } from '@wordpress/i18n';

const CampaignSetupSummary = ({ className }) => {
	const {
		discount_intent,
		discount_rules,
		conditions,
		products,
		discount_max_user,
		discount_valid_from,
		discount_valid_to,
	} = useSelector((state) => state.discount);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const dispatch = useDispatch();
	const handleNavigation = () => {
		dispatch(setTab(0));
	};

	const totalProducts =
		products.length >= 1 && products[0] !== 'all'
			? `Total ${products.length} Products`
			: 'All Products';
	const userLimit = discount_max_user ? discount_max_user : 'Unlimited Users';

	let validBetween = '-';

	if (discount_valid_from && discount_valid_to) {
		validBetween = `${dateTimeFormatter(discount_valid_from)} - ${dateTimeFormatter(discount_valid_to)}`;
	} else if (discount_valid_from && !discount_valid_to) {
		validBetween = `${dateTimeFormatter(discount_valid_from)} - No end date`;
	}

	let discount_type = 'Mixed';
	let discount_value = 'Mixed';

	if (
		discount_rules.length === 1 &&
		(discount_intent === 'Product' || discount_intent === 'Cart')
	) {
		const type = discount_rules[0].discount_type;
		const value = discount_rules[0].discount_value;

		switch (type) {
			case 'percent':
				discount_type = 'Percentage';
				discount_value = value;
				break;
			case 'fixed':
				discount_type = 'Fixed Amount';
				discount_value = value;
				break;
			case 'fixed_per_product':
				discount_type = 'Fixed Per Product';
				discount_value = value;
				break;
			default:
				discount_type = 'Free Shipping';
				discount_value = 'Free Shipping';
		}
	}

	if (discount_rules.length === 1 && discount_intent === 'Shipping') {
		discount_type = 'Free Shipping';
		discount_value = 'Free Shipping';
	}

	const handleShowProductsModal = () => {
		setIsPopupOpen(true);
	};

	return (
		<div className={`${className}`}>
			<Popup
				title={__('Product Added', 'disco')}
				data={products}
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
			/>
			<div className="disco-flex disco-items-center disco-gap-3">
				<p className="disco-text-lg">
					{__('Campaign setup info', 'disco')}
				</p>
				<Button
					type="transparent"
					onClick={handleNavigation}
					testId="summery-edit-campaign"
					className="!disco-px-3 !disco-py-1 !disco-font-light disco-text-sm disco-border disco-border-gray-300 disco-rounded-lg"
					icon={
						<PencilSquareIcon className="disco-h-4 disco-w-4 disco-text-primary" />
					}
				>
					{__('Edit Now', 'disco')}
				</Button>
			</div>
			<div className="disco-mt-4 disco-p-4 disco-border disco-rounded-xl">
				<div className="disco-flex">
					<div className="disco-w-1/2 disco-flex disco-justify-between">
						<div className="disco-w-1/3">
							<p className="disco-text-base disco-mb-2">
								{__('Products', 'disco')}
							</p>
							<p className="disco-text-base disco-mb-2">
								{__('User Limit', 'disco')}
							</p>
							<p className="disco-text-base disco-mb-2">
								{__('Valid Between', 'disco')}
							</p>
						</div>
						<div className="disco-w-2/3">
							<div className="disco-text-base disco-flex disco-font-light disco-mb-2 disco-gap-1">
								{totalProducts}
								<button onClick={handleShowProductsModal}>
									{products.length >= 1 &&
										products[0] !== 'all' && (
											<ArrowTopRightOnSquareIcon className="disco-h-5 disco-w-5 disco-font-base disco-text-primary" />
										)}
								</button>
							</div>
							<div className="disco-text-base disco-font-light disco-mb-2">
								{userLimit}
							</div>
							<div className="disco-text-base disco-font-light disco-mb-2">
								{validBetween}
							</div>
						</div>
					</div>
					<div className="disco-w-1/2 disco-flex disco-justify-between">
						<div className="disco-w-1/3">
							<p className="disco-text-base disco-mb-2">
								{__('Discount Type:', 'disco')}
							</p>
							<p className="disco-text-base disco-mb-2">
								{__('Discount Value:', 'disco')}
							</p>
						</div>
						<div className="disco-w-2/3">
							<div className="disco-text-base disco-font-light disco-mb-2">
								{discount_type}
							</div>
							<div className="disco-text-base disco-font-light disco-mb-2">
								{discount_value}
							</div>
						</div>
					</div>
				</div>
				<div className="disco-space-y-4 disco-mt-4">
					<h3 className="disco-text-lg disco-font-light disco-flex disco-gap-2">
						{__('Applied Condition:', 'disco')}
						{conditions.length === 0 && (
							<div className="disco-text-base disco-flex disco-items-center">
								{__('No Conditions Applied', 'disco')}
							</div>
						)}
					</h3>
					<ConditionPreview conditions={conditions} />
				</div>
			</div>
		</div>
	);
};

export default CampaignSetupSummary;
