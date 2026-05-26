import { XCircleIcon } from '@heroicons/react/24/outline';
import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
} from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import SaveAndExitButton from './SaveAndExitButton';

const FooterButtons = ({
	handleBack = () => {},
	handleContinue = () => {},
	next = true,
	cancel = false,
	disabled = false,
	loading = false,
}) => {
	if (disabled) return null;

	return (
		<div className="disco-bg-white disco-flex disco-justify-between disco-shadow-[0_-3px_10px_5px_rgba(0,0,0,0.05)] disco-border-t disco-z-40 disco-border-gray-200 disco-py-2.5 disco-px-5 disco-items-center disco-gap-3 disco-mt-4 disco-sticky disco-bottom-0">
			{cancel ? (
				<Link to="/">
					<Button
						className="!disco-py-2 !disco-px-2.5 !disco-font-normal disco-border !disco-border-red-500"
						type="transparent"
						icon={
							<XCircleIcon className="disco-h-5 disco-w-5 !disco-text-red-500" />
						}
					>
						{__('Cancel', 'disco')}
					</Button>
				</Link>
			) : (
				<Button
					className="!disco-py-2 !disco-px-2.5 !disco-font-normal"
					onClick={handleBack}
					type="transparent"
					icon={
						<ArrowLongLeftIcon className="disco-h-4 disco-w-4 disco-text-primary" />
					}
				>
					{__('Back to Campaign', 'disco')}
				</Button>
			)}

			<div className="disco-flex disco-gap-2">
				<SaveAndExitButton />
				{next && (
					<Button
						className="!disco-py-1.5 !disco-px-4 !disco-font-normal"
						type="primary"
						onClick={handleContinue}
						disabled={disabled || loading}
						iconPositionLeft={false}
						icon={
							!loading && (
								<ArrowLongRightIcon className="disco-h-4 disco-w-4 disco-text-white" />
							)
						}
					>
						{loading ? (
							<div className="disco-flex disco-gap-2 disco-items-center">
								<span>{__('Saving', 'disco')}</span>
								<LoadingSpinner size={4} />
							</div>
						) : (
							__('Continue', 'disco')
						)}
					</Button>
				)}
			</div>
		</div>
	);
};
export default FooterButtons;
