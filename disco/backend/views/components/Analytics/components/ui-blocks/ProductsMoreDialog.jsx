import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import { truncate } from '@/lib/utils';
import { useState } from 'react';

const ProductsMoreDialog = ({ title, items }) => {
	const [open, setOpen] = useState(false);

	if (!items.length) return '—';
	if (items.length === 1) return truncate(items[0].name, 40);

	const firstName = truncate(items[0].name, 30);
	const remaining = items.length - 1;

	return (
		<span className="disco-inline-flex disco-items-center disco-gap-1.5">
			<span>{firstName}</span>
			<Dialog open={open} onOpenChange={setOpen}>
				<span
					onClick={() => setOpen(true)}
					className="disco-inline-flex disco-items-center disco-px-1.5 disco-py-0.5 disco-text-xs disco-font-medium disco-text-primary disco-border disco-border-primary disco-rounded-md disco-cursor-pointer disco-whitespace-nowrap"
				>
					+{remaining} More
				</span>
				<DialogContent className="disco-w-full disco-max-w-sm disco-p-0">
					<div className="disco-flex disco-items-center disco-justify-between disco-px-4 disco-py-3 disco-border-b disco-border-gray-100">
						<DialogTitle className="disco-text-sm disco-font-semibold">
							{title} ({items.length})
						</DialogTitle>
						<DialogClose className="disco-text-gray-400 hover:disco-text-gray-600 disco-text-lg disco-leading-none disco-cursor-pointer disco-outline-none">
							✕
						</DialogClose>
					</div>
					<div className="disco-max-h-60 disco-overflow-y-auto disco-py-1">
						{items.map((p, i) => (
							<div
								key={p.id}
								className={`disco-px-4 disco-py-2 disco-text-sm disco-text-gray-700${i < items.length - 1 ? ' disco-border-b disco-border-gray-100' : ''}`}
							>
								{truncate(p.name, 50)}
							</div>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</span>
	);
};

export default ProductsMoreDialog;
