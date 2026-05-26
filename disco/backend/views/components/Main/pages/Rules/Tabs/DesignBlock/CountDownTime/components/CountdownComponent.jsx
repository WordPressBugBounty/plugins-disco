import { useEffect, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';

const CountdownComponent = ({ targetDate }) => {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	function calculateTimeLeft() {
		const difference = new Date(targetDate) - new Date();
		if (difference > 0) {
			return {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / (1000 * 60)) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}
		return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearInterval(timer); // Clear the timer on component unmount
	}, []);

	return (
		<div className="disco-mt-3">
			<div className="disco-flex disco-items-center disco-space-x-2 disco-mb-2">
				<h2 className="disco-text-base disco-font-semibold">
					{__('Countdown', 'disco')}
				</h2>
				<span className="disco-text-sm disco-text-gray-500">
					{__('(As per the campaign setup)', 'disco')}
				</span>
				<InformationCircleIcon className="disco-w-5 disco-h-5 disco-text-gray-600" />
			</div>
			<div className="disco-flex disco-justify-between disco-gap-4 2xl:disco-justify-start">
				<div className="disco-flex disco-bg-white disco-rounded-md disco-py-2 disco-px-8 disco-items-center disco-space-x-2">
					<div className="disco-text-sm">{__('Days', 'disco')}</div>
					<div className="disco-text-sm">{timeLeft.days}</div>
				</div>
				<div className="disco-flex disco-bg-white disco-rounded-md disco-py-2 disco-px-8 disco-items-center disco-space-x-2">
					<div className="disco-text-sm">{__('Hours', 'disco')}</div>
					<div className="disco-text-sm">{timeLeft.hours}</div>
				</div>
				<div className="disco-flex disco-bg-white disco-rounded-md disco-py-2 disco-px-8 disco-items-center disco-space-x-2">
					<div className="disco-text-sm">
						{__('Minutes', 'disco')}
					</div>
					<div className="disco-text-sm">{timeLeft.minutes}</div>
				</div>
				<div className="disco-flex disco-bg-white disco-rounded-md disco-py-2 disco-px-8 disco-items-center disco-space-x-2">
					<div className="disco-text-sm">
						{__('Seconds', 'disco')}
					</div>
					<div className="disco-text-sm">{timeLeft.seconds}</div>
				</div>
			</div>
		</div>
	);
};

export default CountdownComponent;
