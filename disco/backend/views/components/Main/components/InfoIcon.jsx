import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';

const InfoIcon = ({ url }) => {
	return (
		<span className="disco:flex disco:group disco:mt-0.5 disco:gap-1 disco:hover:text-primary!">
			<InformationCircleIcon className="disco:size-5" />
			<a
				href={url}
				target="_blank"
				rel="noreferrer"
				className="disco:text-primary! disco:text-sm disco:underline disco:group-hover:text-primary! disco:hidden disco:group-hover:block"
			>
				{__('Learn More', 'disco')}
			</a>
		</span>
	);
};

export default InfoIcon;
