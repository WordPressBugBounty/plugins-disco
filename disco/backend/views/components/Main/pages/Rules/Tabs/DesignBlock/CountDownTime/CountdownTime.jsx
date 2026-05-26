import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import ComingSoon from '../../../../../components/ComingSoon';
import { updateCountdown } from '../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../hooks/useIsPro';
import BadgeActions from '../components/BadgeActions';
import BadgeComponentContainer from '../components/BadgeComponentContainer';
import BadgeTitle from '../components/BadgeTitle';
import ProFeatureButton from '../components/ProFeatureButton';
import Status from '../components/Status';
import CountdownTimeCard from './components/CountdownTimeCard';

const CountdownTime = ({ comingSoon = false }) => {
	const dispatch = useDispatch();
	const { countdown } = useSelector((state) => state.discount.design_blocks);
	const isPro = useIsPro();

	const tryNowUrl =
		'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1';

	const handleStatus = (status) => {
		dispatch(updateCountdown({ name: 'enable', value: status }));
	};

	return (
		<BadgeComponentContainer>
			<div className="disco-relative">{comingSoon && <ComingSoon />}</div>
			<CountdownTimeCard />
			<BadgeTitle
				title={__('Countdown Time', 'disco')}
				url="https://discoplugin.com/docs/display-countdown-timer/"
				className="disco-mt-3"
			/>
			<BadgeActions>
				<Status
					status={countdown?.enable || false}
					handleStatus={handleStatus}
					disabled={!isPro}
					dataTestid="countdown-time-status"
				/>
				<ProFeatureButton
					tryNowUrl={tryNowUrl}
					componentToEdit="CountdownTimeEdit"
					testId="countdown-time"
				/>
			</BadgeActions>
		</BadgeComponentContainer>
	);
};

export default CountdownTime;
