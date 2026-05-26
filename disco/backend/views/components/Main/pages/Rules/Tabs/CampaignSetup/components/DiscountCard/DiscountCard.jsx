import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';
import CommonHeadingBox from '../../../../../../components/CommonHeadingBox';
import ComponentBox from '../../../../../../components/ComponentBox';
import ChildElement from './components/ChildElement';
import ChoseProducts from './components/ChoseProducts';
import FilterAllFewRadio from './components/FilterAllFewRadio';
import UserLimit from './components/UserLimit';
import ValidBetween from './components/ValidBetween';
const DiscountCard = () => {
	const { products } = useSelector((state) => state.discount);

	return (
		<div className="disco-mx-5">
			<ComponentBox className="disco-mt-5 disco-rounded-xl">
				<CommonHeadingBox
					title={__('Discount', 'disco')}
					url="https://discoplugin.com/docs/discount-rules/"
				/>
				<div className="disco-p-4">
					<ChildElement heading={__('Filter Products', 'disco')} />
					<FilterAllFewRadio />
				</div>

				{products[0] !== 'all' && (
					<ChildElement className="disco-px-4">
						<ChoseProducts />
					</ChildElement>
				)}

				<div className="disco-px-3 disco-py-4 disco-flex disco-gap-3">
					<ChildElement
						heading={__('User Limit', 'disco')}
						className="disco-w-1/5"
					>
						<UserLimit />
					</ChildElement>

					<ChildElement
						className="!disco-border-b-0"
						heading={__('Valid Between', 'disco')}
					>
						<ValidBetween />
					</ChildElement>
				</div>
			</ComponentBox>
		</div>
	);
};
export default DiscountCard;
