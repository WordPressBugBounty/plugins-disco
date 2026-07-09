import { Popover } from '@base-ui/react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import {
	buildDate,
	formatDisplay,
	get12HourParts,
	parseDate,
} from '../../../../../../../utilities/datePickerUtils';
import TimeColumn from './TimeColumn';

const PICKER_CLASSES = {
	root: 'disco-p-0',
	months: 'disco-flex disco-flex-col',
	month: 'disco-flex disco-flex-col disco-gap-1',
	month_caption:
		'disco-relative disco-flex disco-h-8 disco-items-center disco-justify-center',
	caption_label:
		'disco-text-sm disco-font-semibold disco-text-gray-800 disco-select-none',
	nav: 'disco-absolute disco-inset-x-0 disco-top-0 disco-flex disco-items-center disco-justify-between',
	button_previous:
		'disco-flex disco-h-8 disco-w-8 disco-cursor-pointer disco-items-center disco-justify-center disco-rounded disco-text-gray-400 disco-transition-colors hover:disco-text-gray-700 disabled:disco-opacity-30 disco-z-10',
	button_next:
		'disco-flex disco-h-8 disco-w-8 disco-cursor-pointer disco-items-center disco-justify-center disco-rounded disco-text-gray-400 disco-transition-colors hover:disco-text-gray-700 disabled:disco-opacity-30 disco-z-10',
	weekdays: 'disco-flex',
	weekday:
		'disco-flex disco-h-8 disco-w-8 disco-items-center disco-justify-center disco-select-none disco-text-xs disco-font-medium disco-text-gray-400',
	weeks: 'disco-flex disco-flex-col',
	week: 'disco-flex',
	day: 'disco-flex disco-h-8 disco-w-8 disco-items-center disco-justify-center disco-p-0 disco-cursor-pointer disco-text-sm disco-rounded-full hover:disco-bg-gray-100 disco-transition-colors',
	today: 'disco-font-bold',
	selected: `disco-rounded-full !disco-text-white`,
	outside: 'disco-text-gray-300',
	disabled: 'disco-opacity-30 disco-pointer-events-none',
	hidden: 'disco-invisible',
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS = ['AM', 'PM'];

const DatePickerField = ({ name, value, testid, onDateChange }) => {
	const [open, setOpen] = useState(false);

	const selectedDate = parseDate(value) || new Date();
	const { hour, minute, period } = get12HourParts(value);

	const handleDaySelect = (day) => {
		if (!day) return;
		onDateChange(name, buildDate(day, hour, minute, period));
	};

	const handleHourSelect = (h) => {
		const base = selectedDate || new Date();
		onDateChange(name, buildDate(base, h, minute, period));
	};

	const handleMinuteSelect = (m) => {
		const base = selectedDate || new Date();
		onDateChange(name, buildDate(base, hour, m, period));
	};

	const handlePeriodSelect = (p) => {
		const base = selectedDate || new Date();
		onDateChange(name, buildDate(base, hour, minute, p));
	};

	const handleClear = () => {
		onDateChange(name, '');
		setOpen(false);
	};

	const handleToday = () => {
		const now = new Date();
		const { hour: h, minute: m, period: p } = get12HourParts(now);
		onDateChange(name, buildDate(now, h, m, p));
	};

	return (
		<div className="disco-flex disco-flex-1 disco-items-center disco-gap-1">
			<Popover.Root open={open} onOpenChange={setOpen}>
				<Popover.Trigger
					data-testid={testid}
					className="disco-w-48 disco-flex disco-flex-1 disco-cursor-pointer disco-items-center disco-gap-1.5 disco-rounded-md disco-bg-white disco-px-2 disco-py-1 disco-text-sm disco-text-gray-700 hover:disco-bg-gray-50 focus:disco-outline-none"
				>
					<CalendarDays className="disco-h-4 disco-w-4 disco-flex-shrink-0 disco-text-gray-400" />
					<span className={value ? '' : 'disco-text-gray-400'}>
						{value ? formatDisplay(value) : 'dd/mm/yyyy, --:-- --'}
					</span>
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Positioner
						side="bottom"
						align="start"
						sideOffset={6}
						style={{ zIndex: 99999 }}
					>
						<Popover.Popup className="disco-overflow-hidden disco-rounded-xl disco-border disco-border-gray-200 disco-bg-white disco-shadow-lg">
							<div className="disco-flex">
								{/* Calendar side */}
								<div className="disco-flex disco-flex-col disco-p-3">
									<DayPicker
										mode="single"
										selected={selectedDate}
										onSelect={handleDaySelect}
										showOutsideDays
										classNames={PICKER_CLASSES}
										modifiersStyles={{
											selected: {
												backgroundColor: '#47CD89',
												color: '#fff',
											},
										}}
										components={{
											Chevron: ({ orientation }) =>
												orientation === 'left' ? (
													<ChevronLeft className="disco-h-4 disco-w-4" />
												) : (
													<ChevronRight className="disco-h-4 disco-w-4" />
												),
										}}
									/>
									{/* Clear / Today buttons */}
									<div className="disco-mt-2 disco-flex disco-items-center disco-justify-between disco-border-t disco-border-gray-200 disco-pt-2">
										<button
											onClick={handleClear}
											className="disco-cursor-pointer disco-rounded-md disco-px-3 disco-py-1 disco-text-xs disco-font-medium disco-text-gray-500 disco-transition-colors hover:disco-bg-gray-100"
										>
											Clear
										</button>
										<button
											onClick={handleToday}
											className="disco-cursor-pointer disco-rounded-md disco-px-3 disco-py-1 disco-text-xs disco-font-medium disco-transition-colors hover:disco-opacity-80 disco-text-primary"
										>
											Today
										</button>
									</div>
								</div>

								{/* Divider */}
								<div className="disco-w-px disco-self-stretch disco-bg-gray-200" />

								{/* Time picker side */}
								<div className="disco-flex disco-flex-col disco-p-3">
									<p className="disco-mb-2 disco-text-center disco-text-xs disco-font-semibold disco-text-gray-500">
										Time
									</p>
									<div className="disco-flex disco-gap-1">
										<TimeColumn
											items={HOURS}
											selected={hour}
											onSelect={handleHourSelect}
											formatItem={(h) =>
												String(h).padStart(2, '0')
											}
										/>
										<TimeColumn
											items={MINUTES}
											selected={minute}
											onSelect={handleMinuteSelect}
											formatItem={(m) =>
												String(m).padStart(2, '0')
											}
										/>
										<TimeColumn
											items={PERIODS}
											selected={period}
											onSelect={handlePeriodSelect}
										/>
									</div>
								</div>
							</div>
						</Popover.Popup>
					</Popover.Positioner>
				</Popover.Portal>
			</Popover.Root>
		</div>
	);
};

export default DatePickerField;
