import { useSelector } from 'react-redux';
import BOGOSection from './components/BOGO/BOGOSection';
import SetBulkOrBundle from './components/BulkAndBundle/SetBulkOrBundle';
import DiscountType from './components/DiscountType';

const DiscountRules = () => {
	const { discount_intent } = useSelector((state) => state.discount);

	let content = '';

	switch (discount_intent) {
		case 'Product':
		case 'Cart':
			content = <DiscountType />;
			break;
		case 'Shipping':
			content = '';
			break;
		case 'BOGO':
			content = <BOGOSection />;
			break;
		case 'Bulk':
			content = <SetBulkOrBundle />;
			break;
		case 'Bundle':
			content = <SetBulkOrBundle />;
			break;
		default:
			break;
	}

	return <div className="disco-mx-5">{content}</div>;
};
export default DiscountRules;
