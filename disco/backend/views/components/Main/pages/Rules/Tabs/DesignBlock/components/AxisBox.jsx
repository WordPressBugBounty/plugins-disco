import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBadge } from '../../../../../features/discount/discountSlice';
import CustomNumberInput from './CustomNumberInput';
import HorizontalPosition from './HorizontalPosition';
import VerticalPosition from './VerticalPosition';

const AxisBox = () => {
	const [verticalPosition, setVerticalPosition] = useState('top');
	const [horizontalPosition, setHorizontalPosition] = useState('left');

	const { container } = useSelector(
		(state) => state.discount.design_blocks.badge
	);
	const dispatch = useDispatch();

	const handleContainerChange = (value) => {
		dispatch(
			updateBadge({
				name: 'container',
				value: {
					...container,
					...value,
				},
			})
		);
	};

	const POSITION_MAP = {
		'top-left': {
			left: '0px',
			right: 'auto',
			top: '0px',
			bottom: 'auto',
			transform: 'translate(0, 0)',
		},
		'top-middle': {
			left: '50%',
			right: 'auto',
			top: '0px',
			bottom: 'auto',
			transform: 'translate(-50%, 0)',
		},
		'top-right': {
			left: 'auto',
			right: '0px',
			top: '0px',
			bottom: 'auto',
			transform: 'translate(0, 0)',
		},
		'middle-left': {
			left: '0px',
			right: 'auto',
			top: '50%',
			bottom: 'auto',
			transform: 'translate(0, -50%)',
		},
		'middle-middle': {
			left: '50%',
			right: 'auto',
			top: '50%',
			bottom: 'auto',
			transform: 'translate(-50%, -50%)',
		},
		'middle-right': {
			left: 'auto',
			right: '0px',
			top: '50%',
			bottom: 'auto',
			transform: 'translate(0, -50%)',
		},
		'bottom-left': {
			left: '0px',
			right: 'auto',
			top: 'auto',
			bottom: '0px',
			transform: 'translate(0, 0)',
		},
		'bottom-middle': {
			left: '50%',
			right: 'auto',
			top: 'auto',
			bottom: '0px',
			transform: 'translate(-50%, 0)',
		},
		'bottom-right': {
			left: 'auto',
			right: '0px',
			top: 'auto',
			bottom: '0px',
			transform: 'translate(0, 0)',
		},
	};

	// handle position change
	const handlePositionChange = (v, h) => {
		const styles = POSITION_MAP[`${v}-${h}`];
		if (styles) handleContainerChange(styles);
	};

	const handleVerticalPositionChange = (newPosition) => {
		setVerticalPosition(newPosition);
		handlePositionChange(newPosition, horizontalPosition);
	};
	const handleHorizontalPositionChange = (newPosition) => {
		setHorizontalPosition(newPosition);
		handlePositionChange(verticalPosition, newPosition);
	};

	return (
		<div className="disco-mt-4 disco-flex disco-justify-between disco-gap-4">
			<VerticalPosition
				title={__('Vertical', 'disco')}
				options={['top', 'middle', 'bottom']}
				selected={verticalPosition}
				handleChange={(value) => handleVerticalPositionChange(value)}
			/>
			<HorizontalPosition
				title={__('Horizontal', 'disco')}
				options={['left', 'middle', 'right']}
				selected={horizontalPosition}
				handleChange={(value) => handleHorizontalPositionChange(value)}
			/>
			<CustomNumberInput
				title={__('X Axis', 'disco')}
				name="xAxis"
				id="xAxis"
				initialValue={
					container?.left
						? parseInt(container.left.replace('px', ''))
						: 0
				}
				min={0}
				max={100}
				onChange={(value) => {
					dispatch(
						updateBadge({
							name: 'container',
							value: {
								...container,
								left: `${value}px`,
							},
						})
					);
				}}
			/>
			<CustomNumberInput
				title={__('Y Axis', 'disco')}
				name="yAxis"
				id="yAxis"
				initialValue={
					container?.top
						? parseInt(container.top.replace('px', ''))
						: 0
				}
				min={0}
				max={100}
				onChange={(value) => {
					dispatch(
						updateBadge({
							name: 'container',
							value: {
								...container,
								top: `${value}px`,
							},
						})
					);
				}}
			/>
			<CustomNumberInput
				title={__('Angle', 'disco')}
				name="angle"
				id="angle"
				initialValue={0}
				min={-360}
				max={360}
				onChange={(value) => {
					dispatch(
						updateBadge({
							name: 'container',
							value: {
								...container,
								transform: `rotate(${value}deg)`,
							},
						})
					);
				}}
			/>
		</div>
	);
};

export default AxisBox;
