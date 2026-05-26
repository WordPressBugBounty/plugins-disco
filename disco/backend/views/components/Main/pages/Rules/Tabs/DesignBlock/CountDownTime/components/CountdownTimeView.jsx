import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../../components/Button';
import { updateCountdown } from '../../../../../../features/discount/discountSlice';
import {
	countdownDesigns,
	DEFAULT_COUNTDOWN_DESIGN,
} from '../../../../../../utilities/count-down';
import {
	buildDefaultCountdownState,
	calculateTimeLeft,
	getBoxStyle,
	getContainerStyle,
	getTimeUnits,
	replaceVariables,
	toStyleObject,
} from '../../../../../../utilities/countdown-style';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import CountdownTimer from './CountdownTimer';
import ProductPreviewCard from './ProductPreviewCard';

const CountdownTimeView = () => {
	const dispatch = useDispatch();
	const { countdown } = useSelector((state) => state.discount.design_blocks);
	const { discount_valid_to } = useSelector((state) => state.discount);

	// Extract countdown properties
	const {
		title = {},
		subtitle = {},
		container = {},
		box = {},
		number = {},
		label = {},
		separator = {},
		hasSeparator = false,
		singleContainer = false,
	} = countdown || {};

	// Reset all to default design
	const handleResetAll = () => {
		const defaultDesign = countdownDesigns[DEFAULT_COUNTDOWN_DESIGN];
		if (!defaultDesign) return;

		const defaultState = buildDefaultCountdownState(defaultDesign);

		// Dispatch all updates
		Object.entries(defaultState).forEach(([name, value]) => {
			dispatch(updateCountdown({ name, value }));
		});
	};

	// Calculate styles
	const timeUnits = getTimeUnits(calculateTimeLeft(discount_valid_to));

	// When hasSeparator is true, separator color should match box background.
	let separatorStyle = toStyleObject(separator);
	if (hasSeparator) {
		separatorStyle = {
			...separatorStyle,
			color: box?.background || '#FFFFFF',
		};
	}

	const styles = {
		container: getContainerStyle(container),
		title: toStyleObject(title),
		subtitle: toStyleObject(subtitle),
		box: getBoxStyle(box),
		number: toStyleObject(number),
		label: toStyleObject(label),
		separator: separatorStyle,
	};

	return (
		<BadgeCardContainer className="disco-h-[450px] disco-bg-white disco-top-0 !disco-sticky">
			<div>
				<ProductPreviewCard>
					<CountdownTimer
						timeUnits={timeUnits}
						containerStyle={styles.container}
						titleStyle={styles.title}
						subtitleStyle={styles.subtitle}
						boxStyle={styles.box}
						numberStyle={styles.number}
						labelStyle={styles.label}
						separatorStyle={styles.separator}
						titleText={replaceVariables(title?.text)}
						subtitleText={replaceVariables(subtitle?.text)}
						hasSeparator={hasSeparator}
						singleContainer={singleContainer}
						minWidth={box?.['min-width'] || '50px'}
					/>
				</ProductPreviewCard>
				<div className="disco-flex disco-mt-1 disco-justify-center disco-gap-4 disco-py-4">
					<Button
						type="transparent"
						className="disco-border-red-500"
						onClick={handleResetAll}
					>
						{__('Reset All', 'disco')}
					</Button>
				</div>
			</div>
		</BadgeCardContainer>
	);
};

export default CountdownTimeView;
