import { cn } from '@/lib/utils';

function Card({ className, size = 'default', ...props }) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				'disco-group/card disco-flex disco-flex-col disco-gap-4 disco-overflow-hidden disco-rounded-xl disco-bg-card disco-py-4 disco-text-sm disco-text-card-foreground disco-ring-foreground/10 has-data-[slot=card-footer]:disco-pb-0 has-[>img:first-child]:disco-pt-0 data-[size=sm]:disco-gap-3 data-[size=sm]:disco-py-3 data-[size=sm]:has-data-[slot=card-footer]:disco-pb-0 *:[img:first-child]:disco-rounded-t-xl *:[img:last-child]:disco-rounded-b-xl',
				className
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				'disco-group/card-header disco-@container/card-header disco-grid disco-auto-rows-min disco-items-start disco-gap-1 disco-rounded-t-xl disco-px-4 group-data-[size=sm]/card:disco-px-3 has-data-[slot=card-action]:disco-grid-cols-[1fr_auto] has-data-[slot=card-description]:disco-grid-rows-[auto_auto] [.border-b]:disco-pb-4 group-data-[size=sm]/card:[.border-b]:disco-pb-3',
				className
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				'disco- disco-text-base disco-leading-snug disco-font-medium group-data-[size=sm]/card:disco-text-sm',
				className
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }) {
	return (
		<div
			data-slot="card-description"
			className={cn(
				'disco-text-sm disco-text-muted-foreground',
				className
			)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				'disco-col-start-2 disco-row-span-2 disco-row-start-1 disco-self-start disco-justify-self-end',
				className
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }) {
	return (
		<div
			data-slot="card-content"
			className={cn(
				'disco-px-4 group-data-[size=sm]/card:disco-px-3',
				className
			)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				'disco-flex disco-items-center disco-rounded-b-xl disco-border-t disco-bg-muted/50 disco-p-4 group-data-[size=sm]/card:disco-p-3',
				className
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
};
