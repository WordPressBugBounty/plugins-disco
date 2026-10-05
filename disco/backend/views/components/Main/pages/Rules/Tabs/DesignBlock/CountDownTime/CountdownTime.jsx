import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateCountdown } from '../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../hooks/useIsPro';
import BadgeActions from '../components/BadgeActions';
import BadgeComponentContainer from '../components/BadgeComponentContainer';
import BadgeTitle from '../components/BadgeTitle';
import ProFeatureButton from '../components/ProFeatureButton';
import Status from '../components/Status';
import CountdownTimeCard from './components/CountdownTimeCard';

const CountdownTime = () => {
	const dispatch = useDispatch();
	const { countdown } = useSelector((state) => state.discount.design_blocks);
	const isPro = useIsPro();

	const tryNowUrl =
		'https://discoplugin.com/pricing/?utm_source=disco-plugin&utm_medium=in-plugin&utm_campaign=display-settings&utm_content=countdown-upgrade';

	const handleStatus = (status) => {
		dispatch(updateCountdown({ name: 'enable', value: status }));
	};

	return (
		<BadgeComponentContainer>
			<CountdownTimeCard />
			<BadgeTitle
				title={__('Countdown Time', 'disco')}
				url="https://discoplugin.com/docs/display-countdown-timer/?utm_source=disco-plugin&utm_medium=in-plugin&utm_campaign=display-settings&utm_content=countdown-docs"
				className="disco:mt-3"
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
