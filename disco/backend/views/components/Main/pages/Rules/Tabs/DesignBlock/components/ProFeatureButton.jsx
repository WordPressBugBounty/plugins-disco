import { __ } from '@wordpress/i18n';
import { useDispatch } from 'react-redux';
import Button from '../../../../../components/Button';
import {
	setComponentToEdit,
	setShowEditor,
} from '../../../../../features/interaction/interactionSlice';
import useIsPro from '../../../../../hooks/useIsPro';

const ProFeatureButton = ({
	tryNowUrl,
	componentToEdit,
	className = '',
	testId,
}) => {
	const dispatch = useDispatch();
	const isPro = useIsPro();

	const handleClick = () => {
		if (!isPro) {
			window.open(tryNowUrl);
			return;
		}
		dispatch(setShowEditor(true));
		dispatch(setComponentToEdit(componentToEdit));
	};

	return (
		<Button
			className={`disco-text-sm !disco-px-3 !disco-py-1.5 ${className}`}
			onClick={handleClick}
			testId={`${testId}-edit-button`}
		>
			{isPro ? __('Edit Now', 'disco') : __('Try Now', 'disco')}
		</Button>
	);
};

export default ProFeatureButton;
