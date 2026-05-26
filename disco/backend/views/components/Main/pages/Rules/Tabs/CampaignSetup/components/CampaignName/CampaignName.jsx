import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../../components/Input';
import { updateOption } from '../../../../../../features/discount/discountSlice';
import ComponentBox from "../../../../../../components/ComponentBox";

const CampaignName = () => {
	const dispatch = useDispatch();
	const { name } = useSelector((state) => state.discount);

	const handleNameChange = (e) => {
		dispatch(updateOption({ option: 'name', value: e.target.value }));
	};
	return (
		<div className="disco-mx-5">
			<ComponentBox className="disco-flex disco-items-center disco-justify-center disco-mt-5 disco-pb-9 disco-pt-5 disco-rounded-xl">
				<div className="disco-flex disco-items-center disco-flex-col disco-space-y-4">
					<h3 className="disco-text-xl disco-font-normal">
						{__('Campaign Name', 'disco')}
						<span className="disco-text-red-600 -disco-mt-2"> *</span>
					</h3>
					<Input
						name="campaign_name"
						value={name}
						onChange={handleNameChange}
						className="disco-w-80"
						placeholder="20% discount on all products"
					/>
				</div>
			</ComponentBox>
		</div>
	);
};
export default CampaignName;
