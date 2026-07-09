import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import {
	addYears,
	differenceInYears,
	format,
	isAfter,
	isBefore,
} from 'date-fns';
import { useSelector } from 'react-redux';
import CustomDayButton from './date-range/CustomDayButton';
import DateHeader from './date-range/DateHeader';
import MonthScroller from './date-range/MonthScroller';
import PICKER_CLASSES from './date-range/picker-classes';

const SCROLLER_TOP_OFFSET = 62;

// ─── Main component ────────────────────────────────────────────────────────────
const CustomDateRangePicker = ({ onApply }) => {
	const today = new Date();
	const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
	const { startDate, endDate } = useSelector((state) => state.dateRange);
	const [range, setRange] = useState({
		from: format(startDate, 'yyyy-MM-dd'),
		to: format(endDate, 'yyyy-MM-dd'),
	});
	const [fromMonth, setFromMonth] = useState(prevMonth);
	const [toMonth, setToMonth] = useState(today);

	const handleApply = () => {
		if (range.from && range.to) {
			onApply({ startDate: range.from, endDate: range.to });
		}
	};

	const handleClear = () => {
		setRange({
			from: format(today, 'yyyy-MM-dd'),
			to: format(today, 'yyyy-MM-dd'),
		});
		// onClear?.();
	};

	const handleFromDateChange = (date) => {
		// If the new from is after current to, reset to
		if (range.to && isAfter(date, range.to)) {
			setRange({ from: date, to: undefined });
		} else {
			setRange((prev) => ({ ...prev, from: date }));
		}
		setFromMonth(date);
	};

	const handleToDateChange = (date) => {
		// If the new to is before current from, reset from
		if (range.from && isBefore(date, range.from)) {
			setRange({ from: undefined, to: date });
		} else {
			setRange((prev) => ({ ...prev, to: date }));
		}
		setToMonth(date);
	};

	const MAX_RANGE_YEARS = 2;
	const isRangeExceeded =
		range.from &&
		range.to &&
		differenceInYears(range.to, range.from) >= MAX_RANGE_YEARS;
	const canApply = range.from && range.to && !isRangeExceeded;
	const disabledOutOfRange = range.from
		? [
				{ before: addYears(range.from, -MAX_RANGE_YEARS) },
				{ after: addYears(range.from, MAX_RANGE_YEARS) },
			]
		: [];

	const pickerProps = {
		mode: 'range',
		selected: range,
		onSelect: (value) =>
			setRange(value ?? { from: undefined, to: undefined }),
		showOutsideDays: true,
		disabled: disabledOutOfRange,
		classNames: PICKER_CLASSES,
		components: {
			DayButton: CustomDayButton,
			Chevron: ({ orientation }) =>
				orientation === 'left' ? (
					<ChevronLeft className="disco-h-4 disco-w-4" />
				) : (
					<ChevronRight className="disco-h-4 disco-w-4" />
				),
		},
	};

	return (
		<div className="disco-flex disco-flex-col disco-gap-3">
			<div className="disco-flex disco-gap-4">
				{/* From calendar panel */}
				<div className="disco-flex disco-flex-1 disco-flex-col">
					<DateHeader
						label="From"
						date={range.from}
						onDateChange={handleFromDateChange}
					/>
					<div className="disco-relative disco-flex disco-items-start disco-gap-1">
						<DayPicker
							{...pickerProps}
							month={fromMonth}
							onMonthChange={setFromMonth}
						/>
						{/* Offset scroller to align with week rows */}
						<div style={{ paddingTop: SCROLLER_TOP_OFFSET }}>
							<MonthScroller
								month={fromMonth}
								onMonthChange={setFromMonth}
							/>
						</div>
					</div>
				</div>

				{/* Vertical divider */}
				<div className="disco-w-px disco-self-stretch disco-bg-[#e5e7eb]" />

				{/* To calendar panel */}
				<div className="disco-flex disco-flex-1 disco-flex-col">
					<DateHeader
						label="To"
						date={range.to}
						onDateChange={handleToDateChange}
					/>
					<div className="disco-relative disco-flex disco-items-start disco-gap-1">
						<DayPicker
							{...pickerProps}
							month={toMonth}
							onMonthChange={setToMonth}
						/>
						<div style={{ paddingTop: SCROLLER_TOP_OFFSET }}>
							<MonthScroller
								month={toMonth}
								onMonthChange={setToMonth}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="disco-flex disco-items-center disco-justify-end disco-gap-2">
				<button
					onClick={handleClear}
					className="disco-h-6 disco-cursor-pointer disco-rounded-[5px] disco-bg-[#f8f8f8] disco-px-3 disco-text-[10px] disco-font-medium disco-text-[#8a8a8a] disco-transition-colors hover:disco-bg-[#efefef]"
				>
					Clear
				</button>
				<button
					onClick={handleApply}
					disabled={!canApply}
					className={cn(
						'disco-h-6 disco-cursor-pointer disco-rounded-[5px] disco-bg-[#08c889] disco-px-3 disco-text-[10px] disco-font-medium disco-text-white disco-transition-colors hover:disco-bg-[#07b87c]',
						!canApply && 'disco-cursor-not-allowed disco-opacity-50'
					)}
				>
					Apply
				</button>
			</div>
		</div>
	);
};

export default CustomDateRangePicker;
