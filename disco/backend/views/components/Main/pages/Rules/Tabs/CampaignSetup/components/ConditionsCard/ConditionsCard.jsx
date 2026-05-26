import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../../components/Button';
import { addConditionGroup } from '../../../../../../features/discount/discountSlice';
import Conditions from './components/Conditions';
import CommonHeadingBox from '../../../../../../components/CommonHeadingBox';
import ComponentBox from '../../../../../../components/ComponentBox';

const ConditionsCard = () => {
	const dispatch = useDispatch();
	const { conditions } = useSelector((state) => state.discount);

	const handleAddConditionGroup = () => {
		dispatch(addConditionGroup());
	};

	return (
		<div className="disco-mx-5">
			<ComponentBox className="disco-mt-5 disco-rounded-xl">
				<div>
					<CommonHeadingBox
						title={__('Conditions', 'disco')}
						url="https://discoplugin.com/docs-category/discount-conditions/"
					/>
				</div>
				{conditions.length > 0 && <Conditions />}

				<div
					className={`disco-flex disco-justify-center disco-items-center ${conditions.length > 0 ? 'disco-py-4' : 'disco-py-12'}`}
				>
					<Button
						className="!disco-px-2 !disco-py-2 !disco-text-regular !disco-font-regular"
						onClick={handleAddConditionGroup}
						type={'transparent'}
						icon={
							<PlusCircleIcon className="disco-h-6 disco-w-6 disco-text-primary" />
						}
					>
						{__('Add Condition', 'disco')}
					</Button>
				</div>
			</ComponentBox>
		</div>
	);
};
export default ConditionsCard;
