import { useDispatch, useSelector } from 'react-redux';
import ComingSoon from '../../../../../components/ComingSoon';
import { updateCartPage } from '../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../hooks/useIsPro';
import BadgeActions from '../components/BadgeActions';
import BadgeComponentContainer from '../components/BadgeComponentContainer';
import BadgeTitle from '../components/BadgeTitle';
import ProFeatureButton from '../components/ProFeatureButton';
import Status from '../components/Status';
import CartCard from './components/CartCard';
import { __ } from '@wordpress/i18n';

const CartPage = ({ comingSoon = false }) => {
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const dispatch = useDispatch();
	const isPro = useIsPro();

	const tryNowUrl =
		'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1';

	const handleStatus = (status) => {
		dispatch(updateCartPage({ name: 'enable', value: status }));
	};

	return (
		<BadgeComponentContainer>
			<div className="disco-relative">{comingSoon && <ComingSoon />}</div>
			<CartCard />
			<BadgeTitle
				title={__('Cart Notice', 'disco')}
				url="https://discoplugin.com/docs/display-cart-notice/"
				className="disco-mt-3"
			/>
			<BadgeActions>
				<Status
					status={cart?.enable || false}
					handleStatus={handleStatus}
					disabled={!isPro}
					dataTestid="cart-notice-status"
				/>
				<ProFeatureButton
					tryNowUrl={tryNowUrl}
					componentToEdit="CartPageEdit"
					testId="cart-notice"
				/>
			</BadgeActions>
		</BadgeComponentContainer>
	);
};

export default CartPage;
