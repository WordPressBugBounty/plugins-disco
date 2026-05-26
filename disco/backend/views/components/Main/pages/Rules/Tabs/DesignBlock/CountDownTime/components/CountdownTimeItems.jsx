import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { applyCountdownDesign } from '../../../../../../features/discount/discountSlice';
import { countdownDesigns } from '../../../../../../utilities/count-down';

// Helper to convert design object to React style object
const toStyleObject = (styleObj) => {
	if (!styleObj) return {};
	const result = {};
	Object.entries(styleObj).forEach(([key, value]) => {
		if (key === 'text' || key === 'max-width') return;
		// Convert kebab-case to camelCase
		const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
		result[camelKey] = value;
	});
	return result;
};

// Helper to get container style with border
const getContainerStyle = (container) => {
	const style = toStyleObject(container);
	if (container.border && container.border > 0) {
		style.border = `${container.border}px solid ${container['border-color']}`;
	}
	return style;
};

const CountdownTimeItems = ({ className = '' }) => {
	const dispatch = useDispatch();
	const { countdown } = useSelector((state) => state.discount.design_blocks);
	const designs = Object.values(countdownDesigns);

	const handleDesignSelect = (designKey) => {
		const selectedDesign = countdownDesigns[designKey];
		if (!selectedDesign) return;
		dispatch(applyCountdownDesign({ designKey, design: selectedDesign }));
	};
	const timeUnits = [
		{ value: '02', label: 'DAYS' },
		{ value: '23', label: 'HOURS' },
		{ value: '55', label: 'MINUTES' },
		{ value: '05', label: 'SECONDS' },
	];

	return (
		<div
			className={`disco-max-h-[544px] disco-overflow-y-auto disco-rounded-lg disco-bg-white disco-my-4 disco-py-4 disco-px-4 disco-border-1 ${className}`}
		>
			<div className="disco-grid disco-grid-cols-2 disco-gap-4">
				{designs.length > 0 ? (
					designs.map((design) => {
						const isSelected =
							countdown?.selected_design === design.id;
						const containerStyle = getContainerStyle(
							design.container
						);
						const titleStyle = toStyleObject(design.title);
						const subtitleStyle = toStyleObject(design.subtitle);
						const boxContainerStyle = toStyleObject(
							design.box_container
						);
						const boxStyle = toStyleObject(design.box);
						const numberStyle = toStyleObject(design.number);
						const labelStyle = toStyleObject(design.label);

						// When hasSeparator is true, separator color should match box background.
						let separatorStyle = toStyleObject(design.separator);
						if (design.hasSeparator) {
							separatorStyle = {
								...separatorStyle,
								color: design.box?.background || '#FFFFFF',
							};
						}

						return (
							<div
								key={design.id}
								onClick={() => handleDesignSelect(design.id)}
								className={`disco-flex disco-flex-col disco-border disco-rounded-md disco-p-3 disco-items-center disco-justify-center disco-cursor-pointer disco-transition-all hover:disco-border-primary ${
									isSelected
										? 'disco-border-primary disco-ring-2 disco-ring-primary disco-ring-opacity-50'
										: 'disco-border-gray-200'
								}`}
							>
								{/* Countdown Preview */}
								<div
									style={{
										...containerStyle,
										padding: '8px 10px',
										width: '100%',
										maxWidth: 'none',
									}}
								>
									<div style={{ marginBottom: '4px' }}>
										<h3 style={titleStyle}>
											{design.title.text}
										</h3>
										<p style={subtitleStyle}>
											{design.subtitle.text}
										</p>
									</div>
									<div
										style={{
											...boxContainerStyle,
											gap: '4px',
											marginTop: '4px',
											padding: design.singleContainer
												? '4px'
												: undefined,
										}}
									>
										{timeUnits.map((unit, index) => (
											<div
												key={unit.label}
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<div
													style={{
														...boxStyle,
														padding:
															design.singleContainer
																? '2px 4px'
																: '4px 6px',
														width: design.singleContainer
															? '28px'
															: '34px',
														minWidth: 'unset',
														flex: 'none',
													}}
												>
													<span
														style={{
															...numberStyle,
															fontSize: '12px',
														}}
													>
														{unit.value}
													</span>
													<span
														style={{
															...labelStyle,
															fontSize: '6px',
														}}
													>
														{unit.label}
													</span>
												</div>
												{design.hasSeparator &&
													index <
														timeUnits.length -
															1 && (
														<span
															style={
																separatorStyle
															}
														>
															:
														</span>
													)}
											</div>
										))}
									</div>
								</div>
							</div>
						);
					})
				) : (
					<p className="disco-text-gray-500 disco-text-sm disco-col-span-4 disco-text-center">
						{__(
							'No designs available for the selected option.',
							'disco'
						)}
					</p>
				)}
			</div>
		</div>
	);
};

export default CountdownTimeItems;
