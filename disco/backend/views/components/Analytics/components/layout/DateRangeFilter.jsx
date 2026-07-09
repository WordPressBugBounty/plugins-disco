import { Popover } from '@base-ui/react/popover';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib/utils';
import {
	selectDateRange,
	setDateRange,
} from '../../features/dateRange/dateRangeSlice';

import CustomDateRangePicker from './CustomDateRangePicker';

const DATE_RANGE_OPTIONS = [
	{ label: 'Today', days: 0 },
	{ label: 'Yesterday', days: 1 },
	{ label: 'Last 7 days', days: 7 },
	{ label: 'Last 28 days', days: 28 },
	{ label: 'Last 90 days', days: 90 },
];

function formatDate(date) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).format(date);
}

function getDateRange(days) {
	const today = new Date();
	if (days === 0) {
		return { start: today, end: today };
	}
	if (days === 1) {
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		return { start: yesterday, end: yesterday };
	}
	const start = new Date(today);
	start.setDate(today.getDate() - days + 1);
	return { start, end: today };
}

function toApiDate(date) {
	return format(date, 'yyyy-MM-dd');
}

const DateRangeFilter = () => {
	const dispatch = useDispatch();
	const { startDate, endDate } = useSelector(selectDateRange);

	// UI-only state
	const [open, setOpen] = useState(false);
	// 'list' | 'custom'
	const [view, setView] = useState('list');
	const [selectedLabel, setSelectedLabel] = useState('Last 28 days');
	const [isCustom, setIsCustom] = useState(false);

	const selectedOption =
		DATE_RANGE_OPTIONS.find((o) => o.label === selectedLabel) ??
		DATE_RANGE_OPTIONS[3];

	const { start, end } = useMemo(() => {
		if (isCustom) {
			return { start: new Date(startDate), end: new Date(endDate) };
		}
		return getDateRange(selectedOption.days);
	}, [isCustom, startDate, endDate, selectedOption]);

	const dateRangeText = isCustom
		? `${format(new Date(startDate), 'MMM dd, yyyy')} - ${format(new Date(endDate), 'MMM dd, yyyy')}`
		: selectedOption.days <= 1
		? formatDate(start)
		: `${formatDate(start)} - ${formatDate(end)}`;

	const triggerLabel = isCustom ? 'Custom' : selectedLabel;

	const handlePresetSelect = (label) => {
		const option = DATE_RANGE_OPTIONS.find((o) => o.label === label);
		const { start: s, end: e } = getDateRange(option.days);
		dispatch(setDateRange({ startDate: toApiDate(s), endDate: toApiDate(e) }));
		setSelectedLabel(label);
		setIsCustom(false);
		setOpen(false);
		setView('list');
	};

	const handleOpenChange = (nextOpen) => {
		setOpen(nextOpen);
		if (!nextOpen) setView('list');
	};

	const handleCustomApply = ({ startDate: s, endDate: e }) => {
		dispatch(setDateRange({ startDate: toApiDate(s), endDate: toApiDate(e) }));
		setIsCustom(true);
		setSelectedLabel('Custom');
		setOpen(false);
		setView('list');
	};

	const handleCustomClear = () => {
		setView('list');
	};

	return (
		<Popover.Root open={open} onOpenChange={handleOpenChange}>
			<Popover.Trigger
				className={cn(
					'disco-inline-flex disco-h-7 disco-cursor-pointer disco-items-center disco-gap-1.5',
					'disco-rounded-[6px] disco-border disco-border-[#d6d6d6] disco-bg-white',
					'disco-px-2.5 disco-text-xs disco-text-[#7e7e7e]',
					'disco-transition-colors hover:disco-bg-transparent hover:disco-text-[#7e7e7e]',
					'focus:disco-outline-none'
				)}
			>
				{triggerLabel}
				<ChevronDown
					className={cn(
						'disco-size-3 disco-text-[#7e7e7e] disco-transition-transform disco-duration-200',
						open && 'disco-rotate-180'
					)}
				/>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Positioner
					side="bottom"
					align="end"
					sideOffset={6}
					style={{ zIndex: 99999 }}
				>
					<Popover.Popup
						className={cn(
							'disco-overflow-hidden disco-rounded-[8px] disco-border disco-border-[#e5e7eb] disco-bg-white',
							'disco-shadow-[0px_6px_5px_0px_rgba(0,0,0,0.05)]',
							view === 'custom'
								? 'disco-w-auto disco-p-4'
								: 'disco-w-[300px] disco-pb-[18px] disco-pr-px disco-pt-[14px]'
						)}
					>
						{view === 'list' ? (
							<>
								{/* Header */}
								<div className="disco-px-6">
									<p className="disco-text-[12px] disco-font-normal disco-not-italic disco-tracking-[-0.12px] disco-text-[rgba(74,74,74,0.8)]">
										{triggerLabel}
									</p>
									<p className="disco-mt-[6px] disco-text-[14px] disco-font-bold disco-not-italic disco-tracking-[-0.14px] disco-text-black">
										{dateRangeText}
									</p>
								</div>

								{/* Top separator */}
								<div className="disco-my-3 disco-h-px disco-bg-[#e5e7eb]" />

								{/* Preset options */}
								<div className="disco-flex disco-flex-col">
									{DATE_RANGE_OPTIONS.map((option) => {
										const isActive =
											!isCustom &&
											selectedLabel === option.label;
										return (
											<button
												key={option.label}
												onClick={() =>
													handlePresetSelect(
														option.label
													)
												}
												className={cn(
													'disco-w-full disco-cursor-pointer disco-px-[23px] disco-py-[8px] disco-text-left',
													'disco-text-[14px] disco-not-italic disco-tracking-[-0.14px] disco-transition-colors',
													isActive
														? 'disco-font-bold disco-text-[#08c889]'
														: 'disco-font-semibold disco-text-[rgba(74,74,74,0.8)] hover:disco-text-[rgba(74,74,74,1)]'
												)}
											>
												{option.label}
											</button>
										);
									})}
								</div>

								{/* Bottom separator */}
								<div className="disco-my-1 disco-h-px disco-bg-[#e5e7eb]" />

								{/* Custom option */}
								<button
									onClick={() => setView('custom')}
									className={cn(
										'disco-w-full disco-cursor-pointer disco-px-[23px] disco-py-[8px] disco-text-left',
										'disco-text-[14px] disco-font-semibold disco-not-italic disco-tracking-[-0.14px]',
										isCustom
											? 'disco-font-bold disco-text-[#08c889]'
											: 'disco-text-[rgba(74,74,74,0.8)] disco-transition-colors hover:disco-text-[rgba(74,74,74,1)]'
									)}
								>
									Custom...
								</button>
							</>
						) : (
							<CustomDateRangePicker
								onApply={handleCustomApply}
								onClear={handleCustomClear}
							/>
						)}
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default DateRangeFilter;
