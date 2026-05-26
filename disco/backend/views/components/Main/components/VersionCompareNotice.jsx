import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import useIsPro from '../hooks/useIsPro';

export default function VersionCompareNotice() {
	const isPro = useIsPro();
	function compareVersion(v1, v2) {
		if (!v1 || !v2) return 0; // Prevent crash in Jest
		const a = v1.split('.').map(Number);
		const b = v2.split('.').map(Number);
		const len = Math.max(a.length, b.length);

		for (let i = 0; i < len; i++) {
			const num1 = a[i] || 0;
			const num2 = b[i] || 0;

			if (num1 > num2) return 1;
			if (num1 < num2) return -1;
		}
		return 0;
	}

	if (!isPro) {
		return;
	}

	if (
		compareVersion(DISCO.disco_free_version, '1.3.0') >= 0 &&
		compareVersion(DISCO.disco_pro_version, '1.1.0') >= 0
	) {
		return;
	}

	return (
		<div className="disco-flex disco-align-center disco-mb-2">
			<div className="disco-bg-red-500 disco-rounded-l-md disco-align-center disco-p-2">
				<InformationCircleIcon className="disco-size-7 disco-text-white" />
			</div>
			<div className="disco-flex-grow disco-gap-2 disco-border disco-border-red-500 disco-rounded-r-md disco-py-2 disco-pr-2">
				<p className="disco-text-base disco-pl-2">
					<span className="disco-text-red-500 disco-font-bold">
						{__('Need to Fix -', 'disco')}{' '}
					</span>
					{__('Please update', 'disco')}{' '}
					<strong>{__('Disco Free', 'disco')}</strong>{' '}
					{__('to version', 'disco')} <strong>1.3.0</strong>{' '}
					{__('or higher for Disco Pro', 'disco')}{' '}
					<strong>{DISCO.disco_pro_version}</strong>{' '}
					{__('to run properly', 'disco')}.
				</p>
			</div>
		</div>
	);
}
