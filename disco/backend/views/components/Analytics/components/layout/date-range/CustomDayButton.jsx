import { cn } from '@/lib/utils';

export default function CustomDayButton({ modifiers, children, ...props }) {
	const isEdge = modifiers.range_start || modifiers.range_end;
	const isMiddle = modifiers.range_middle;
	const isOutside = modifiers.outside;

	return (
		<button
			{...props}
			className={cn(
				'disco-flex disco-h-[26px] disco-w-[26px] disco-items-center disco-justify-center disco-rounded-full disco-text-[11px] disco-transition-colors disco-select-none',
				isEdge
					? 'disco-bg-[#08c889] disco-font-semibold disco-text-white'
					: isMiddle
						? 'disco-text-[rgba(74,74,74,0.8)]'
						: isOutside
							? 'disco-cursor-default disco-text-[rgba(74,74,74,0.25)]'
							: 'disco-cursor-pointer disco-text-[rgba(74,74,74,0.85)] hover:disco-bg-[rgba(8,200,137,0.12)]'
			)}
		>
			{children}
		</button>
	);
}
