import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import bulkBundleTable, {
	bulkBundleTableDesign,
} from '../../../../../../utilities/bulk-bundle-table';

const TableItems = () => {
	const [selectedName, setSelectedName] = useState(null);
	const { discount_intent } = useSelector((state) => state.discount);

	const tableItems = bulkBundleTable[discount_intent.toLowerCase()];

	const dispatch = useDispatch();
	const handleSelect = (name) => {
		setSelectedName(name);

		const selectedDesign = bulkBundleTableDesign[name];

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
		<div className="disco-max-h-[320px] disco-overflow-y-auto disco-overscroll-contain disco-no-scrollbar lg:disco-grid-cols-2 disco-gap-2 disco-grid">
			{Object.entries(tableItems).map(([name, tableImage]) => {
				const isSelected = selectedName === name;

				return (
					<div
						key={name}
						data-testid="bulk-table-design-item"
						onClick={() => handleSelect(name)}
						className={`disco-flex disco-flex-col disco-mb-4 disco-items-center disco-justify-center disco-bg-white disco-border disco-rounded-md disco-cursor-pointer transition-all duration-200 ${
							isSelected
								? 'disco-border-primary' // Highlighted style for selected item
								: 'disco-border-gray-200 hover:disco-border-gray-400' // Default/hover style
						}`}
					>
						<img
							src={tableImage}
							alt={name}
							className="disco-object-contain disco-w-full disco-h-auto disco-rounded-md"
						/>
					</div>
				);
			})}
		</div>
	);
};

export default TableItems;
