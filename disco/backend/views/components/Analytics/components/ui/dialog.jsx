import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { cn } from '@/lib/utils';

function Dialog({ ...props }) {
	return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({ ...props }) {
	return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal({ ...props }) {
	return <DialogPrimitive.Portal {...props} />;
}

function DialogClose({ ...props }) {
	return <DialogPrimitive.Close {...props} />;
}

function DialogBackdrop({ className, ...props }) {
	return (
		<DialogPrimitive.Backdrop
			className={cn(
				'disco-fixed disco-inset-0 disco-z-50 disco-bg-black/30 disco-backdrop-blur-[2px]',
				'data-[starting-style]:disco-opacity-0 data-[ending-style]:disco-opacity-0 disco-transition-opacity',
				className
			)}
			{...props}
		/>
	);
}

function DialogContent({ className, children, ...props }) {
	return (
		<DialogPrimitive.Portal>
			<DialogBackdrop />
			<DialogPrimitive.Popup
				className={cn(
					'disco-fixed disco-left-1/2 disco-top-1/2 disco-z-50 disco--translate-x-1/2 disco--translate-y-1/2',
					'disco-rounded-2xl disco-bg-white disco-shadow-xl',
					'disco-overflow-hidden disco-outline-none',
					'data-[starting-style]:disco-opacity-0 data-[starting-style]:disco-scale-95',
					'data-[ending-style]:disco-opacity-0 data-[ending-style]:disco-scale-95',
					'disco-transition-all',
					className
				)}
				{...props}
			>
				{children}
			</DialogPrimitive.Popup>
		</DialogPrimitive.Portal>
	);
}

function DialogTitle({ className, ...props }) {
	return (
		<DialogPrimitive.Title
			className={cn('disco-text-lg disco-font-semibold', className)}
			{...props}
		/>
	);
}

function DialogDescription({ className, ...props }) {
	return (
		<DialogPrimitive.Description
			className={cn('disco-text-sm disco-text-muted-foreground', className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogBackdrop,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
