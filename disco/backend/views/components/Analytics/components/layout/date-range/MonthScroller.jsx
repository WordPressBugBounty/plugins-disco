import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

const CELL = 26;
const SCROLLER_VISIBLE = 5;
const MONTH_LABELS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export default function MonthScroller({ month, onMonthChange }) {
	const scrollRef = useRef(null);

	const items = [];
	for (let y = month.getFullYear() - 2; y <= month.getFullYear() + 2; y++) {
		for (let m = 0; m < 12; m++) {
			items.push({ year: y, month: m });
		}
	}

	const currentIdx = items.findIndex(
		(it) => it.year === month.getFullYear() && it.month === month.getMonth()
	);

	useEffect(() => {
		if (scrollRef.current && currentIdx !== -1) {
			scrollRef.current.scrollTop =
				(currentIdx - Math.floor(SCROLLER_VISIBLE / 2)) * CELL;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [month.getFullYear(), month.getMonth()]);

	return (
		<div
			ref={scrollRef}
			className="disco-flex-shrink-0 disco-overflow-y-auto"
			style={{
				width: 28,
				height: CELL * SCROLLER_VISIBLE,
				scrollbarWidth: 'none',
				msOverflowStyle: 'none',
			}}
		>
			{items.map((it, i) => {
				const isCurrent =
					it.year === month.getFullYear() &&
					it.month === month.getMonth();
				return (
					<div
						key={i}
						onClick={() =>
							onMonthChange(new Date(it.year, it.month, 1))
						}
						style={{ height: CELL }}
						className={cn(
							'disco-flex disco-cursor-pointer disco-items-center disco-justify-center disco-rounded disco-text-[9px] disco-transition-colors',
							isCurrent
								? 'disco-font-bold disco-text-[rgba(74,74,74,0.9)]'
								: 'disco-text-[rgba(74,74,74,0.3)] hover:disco-text-[rgba(74,74,74,0.7)]'
						)}
					>
						{MONTH_LABELS[it.month]}
					</div>
				);
			})}
		</div>
	);
}
