import ComponentContainer from '../../../../../components/ComponentContainer';
import useIsPro from '../../../../../hooks/useIsPro';
import BulkBundleDiscountPage from '../BulkBundleDiscountPage/BulkBundleDiscountPage';
import CartPage from '../CartPage/CartPage';
import CountdownTime from '../CountDownTime/CountdownTime';
import ProductBadges from '../ProductBadges/ProductBadges';
import TextHighlight from '../TextHighlight/TextHighlight';
import FeaturePreviewCards from './FeaturePreviewCards/FeaturePreviewCards';
import UnlockProBanner from './UnlockPro/UnlockProBanner';

const RenderBlocks = ({ discount_intent }) => {
	const isProActive = useIsPro();

	const renderComponent = () => {
		switch (discount_intent) {
			case 'Product':
				return (
					<>
						<ProductBadges />
						<CountdownTime />
						<TextHighlight />
					</>
				);
			case 'Cart':
				return (
					<>
						<ProductBadges />
						<CartPage />
						<CountdownTime />
						<TextHighlight />
					</>
				);
			case 'Shipping':
				return (
					<>
						<ProductBadges />
						<CartPage />
						{/* <TextHighlight /> */}
						<CountdownTime />
					</>
				);
			case 'Bulk':
				return (
					<>
						<ProductBadges />
						<BulkBundleDiscountPage />
						<TextHighlight />
						<CountdownTime />
					</>
				);
			case 'Bundle':
				return (
					<>
						<ProductBadges />
						<BulkBundleDiscountPage />
						<TextHighlight />
						<CountdownTime />
					</>
				);
			case 'BOGO':
				return (
					<>
						<ProductBadges />
						<TextHighlight />
						<CountdownTime />
					</>
				);

			default:
				return null;
		}
	};

	if (!isProActive) {
		return (
			<div className="disco-flex disco-flex-col disco-gap-4 disco-bg-[#f6f7f9] disco-p-4 disco-rounded-b-xl">
				<UnlockProBanner />
				<FeaturePreviewCards />
			</div>
		);
	}

	return (
		<ComponentContainer className="disco-max-h-[calc(100vh-200px)] disco-overflow-y-auto disco-no-scrollbar disco-overscroll-contain disco-grid disco-gap-4 disco-grid-cols-3 2xl:disco-grid-cols-4 3xl:disco-grid-cols-5 disco-pb-5">
			{renderComponent()}
		</ComponentContainer>
	);
};

export default RenderBlocks;
