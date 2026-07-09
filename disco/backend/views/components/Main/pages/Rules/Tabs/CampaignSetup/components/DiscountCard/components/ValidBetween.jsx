import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { updateOption } from '../../../../../../../features/discount/discountSlice';
import DatePickerField from './DatePickerField';

const ValidBetween = () => {
	const dispatch = useDispatch();
	const { discount_valid_from, discount_valid_to } = useSelector(
		(state) => state.discount
	);

	const handleDateChange = (name, value) => {
		dispatch(updateOption({ option: name, value }));
	};

	return (
		<div
			className="disco-flex disco-items-center disco-py-1.5 disco-px-1 disco-border-[0.5px] disco-border-primary
		 disco-border-solid disco-rounded-lg disco-bg-white"
		>
			<DatePickerField
				testid="discount_valid_from"
				name="discount_valid_from"
				value={discount_valid_from}
				onDateChange={handleDateChange}
			/>
			<ArrowsRightLeftIcon className="disco-h-5 disco-w-5 disco-mx-3 disco-flex-shrink-0 disco-text-gray-500" />
			<DatePickerField
				testid="discount_valid_to"
				name="discount_valid_to"
				value={discount_valid_to}
				onDateChange={handleDateChange}
			/>
		</div>
	);
};

export default ValidBetween;
