import { cn } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { Search } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import EmptyData from './EmptyData';
import ProLockOverlay from './ProLockOverlay';
import TableFooterWithPagination from './TableFooterWithPagination';

const SortIcon = ({ active, dir }) => (
	<span className="disco-ml-0.5 disco-text-[10px]">
		{active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
	</span>
);

const DataTable = ({
	columns,
	data = [],
	renderRow,
	title,
	total = 0,
	searchPlaceholder = 'Search...',
	search = '',
	onSearchChange,
	sortKey,
	sortDir = 'desc',
	onSort,
	page = 1,
	totalPages = 1,
	onPageChange,
	isLoading = false,
	rowKey = 'id',
	cellPadding = 'disco-px-4',
	className = '',
	locked = false,
	visibleRows = 2,
	lockOverlay,
}) => {
	const overlayProps = lockOverlay ?? {
		size: 'lg',
		label: __('Upgrade to pro', 'disco'),
		titleClassName:
			'disco-max-w-md disco-text-base disco-font-normal disco-text-[#111827] disco-leading-snug',
		title: (
			<>
				<strong className="disco-font-semibold">
					{__('Upgrade to Disco Pro', 'disco')}
				</strong>{' '}
				{__(
					"to see which products respond best to discounts — and which ones you're over-discounting.",
					'disco'
				)}
			</>
		),
	};
	const getRowKey = (item, index) =>
		typeof rowKey === 'function' ? rowKey(item) : (item[rowKey] ?? index);

	// When locked, the upgrade overlay is anchored just below the last freely
	// visible row. Measure that row's offset so exactly `visibleRows` stay crisp.
	const tableWrapRef = useRef(null);
	const [overlayTop, setOverlayTop] = useState(null);
	const showLock = locked && !isLoading && data.length > visibleRows;

	useLayoutEffect(() => {
		if (!showLock || !tableWrapRef.current) {
			setOverlayTop(null);
			return;
		}
		const rows = tableWrapRef.current.querySelectorAll('tbody > tr');
		const firstLockedRow = rows[visibleRows];
		if (!firstLockedRow) {
			setOverlayTop(null);
			return;
		}
		const wrapTop = tableWrapRef.current.getBoundingClientRect().top;
		setOverlayTop(firstLockedRow.getBoundingClientRect().top - wrapTop);
	}, [showLock, data, visibleRows]);

	return (
		<div
			className={cn(
				`disco-bg-white disco-rounded-xl disco-border disco-border-[#e5e7eb] disco-overflow-hidden ${className}`
			)}
		>
			{/* Toolbar */}
			<div className="disco-flex disco-items-center disco-justify-between disco-px-4 disco-py-3 disco-border-b disco-border-[#f3f4f6]">
				<span className="disco-text-sm disco-font-semibold disco-text-[#1f2937]">
					{__(title)}
					<span className="disco-text-[#9ca3af] disco-font-normal disco-text-xs">
						({total})
					</span>
				</span>
				<div className="disco-relative">
					<Search className="disco-absolute disco-left-2.5 disco-top-1/2 disco--translate-y-1/2 disco-size-3 disco-text-[#9ca3af]" />
					<input
						type="text"
						placeholder={searchPlaceholder}
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="!disco-pl-7 disco-pr-3 disco-py-1.5 disco-text-xs disco-border !disco-border-gray-300 !disco-rounded-lg disco-bg-gray-100 disco-text-gray-500 placeholder:disco-text-gray-400 !disco-outline-none focus:!disco-border-primary disco-w-44 focus:!disco-shadow-none"
						disabled={locked}
					/>
				</div>
			</div>

			{/* Table */}
			<div
				ref={tableWrapRef}
				className="disco-relative disco-overflow-x-auto"
				style={
					showLock && overlayTop !== null
						? { minHeight: overlayTop + 200 }
						: undefined
				}
			>
				{showLock && overlayTop !== null && (
					<ProLockOverlay
						{...overlayProps}
						position="disco-inset-x-0 disco-bottom-0"
						rounded="disco-rounded-none"
						className="disco-bg-white/[0.94]"
						style={{ top: overlayTop }}
					/>
				)}
				{data.length === 0 && !isLoading ? (
					<EmptyData title={title.split(' ').at(-1)} />
				) : (
					<table className="disco-w-full disco-text-xs">
						<thead>
							<tr className="disco-bg-[#f9fafb] disco-border-b disco-border-[#f3f4f6]">
								{columns.map((col) => (
									<th
										key={col.key}
										onClick={() =>
											!locked &&
											col.sortable &&
											onSort(col.key)
										}
										className={cn(
											cellPadding,
											'disco-py-2.5 disco-text-left disco-font-semibold disco-tracking-[0.06em] disco-uppercase disco-text-[10px] disco-whitespace-nowrap',
											col.sortable &&
												'disco-cursor-pointer disco-select-none',
											sortKey === col.key
												? 'disco-text-[#2fa86d]'
												: 'disco-text-[#9ca3af]'
										)}
									>
										{col.label}
										{col.sortable && (
											<SortIcon
												active={sortKey === col.key}
												dir={sortDir}
											/>
										)}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{isLoading
								? Array.from({ length: 5 }).map((_, i) => (
										<tr
											key={i}
											className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0"
										>
											<td
												colSpan={columns.length}
												className={cn(
													cellPadding,
													'disco-py-3'
												)}
											>
												<div className="disco-h-5 disco-animate-pulse disco-rounded disco-bg-[#f3f4f6]" />
											</td>
										</tr>
									))
								: data.map((item, index) =>
										renderRow(
											item,
											index,
											getRowKey(item, index)
										)
									)}
						</tbody>
					</table>
				)}
			</div>

			{/* Footer with pagination */}
			<TableFooterWithPagination
				page={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
				disabled={locked}
			/>
		</div>
	);
};

export default DataTable;
