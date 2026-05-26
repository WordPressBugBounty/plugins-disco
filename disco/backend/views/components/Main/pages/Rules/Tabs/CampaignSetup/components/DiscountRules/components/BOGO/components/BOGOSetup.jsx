import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeadingBox from '../../../../../../../../../components/CommonHeadingBox';
import ComponentBox from '../../../../../../../../../components/ComponentBox';
import LoadingSpinner from '../../../../../../../../../components/LoadingSpinner';
import SingleSelect from '../../../../../../../../../components/SingleSelect';
import {
	useGetBOGOTypesQuery,
	useGetDiscountBasedOnQuery,
} from '../../../../../../../../../features/discount/discountApi';
import { changeBOGOType } from '../../../../../../../../../features/discount/discountSlice';

const BOGOSetup = () => {
	const dispatch = useDispatch();
	const { bogo_type } = useSelector((state) => state.discount);

	const { isLoading } = useGetDiscountBasedOnQuery();
	const { data: bogoTypes, isLoading: bogoTypesLoading } =
		useGetBOGOTypesQuery();

	const handleBOGOTypeChange = (active) => {
		dispatch(changeBOGOType(active));
	};

	if (isLoading || bogoTypesLoading) {
		return (
			<ComponentBox className="disco-mt-5">
				<CommonHeadingBox title={__('BOGO', 'disco')} url="" />
				<div className="disco-p-3">
					<LoadingSpinner />
				</div>
			</ComponentBox>
		);
	}

	return (
		<ComponentBox className="disco-mt-5 disco-rounded-xl">
			<CommonHeadingBox title={__('BOGO', 'disco')} url="" />
			<div className="disco-p-4">
				<div className="disco-grid disco-grid-cols-12 disco-items-center">
					<div className="disco-col-span-2">
						<p className="disco-text-base disco-font-medium disco-text-black">
							{__('BOGO Type', 'disco')}
						</p>
					</div>
					<div className="disco-col-span-3">
						<SingleSelect
							items={bogoTypes.values}
							placeholder={__('Select BOGO Type', 'disco')}
							selected={bogo_type}
							onchange={handleBOGOTypeChange}
						/>
					</div>
				</div>
			</div>
		</ComponentBox>
	);
};
export default BOGOSetup;
