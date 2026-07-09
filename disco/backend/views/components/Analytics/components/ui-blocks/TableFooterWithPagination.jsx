import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

const range = (start, end) =>
	Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Build the list of pagination items, inserting ellipsis markers when there
 * are too many pages to show at once (e.g. 1 2 3 … 99).
 * @param {number} page current page
 * @param {number} totalPages total number of pages
 * @returns {Array<number|'ellipsis'>}
 */
function getPaginationItems(page, totalPages) {
	if (totalPages <= 7) {
		return range(1, totalPages);
	}
	if (page <= 4) {
		return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
	}
	if (page >= totalPages - 3) {
		return [1, 'ellipsis', ...range(totalPages - 4, totalPages)];
	}
	return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];
}

const TableFooterWithPagination = ({
	totalPages,
	page,
	onPageChange,
	disabled = false,
}) => {
	const items = getPaginationItems(page, totalPages);

	return (
		<div className="disco-flex disco-items-center disco-justify-between disco-px-4 disco-py-2.5 disco-border-t disco-border-[#f3f4f6]">
			<span className="disco-text-xs disco-text-[#9ca3af]">
				Showing {page} of {totalPages}
			</span>
			{totalPages > 1 && (
				<Pagination
					aria-disabled={disabled}
					className={cn(
						'disco-border disco-border-primary disco-py-1 disco-px-2 disco-rounded-lg',
						disabled &&
							'disco-pointer-events-none disco-opacity-50'
					)}
				>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => onPageChange(page - 1)}
								disabled={disabled || page <= 1}
							/>
						</PaginationItem>
						{items.map((item, index) =>
							item === 'ellipsis' ? (
								<PaginationItem key={`ellipsis-${index}`}>
									<PaginationEllipsis />
								</PaginationItem>
							) : (
								<PaginationItem key={item}>
									<PaginationLink
										isActive={item === page}
										onClick={() => onPageChange(item)}
										disabled={disabled}
									>
										{item}
									</PaginationLink>
								</PaginationItem>
							)
						)}
						<PaginationItem>
							<PaginationNext
								onClick={() => onPageChange(page + 1)}
								disabled={disabled || page >= totalPages}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
};

export default TableFooterWithPagination;
