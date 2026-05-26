import { useDispatch, useSelector } from 'react-redux';
import { updateOption } from '../../../../../../../features/discount/discountSlice';
import {RadioGroup} from "@headlessui/react";
import {__} from "@wordpress/i18n";
import {useEffect, useState} from "react";

const buttons = {all:'All Products', products: 'Few Products'}

const FilterAllFewRadio = () => {
	const { products } = useSelector((state) => state.discount);
	const dispatch = useDispatch();
	const [selected,setSelected]=useState('all')
	const handleChange = (type) => {
		setSelected(type)
		if(type === 'all') {
			dispatch(updateOption({option:"products", value: ['all']}))
		} else {
			dispatch(updateOption({option:"products", value: []}))

		}
	};

	useEffect(() => {
		if(products[0] === 'all') {
			setSelected('all');
		} else {
			setSelected('products');
		}
	}, [products]);

	return (
		<div className="disco-flex disco-items-center disco-gap-6">
			<RadioGroup
				className="disco-flex disco-rounded-lg disco-border disco-overflow-hidden disco-border-primary disco-items-stretch disco-z-[2] disco-shadow-custom"
				value={selected}
				onChange={handleChange}
			>

				{Object.keys(buttons).map((key) => (
					<RadioGroup.Option key={key} className={({checked})=>`disco-text-sm !disco-px-4 !disco-py-2 disco-cursor-pointer  disco-font-border disco-select-none ${
						checked
							? ' disco-bg-primary disco-text-white'
							: 'disco-bg-white'
					} `} value={key}>

						{__(buttons[key],'disco')}

					</RadioGroup.Option>
				))}
			</RadioGroup>
		</div>
	);
};
export default FilterAllFewRadio;
