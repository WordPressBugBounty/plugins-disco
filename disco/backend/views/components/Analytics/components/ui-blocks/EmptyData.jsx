import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { TriangleAlert } from 'lucide-react';

const EmptyData = ({ title, description }) => {
	return (
		<Empty
			className={cn(
				'disco-bg-white disco-rounded-xl disco-border disco-border-[#e5e7eb] disco-overflow-hidden disco-py-10'
			)}
		>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<TriangleAlert className="disco-size-8 disco-text-red-400" />
				</EmptyMedia>
				<EmptyTitle>
					{__(`${title} Not Found!`, 'disco') || 'No Data Found!'}
				</EmptyTitle>
				<EmptyDescription>{__(description, 'disco')}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
};

export default EmptyData;
