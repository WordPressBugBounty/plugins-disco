import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartPage } from '../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../hooks/useIsPro';
import BadgeActions from '../components/BadgeActions';
import BadgeComponentContainer from '../components/BadgeComponentContainer';
import BadgeTitle from '../components/BadgeTitle';
import ProFeatureButton from '../components/ProFeatureButton';
import Status from '../components/Status';
import CartCard from './components/CartCard';

const CartPage = () => {
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const dispatch = useDispatch();
	const isPro = useIsPro();

	const tryNowUrl =
		'https://discoplugin.com/pricing/?utm_source=disco-plugin&utm_medium=in-plugin&utm_campaign=display-settings&utm_content=cart-notice-upgrade';

	const handleStatus = (status) => {
		dispatch(updateCartPage({ name: 'enable', value: status }));
	};

	return (
		<BadgeComponentContainer>
			<CartCard />
			<BadgeTitle
				title={__('Cart Notice', 'disco')}
				url="https://discoplugin.com/docs/display-cart-notice/?utm_source=disco-plugin&utm_medium=in-plugin&utm_campaign=display-settings&utm_content=cart-notice-docs"
				className="disco:mt-3"
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
