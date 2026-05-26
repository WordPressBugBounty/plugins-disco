import BulkBundleDiscountEdit from '../BulkBundleDiscountPage/BulkBundleDiscountEdit';
import CartPageEdit from '../CartPage/CartPageEdit';
import CountdownTimeEdit from '../CountDownTime/CountdownTimeEdit';
import ProductBadgeEdit from '../ProductBadges/ProductBadgeEdit';
import TextHighlightEdit from '../TextHighlight/TextHighlightEdit';

const RenderEditor = ({ componentName }) => {
	const renderComponentEditor = () => {
		switch (componentName) {
			case 'BulkBundleDiscountEdit':
				return <BulkBundleDiscountEdit />;
			case 'CartPageEdit':
				return <CartPageEdit />;
			case 'CountdownTimeEdit':
				return <CountdownTimeEdit />;
			case 'TextHighlightEdit':
				return <TextHighlightEdit />;
			case 'ProductBadgeEdit':
				return <ProductBadgeEdit />;
			default:
				return null;
		}
	};

	return <>{renderComponentEditor()}</>;
};

export default RenderEditor;
