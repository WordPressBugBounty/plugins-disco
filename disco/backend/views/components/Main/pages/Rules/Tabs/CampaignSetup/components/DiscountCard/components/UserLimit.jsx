import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../../../components/Input';
import { updateOption } from '../../../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../../../hooks/useIsPro';

const UserLimit = () => {
	const dispatch = useDispatch();
	const { discount_max_user, discount_intent } = useSelector((state) => state.discount);
	const isPro = useIsPro();

	const handleChange = (e) => {
		dispatch(
			updateOption({ option: e.target.name, value: e.target.value })
		);
	};

	return (
		<Input
			onChange={handleChange}
			name="discount_max_user"
			value={discount_max_user === '0' ? '' : discount_max_user}
			type="number"
			className="disco-w-full !disco-px-0.5 !disco-ps-2"
			placeholder={ !isPro && discount_intent !== 'Product' ? __('', 'disco') : __('Unlimited', 'disco')}
			disabled={ !isPro && discount_intent !== 'Product' }
		/>
	);
};
export default UserLimit;
