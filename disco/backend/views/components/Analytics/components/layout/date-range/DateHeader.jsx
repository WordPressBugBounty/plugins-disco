import { format, isValid, parse } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const DATE_FORMAT = 'dd-MM-yyyy';
const PLACEHOLDER = 'DD-MM-YYYY';

export default function DateHeader({ label, date, onDateChange }) {
	const [editing, setEditing] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState(false);
	const inputRef = useRef(null);

	const formattedDate = date ? format(date, DATE_FORMAT) : '';

	// Sync input value when date changes externally (e.g. calendar click)
	useEffect(() => {
		if (!editing) {
			setInputValue(formattedDate);
			setError(false);
		}
	}, [formattedDate, editing]);

	const handleClick = () => {
		if (!onDateChange) return;
		setEditing(true);
		setInputValue(formattedDate);
		setError(false);
		// Focus after render
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const commitValue = (value) => {
		const trimmed = value.trim();
		if (!trimmed) {
			// Empty means clear
			setEditing(false);
			setError(false);
			return;
		}
		const parsed = parse(trimmed, DATE_FORMAT, new Date());
		if (isValid(parsed)) {
			onDateChange(parsed);
			setEditing(false);
			setError(false);
		} else {
			setError(true);
		}
	};

	const handleBlur = () => {
		commitValue(inputValue);
		// If there was an error, revert on blur
		if (!isValid(parse(inputValue.trim(), DATE_FORMAT, new Date()))) {
			setInputValue(formattedDate);
			setError(false);
			setEditing(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			commitValue(inputValue);
		}
		if (e.key === 'Escape') {
			setInputValue(formattedDate);
			setError(false);
			setEditing(false);
		}
	};

	return (
		<div
			className={cn(
				'disco-mb-2 disco-flex disco-items-center disco-gap-2 disco-rounded-[5px] disco-border disco-px-3 disco-py-1.5',
				error ? 'disco-border-red-400' : 'disco-border-[#e5e7eb]'
			)}
		>
			<span className="disco-text-xs disco-font-medium disco-text-[rgba(74,74,74,0.45)]">
				{label}
			</span>

			{editing ? (
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						setError(false);
					}}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={PLACEHOLDER}
					className="!disco-border-none disco-bg-transparent disco-p-0 disco-text-xs disco-font-semibold disco-text-gray-700 !disco-outline-none !disco-shadow-none focus:!disco-outline-none focus:!disco-shadow-none focus:!disco-border-none disco-h-[30px] !disco-min-h-0 disco-max-w-28"
				/>
			) : (
				<span
					onClick={handleClick}
					className={cn(
						'disco-text-xs disco-font-semibold disco-text-gray-700 disco-h-[30px] disco-leading-8',
						onDateChange && 'disco-cursor-text'
					)}
				>
					{formattedDate || '--'}
				</span>
			)}
		</div>
	);
}
