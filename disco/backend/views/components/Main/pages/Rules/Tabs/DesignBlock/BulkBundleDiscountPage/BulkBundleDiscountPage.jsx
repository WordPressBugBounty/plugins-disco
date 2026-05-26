import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateTable } from '../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../hooks/useIsPro';
import BadgeActions from '../components/BadgeActions';
import BadgeComponentContainer from '../components/BadgeComponentContainer';
import BadgeTitle from '../components/BadgeTitle';
import ProFeatureButton from '../components/ProFeatureButton';
import Status from '../components/Status';
import DiscountCard from './components/DiscountCard';

const BulkBundleDiscountPage = () => {
	const { table } = useSelector((state) => state.discount.design_blocks);
	const { discount_intent } = useSelector((state) => state.discount);
	const dispatch = useDispatch();
	const isPro = useIsPro();

	const docUrl =
		discount_intent === 'Bulk'
			? 'https://discoplugin.com/docs/display-woocommerce-bulk-discount-table/'
			: 'https://discoplugin.com/docs/display-bundle-discount-table-in-woocommerce/';

	const tryNowUrl =
		discount_intent === 'Bulk'
			? 'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1'
			: 'https://discoplugin.com/pricing/?utm_source=bundle-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1';

	const handleStatus = (status) => {
		dispatch(updateTable({ name: 'enable', value: status }));
	};

	return (
		<BadgeComponentContainer>
			<DiscountCard />

			<BadgeTitle
				title={__(`${discount_intent} Table`, 'disco')}
				url={docUrl}
				className="disco-mt-3"
			/>

			<BadgeActions>
				<Status
					status={table?.enable || false}
					handleStatus={handleStatus}
					disabled={!isPro}
					dataTestid={`${discount_intent.toLowerCase()}-table-status`}
				/>

				<ProFeatureButton
					tryNowUrl={tryNowUrl}
					componentToEdit="BulkBundleDiscountEdit"
					testId={`${discount_intent.toLowerCase()}-table`}
				/>
			</BadgeActions>
		</BadgeComponentContainer>
	);
};

export default BulkBundleDiscountPage;
