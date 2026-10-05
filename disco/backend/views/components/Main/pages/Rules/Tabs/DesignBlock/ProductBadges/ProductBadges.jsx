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
		'https://discoplugin.com/pricing/?utm_source=disco-plugin&utm_medium=in-plugin&utm_campaign=display-settings&utm_content=product-badge-upgrade';

	const handleStatus = (status) => {
		dispatch(updateBadge({ name: 'enable', value: status }));
	};

	return (
		<BadgeComponentContainer>
			<ProductBadgeCard />
			<BadgeTitle
				title={__('Product Badge', 'disco')}
				url="https://discoplugin.com/docs/display-product-badge-in-woocommerce/?utm_source=disco-plugin&utm_medium=in-plugin&utm_campaign=display-settings&utm_content=product-badge-docs"
				className="disco:mt-3"
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
	);
};
export default ProductBadges;
