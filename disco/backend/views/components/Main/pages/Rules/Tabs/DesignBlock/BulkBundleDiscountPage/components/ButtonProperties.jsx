import { useDispatch, useSelector } from 'react-redux';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import BorderRadiusControl from '../../components/BorderRadiusControl';
import ButtonText from './ButtonText';
import { __ } from '@wordpress/i18n';

const ButtonProperties = () => {
	const { button } = useSelector(
		(state) => state.discount.design_blocks.table
	);
	const dispatch = useDispatch();

	// The handler responsible for updating the 'radius' globally
	const handleRadiusUpdate = (newRadiusValue) => {
		dispatch(
			updateTable({
				name: 'button',
				value: {
					...button,
					radius: {
						...button.radius,
						...newRadiusValue,
					},
				},
			})
		);
	};

	// The handler responsible for toggling 'isChain' globally
	const handleIsChainToggle = () => {
		dispatch(
			updateTable({
				name: 'button',
				value: {
					...button,
					isChain: !button.isChain,
				},
			})
		);
	};

	return (
		<div className="disco-mt-2 disco-flex disco-gap-8 disco-justify-between">
			<ButtonText
				title={__('Button Text', 'disco')}
				buttonText={button.text}
				onChange={(e) => {
					dispatch(
						updateTable({
							name: 'button',
							value: { ...button, text: e.target.value },
						})
					);
				}}
			/>
			<BorderRadiusControl
				title={__('Button Radius', 'disco')}
				className="disco-flex-grow"
				labelClassName="!disco-font-light"
				button={button}
				handleRadius={handleRadiusUpdate}
				handleIsChain={handleIsChainToggle}
			/>
		</div>
	);
};

export default ButtonProperties;
