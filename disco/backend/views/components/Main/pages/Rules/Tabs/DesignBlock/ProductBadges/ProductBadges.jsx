import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateBadge } from '../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../hooks/useIsPro';
import BadgeActions from '../components/BadgeActions';
import BadgeComponentContainer from '../components/BadgeComponentContainer';
import BadgeTitle from '../components/BadgeTitle';
import ProFeatureButton from '../components/ProFeatureButton';
import Status from '../components/Status';
import ProductBadgeCard from './components/ProductBadgeCard';

const ProductBadges = () => {
	const dispatch = useDispatch();
	const { badge } = useSelector((state) => state.discount.design_blocks);
	const isPro = useIsPro();

	const tryNowUrl =
		'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1';

	const handleStatus = (status) => {
		dispatch(updateBadge({ name: 'enable', value: status }));
	};

	return (
		<div>
			<BadgeComponentContainer>
				<ProductBadgeCard />
				<BadgeTitle
					title={__('Product Badge', 'disco')}
					url="https://discoplugin.com/docs/display-product-badge-in-woocommerce/"
					className="disco-mt-3"
				/>
				<BadgeActions>
					<Status
						status={badge?.enable || false}
						handleStatus={handleStatus}
						disabled={!isPro}
						dataTestid="product-badge-status"
					/>
					<ProFeatureButton
						tryNowUrl={tryNowUrl}
						componentToEdit="ProductBadgeEdit"
						testId="product-badge"
					/>
				</BadgeActions>
			</BadgeComponentContainer>
		</div>
	);
};
export default ProductBadges;
