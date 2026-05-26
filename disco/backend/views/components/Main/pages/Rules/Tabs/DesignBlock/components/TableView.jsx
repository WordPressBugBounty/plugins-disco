import { useSelector } from 'react-redux';
import { discountRulesToTableData } from '../../../../../utilities/utilities';
import { __ } from '@wordpress/i18n';

export default function TableView() {
	const { table } = useSelector((state) => state.discount.design_blocks);
	const { discount_rules } = useSelector((state) => state.discount);

	const table_row = discountRulesToTableData(discount_rules);

	const { heading, heading_customization, cell_customization, button } =
		table;

	/* -------------------------------
	  ✅ Create base style (no border)
	-------------------------------- */
	const getBaseStyle = (obj) => {
		const base = { ...obj };
		delete base['border-right'];
		delete base['border-bottom'];
		delete base['border-color'];
		return base;
	};

	/* -----------------------------------------------------
	  ✅ Create final border style (with border-color applied)
	 ------------------------------------------------------*/
	const getBorderStyle = ({
		obj,
		rowIndex,
		colIndex,
		totalRows,
		totalCols,
	}) => {
		const borderColor = obj['border-color'];
		const right = obj['border-right'];
		const bottom = obj['border-bottom'];

		return {
			borderRight:
				colIndex === totalCols - 1 || !right
					? 'none'
					: `${right} ${borderColor}`,
			borderBottom:
				rowIndex === totalRows - 1 || !bottom
					? 'none'
					: `${bottom} ${borderColor}`,
		};
	};

	const buttonStyle = {
		...button,
		borderRadius: `${button.radius['top-left']} ${button.radius['top-right']} ${button.radius['bottom-right']} ${button.radius['bottom-left']}`,
	};

	return (
		<div style={{ padding: '0' }}>
			<div
				style={{
					overflow: 'hidden',
					borderRadius: '8px',
					boxShadow:
						'0 8px 10px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
					maxWidth: '600px',
					margin: '0 auto',
				}}
			>
				{table_row.length === 0 ? (
					<div
						style={{
							padding: '24px',
							textAlign: 'center',
							color: cell_customization.color,
							background: cell_customization.background,
						}}
					>
						{__('No table data available.', 'disco')}
					</div>
				) : (
					<table
						style={{
							width: '100%',
							borderCollapse: 'collapse',
						}}
					>
						{/* ✅ Heading */}
						<thead>
							<tr style={getBaseStyle(heading_customization)}>
								{Object.keys(heading).map(
									(key, colIndex, array) => {
										const borders = getBorderStyle({
											obj: heading_customization,
											rowIndex: 0,
											colIndex,
											totalRows: 1,
											totalCols: array.length,
										});

										return (
											<th
												key={key}
												style={{
													...borders,
													'font-weight':
														heading_customization[
															'font-weight'
														],
													padding: '8px',
													textAlign: 'center',
												}}
											>
												{heading[key]}
											</th>
										);
									}
								)}
							</tr>
						</thead>

						{/* ✅ Rows */}
						<tbody>
							{table_row.map((row, rowIndex) => (
								<tr
									key={rowIndex}
									style={getBaseStyle(cell_customization)}
								>
									{Object.keys(heading).map(
										(key, colIndex, array) => {
											const borders = getBorderStyle({
												obj: cell_customization,
												rowIndex,
												colIndex,
												totalRows: table_row.length,
												totalCols: array.length,
											});

											const cellStyle = {
												...borders,
												padding: '10px 12px',
												textAlign: 'center',
											};

											// ✅ Button Cell
											if (
												key === 'buy_now' &&
												button.enable
											) {
												return (
													<td
														key={key}
														style={cellStyle}
													>
														<button
															style={buttonStyle}
														>
															{button.text}
														</button>
													</td>
												);
											}

											// ✅ Normal cell
											return (
												<td key={key} style={cellStyle}>
													{row[key]}
												</td>
											);
										}
									)}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
