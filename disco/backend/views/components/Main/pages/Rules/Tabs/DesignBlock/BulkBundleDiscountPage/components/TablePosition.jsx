import { useDispatch, useSelector } from 'react-redux';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import { __ } from '@wordpress/i18n';

const TablePosition = () => {
	const items = {
		before_add_to_cart: 'Before Add to Cart',
		after_add_to_cart: 'After Add to Cart',
	};

	const dispatch = useDispatch();
	const { table } = useSelector((state) => state.discount.design_blocks);

	return (
		<div className="disco-flex disco-gap-2 disco-items-center disco-mt-3">
			<div className="disco-text-sm disco-font-semibold">
				{__('Select Position', 'disco')}
			</div>
			<SingleSelect
				placeholder={__('Select Position', 'disco')}
				items={items}
				selected={table.position}
				onchange={(value) => {
					dispatch(updateTable({ name: 'position', value: value }));
				}} // Use prop function
				className="disco-bg-white disco-w-60"
				buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
			/>
		</div>
	);
};

export default TablePosition;
