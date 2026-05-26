import {
	ArrowLeftCircleIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../components/Button';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import {
	setComponentToEdit,
	setShowEditor,
} from '../../../../../features/interaction/interactionSlice';

const BadgeHeader = ({ title, description, className = '', children = '' }) => {
	const dispatch = useDispatch();
	const { saveStatus } = useSelector((state) => state.interaction);

	const [showSuccess, setShowSuccess] = useState(false);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (saveStatus === 'success') {
			setShowSuccess(true);
			const timer = setTimeout(() => setShowSuccess(false), 1500);
			return () => clearTimeout(timer);
		}
	}, [saveStatus]);

	const handleBackClick = () => {
		dispatch(setShowEditor(false));
		dispatch(setComponentToEdit(''));
	};

	return (
		<div
			className={`${className} disco-sticky disco-bg-[#F9FAFB] disco-top-[100px] disco-z-50`}
		>
			<div className="disco-flex disco-justify-between disco-items-center disco-pb-2 disco-border-b">
				<span>
					<h1 className="disco-text-2xl">{title}</h1>
					<p className="disco-text-base disco-mt-1">{description}</p>
				</span>

				<span className="disco-flex disco-gap-2 disco-items-center">
					{saveStatus === 'saving' && (
						<div className="disco-flex disco-items-center disco-gap-1">
							<LoadingSpinner size={5} />
							<span className="disco-text-base disco-text-primary disco-font-semibold">
								{__('Saving', 'disco')}
							</span>
						</div>
					)}

					{showSuccess && (
						<div className="disco-flex disco-gap-1 disco-text-base disco-text-primary disco-font-semibold disco-items-center disco-justify-center">
							<CheckCircleIcon className="disco-h-5 disco-w-5" />
							{__('Saved', 'disco')}
						</div>
					)}

					<Button
						onClick={handleBackClick}
						className="!disco-px-2 !disco-py-2"
						icon={
							<ArrowLeftCircleIcon className="disco-h-6 disco-w-6 disco-text-white" />
						}
					>
						{__('Back to Display', 'disco')}
					</Button>
				</span>
			</div>

			{children}
		</div>
	);
};

export default BadgeHeader;
