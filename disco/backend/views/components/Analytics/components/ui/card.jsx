import { cn } from '@/lib/utils';

function Card({ className, size = 'default', ...props }) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				'disco:group/card disco:flex disco:flex-col disco:gap-4 disco:overflow-hidden disco:rounded-xl disco:bg-card disco:py-4 disco:text-sm disco:text-card-foreground disco:ring-foreground/10 disco:has-data-[slot=card-footer]:pb-0 disco:has-[>img:first-child]:pt-0 disco:data-[size=sm]:gap-3 disco:data-[size=sm]:py-3 disco:data-[size=sm]:has-data-[slot=card-footer]:pb-0 disco:*:[img:first-child]:rounded-t-xl disco:*:[img:last-child]:rounded-b-xl',
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
				'disco:group/card-header disco:@container/card-header disco:grid disco:auto-rows-min disco:items-start disco:gap-1 disco:rounded-t-xl disco:px-4 disco:group-data-[size=sm]/card:px-3 disco:has-data-[slot=card-action]:grid-cols-[1fr_auto] disco:has-data-[slot=card-description]:grid-rows-[auto_auto] disco:[.border-b]:pb-4 disco:group-data-[size=sm]/card:[.border-b]:pb-3',
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
				'disco:text-base disco:leading-snug disco:font-medium disco:group-data-[size=sm]/card:text-sm',
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
				'disco:text-sm disco:text-muted-foreground',
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
				'disco:col-start-2 disco:row-span-2 disco:row-start-1 disco:self-start disco:justify-self-end',
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
				'disco:px-4 disco:group-data-[size=sm]/card:px-3',
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
				'disco:flex disco:items-center disco:rounded-b-xl disco:border-t disco:bg-muted/50 disco:p-4 disco:group-data-[size=sm]/card:p-3',
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
