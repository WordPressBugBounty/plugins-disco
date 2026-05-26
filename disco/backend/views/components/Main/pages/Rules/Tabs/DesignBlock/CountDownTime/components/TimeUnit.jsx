/**
 * TimeUnit component - Renders individual time box with optional separator
 */
const TimeUnit = ({
	unit,
	boxStyle,
	numberStyle,
	labelStyle,
	separatorStyle,
	showSeparator,
	singleContainer,
	minWidth,
}) => {
	const boxBaseStyle = singleContainer
		? {
				padding: '4px 8px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minWidth,
				textAlign: 'center',
		  }
		: {
				...boxStyle,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
		  };

	const separatorBaseStyle = {
		...separatorStyle,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0 4px',
	};

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '4px',
			}}
		>
			<div style={boxBaseStyle}>
				<span style={numberStyle}>{unit.value}</span>
				<span style={labelStyle}>{unit.label}</span>
			</div>
			{showSeparator && <span style={separatorBaseStyle}>:</span>}
		</div>
	);
};

export default TimeUnit;
