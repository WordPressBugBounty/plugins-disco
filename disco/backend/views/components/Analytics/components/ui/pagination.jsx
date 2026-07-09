import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

function Pagination({ className, ...props }) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			data-slot="pagination"
			className={cn('disco-flex disco-w-fit disco-justify-center', className)}
			{...props}
		/>
	);
}

function PaginationContent({ className, ...props }) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn(
				'disco-flex disco-flex-row disco-items-center disco-gap-1',
				className
			)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }) {
	return <li data-slot="pagination-item" {...props} />;
}

function PaginationLink({ className, isActive, size = 'icon-sm', ...props }) {
	return (
		<button
			type="button"
			aria-current={isActive ? 'page' : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			className={cn(
				buttonVariants({ variant: 'ghost', size }),
				isActive
					? 'disco-bg-[#47cd89] disco-text-white hover:disco-bg-[#47cd89]/90 hover:disco-text-white'
					: 'disco-text-[#6b7280]',
				className
			)}
			{...props}
		/>
	);
}

function PaginationPrevious({ className, ...props }) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			className={className}
			{...props}
		>
			<ChevronLeftIcon />
		</PaginationLink>
	);
}

function PaginationNext({ className, ...props }) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			className={className}
			{...props}
		>
			<ChevronRightIcon />
		</PaginationLink>
	);
}

function PaginationEllipsis({ className, ...props }) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn(
				'disco-flex disco-size-7 disco-items-center disco-justify-center disco-text-[#6b7280]',
				className
			)}
			{...props}
		>
			<MoreHorizontalIcon className="disco-size-4" />
			<span className="disco-sr-only">More pages</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
