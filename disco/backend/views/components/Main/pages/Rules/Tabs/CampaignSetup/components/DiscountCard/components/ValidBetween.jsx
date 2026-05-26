import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../../../components/Input';
import { updateOption } from '../../../../../../../features/discount/discountSlice';

const ValidBetween = () => {
	const dispatch = useDispatch();
	const { discount_valid_from, discount_valid_to } = useSelector(
		(state) => state.discount
	);

	const handleDateChange = (e) => {
		if (e.target.value) {
			dispatch(
				updateOption({
					option: e.target.name,
					value: moment(e.target.value).format(),
				})
			);
		} else {
			dispatch(
				updateOption({
					option: e.target.name,
					value: e.target.value,
				})
			);
		}
	};

	return (
		<div className="disco-flex disco-items-center disco-p-1 disco-border disco-border-solid disco-rounded-lg disco-bg-white">
			<Input
				testid="discount_valid_from"
				onChange={handleDateChange}
				name="discount_valid_from"
				value={
					discount_valid_from &&
					moment(discount_valid_from).format('YYYY-MM-DDTHH:mm')
				}
				type="datetime-local"
				className="!disco-py-0"
			/>
			<ArrowsRightLeftIcon className="disco-h-5 disco-w-5 disco-mx-3 disco-flex-shrink-0 disco-text-gray-500" />
			<Input
				testid="discount_valid_to"
				onChange={handleDateChange}
				name="discount_valid_to"
				value={
					discount_valid_to &&
					moment(discount_valid_to).format('YYYY-MM-DDTHH:mm')
				}
				type="datetime-local"
				className="!disco-py-0 disco-text-regular"
			/>
		</div>
	);
};
export default ValidBetween;
