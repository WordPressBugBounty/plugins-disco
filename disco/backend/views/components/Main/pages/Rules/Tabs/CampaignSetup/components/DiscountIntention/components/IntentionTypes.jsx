import { useDispatch, useSelector } from 'react-redux';
import { useGetDiscountIntentsQuery } from '../../../../../../../features/discount/discountApi';
import {
	changeDiscountIntention,
	updateOption,
} from '../../../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../../../hooks/useIsPro';
import intentImages from '../../../../../../../utilities/intent-img';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import AlertPopup from '../../../../../../../components/AlertPopup';
import { useState } from 'react';
import { __ } from '@wordpress/i18n';

const IntentionTypes = () => {
	const [showAlert, setShowAlert] = useState(false);
	const { discount_intent, conditions } = useSelector(
		(state) => state.discount
	);
	const { data: intentions, isLoading } = useGetDiscountIntentsQuery();
	const dispatch = useDispatch();
	const isPro = useIsPro();
	const handleIntentChange = (intention) => {
		if (intention === 'BOGO' && !isPro) {
			return;
		}

		if (intention !== 'Product') {
			dispatch(updateOption({ option: 'discount_max_user', value: '' }));
		}

		if (intention === 'Product' && conditions.length > 0) {
			setShowAlert(true);
			return;
		}

		dispatch(changeDiscountIntention(intention));
	};

	const handleConfirmAlert = () => {
		dispatch(updateOption({ option: 'conditions', value: [] }));
		dispatch(changeDiscountIntention('Product'));
		setShowAlert(false);
	};

	if (isLoading) {
		return (
			<div className="disco-max-w-3xl disco-p-5 disco-mx-auto disco-grid disco-grid-cols-3 disco-gap-5">
				{Array.from(Array(6).keys()).map((item) => (
					<div
						key={item}
						className="disco-animate-pulse disco-h-[62.7734px] disco-border disco-border-gray-200 disco-bg-gray-300 disco-text-center disco-rounded-lg disco-flex disco-justify-center disco-py-4 disco-text-base disco-font-medium"
					>
						<div className="disco-animate-pulse disco-bg-gray-300 disco-rounded-full">
							<span className="disco-opacity-0">
								{__('Intention', 'disco')}
							</span>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="disco-max-w-3xl disco-p-5 disco-mx-auto disco-grid disco-grid-cols-3 disco-gap-5">
			<AlertPopup
				open={showAlert}
				setOpen={setShowAlert}
				onRemove={handleConfirmAlert}
			/>

			{intentions?.values &&
				Object.keys(intentions?.values).map((intention) => (
					<button
						disabled={intention === 'BOGO' && !isPro}
						key={intention}
						onClick={() => handleIntentChange(intention)}
						className={` disco-relative disco-group disco-cursor-pointer disco-rounded-lg disco-border disco-border-primary/60 disco-px-5 disco-py-3.5 disco-text-regular disco-font-semibold disco-text-base hover:disco-border-primary hover:disco-text-white disco-transition-colors disco-outline-none disabled:disco-text-gray-400 disabled:disco-border-gray-400 disabled:disco-bg-white disabled:disco-cursor-not-allowed ${
							intention === discount_intent
								? 'disco-border-primary disco-bg-primary disco-text-white'
								: ''
						} `}
					>
						{intention === discount_intent && (
							<div className="disco-absolute disco-z-30 disco-bg-white -disco-right-2.5 -disco-top-2.5 disco-flex disco-border disco-border-solid disco-border-primary disco-rounded-full disco-p-px">
								<CheckCircleIcon className="!disco-text-primary disco-size-5" />
							</div>
						)}
						<div className="disco-relative disco-z-20 disco-flex disco-items-center disco-gap-3">
							<img
								src={intentImages[intention]}
								width="32"
								height="30"
							/>
							{intention === 'BOGO' && !isPro ? (
								<div className="disco-flex disco-gap-1 disco-items-center">
									BOGO{' '}
									<a
										href="https://discoplugin.com/pricing/?utm_source=pro-text&utm_medium=free-to-pro&utm_campaign=free-to-pro&utm_id=1"
										target="_blank"
										rel="noreferrer"
										className="disco-text-sm disco-text-red-500 focus:!disco-outline-none visited:disco-text-red-500 focus:!disco-ring-0"
									>
										(Pro)
									</a>
								</div>
							) : (
								intention
							)}
						</div>
						{intention === 'BOGO' && !isPro ? null : (
							<div className="disco-absolute disco-z-10 disco-rounded-md disco-bg-primary disco-transition-all disco-duration-700 disco-inset-0 disco-w-0 group-hover:disco-w-full" />
						)}
					</button>
				))}
		</div>
	);
};

export default IntentionTypes;
