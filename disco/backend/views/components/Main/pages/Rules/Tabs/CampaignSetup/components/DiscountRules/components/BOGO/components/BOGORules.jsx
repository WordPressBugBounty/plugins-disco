import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../../../../../components/Button';
import { addNewDiscountRule } from '../../../../../../../../../features/discount/discountSlice';
import BOGORuleItem from './BOGORuleItem';
import ComponentBox from '../../../../../../../../../components/ComponentBox';
import CommonHeadingBox from '../../../../../../../../../components/CommonHeadingBox';
const BOGORules = () => {
	const { discount_rules } = useSelector((state) => state.discount);
	const dispatch = useDispatch();

	// A recursive rule is a single repeating tier, so no extra rules are allowed.
	const hasRecursiveRule = discount_rules.some(
		(rule) => rule.recursive === 'yes'
	);

	const handleAddBOGORule = () => {
		dispatch(addNewDiscountRule());
	};

	return (
		<ComponentBox className="disco-mt-5">
			<CommonHeadingBox title={__('BOGO Rules', 'disco')} url="" />
			<div className="disco-p-4">
				<div className="disco-grid disco-grid-cols-12 disco-gap-4">
					<h4 className="disco-col-span-3 disco-font-medium disco-text-lg  disco-bg-gray-100 disco-p-2 disco-border disco-border-white disco-border-solid disco-rounded-t-lg">
						{__('Customer Buy', 'disco')}
					</h4>
					<h4 className="disco-col-span-9 disco-font-medium disco-text-lg  disco-bg-gray-100 disco-p-2 disco-border disco-border-white disco-border-solid disco-rounded-t-lg">
						{__('Customer Get', 'disco')}
					</h4>
				</div>
				<div className="disco-space-y-4">
					{discount_rules.map((rule, index) => (
						<BOGORuleItem key={rule.id} index={index} rule={rule} />
					))}
				</div>
			</div>

			{!hasRecursiveRule && (
				<div className="disco-flex disco-justify-between disco-items-center">
					<div className="disco-px-4 disco-py-2">
						<Button
							onClick={handleAddBOGORule}
							type="transparent"
							className="!disco-px-3 !disco-py-2 !disco-text-sm !disco-font-normal"
							icon={
								<PlusCircleIcon className="disco-h-5 disco-w-5 !disco-text-primary" />
							}
						>
							{__('Add More', 'disco')}
						</Button>
					</div>
				</div>
			)}
		</ComponentBox>
	);
};
export default BOGORules;
