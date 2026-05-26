import TimeUnit from './TimeUnit';

/**
 * CountdownTimer component - Renders the complete countdown timer
 */
const CountdownTimer = ({
	timeUnits,
	containerStyle,
	titleStyle,
	subtitleStyle,
	boxStyle,
	numberStyle,
	labelStyle,
	separatorStyle,
	titleText,
	subtitleText,
	hasSeparator,
	singleContainer,
	minWidth,
}) => {
	const boxContainerStyle = {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'stretch',
		gap: hasSeparator ? '0px' : singleContainer ? '4px' : '6px',
		marginTop: '8px',
		...(singleContainer && {
			background: '#FFFFFF',
			borderRadius: '4px',
			padding: '8px',
		}),
	};

	return (
		<div style={containerStyle}>
			<div style={{ marginBottom: '8px', textAlign: 'center' }}>
				<h3 style={titleStyle}>{titleText}</h3>
				<p style={subtitleStyle}>{subtitleText}</p>
			</div>
			<div style={boxContainerStyle}>
				{timeUnits.map((unit, index) => (
					<TimeUnit
						key={unit.label}
						unit={unit}
						boxStyle={boxStyle}
						numberStyle={numberStyle}
						labelStyle={labelStyle}
						separatorStyle={separatorStyle}
						showSeparator={hasSeparator && index < timeUnits.length - 1}
						singleContainer={singleContainer}
						minWidth={minWidth}
					/>
				))}
			</div>
		</div>
	);
};

export default CountdownTimer;
