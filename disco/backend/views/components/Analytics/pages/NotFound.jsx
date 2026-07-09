import { __ } from '@wordpress/i18n';
import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router';

const NotFound = () => (
	<div className="disco-min-h-[60vh] disco-flex disco-flex-col disco-items-center disco-justify-center disco-bg-[#f9fafb] disco-p-6">
		<FileQuestion className="disco-size-12 disco-text-[#d1d5db] disco-mb-4" />
		<h1 className="disco-text-lg disco-font-bold disco-text-[#111827] disco-tracking-tight">
			{__('Page not found', 'disco')}
		</h1>
		<p className="disco-text-xs disco-text-[#9ca3af] disco-mt-1">
			{__(
				"The page you're looking for doesn't exist or has been moved.",
				'disco'
			)}
		</p>
		<Link
			to="/"
			className="disco-mt-4 disco-inline-flex disco-items-center disco-px-3 disco-py-1.5 disco-text-xs disco-font-medium disco-text-white disco-bg-primary disco-rounded-lg disco-no-underline hover:disco-bg-primary-dark hover:disco-text-white disco-transition-colors"
		>
			{__('Back to Dashboard', 'disco')}
		</Link>
	</div>
);

export default NotFound;
