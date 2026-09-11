import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'disco:group/badge disco:inline-flex disco:h-5 disco:w-fit disco:shrink-0 disco:items-center disco:justify-center disco:gap-1 disco:overflow-hidden disco:rounded-4xl disco:border disco:border-transparent disco:px-2 disco:py-0.5 disco:text-xs disco:font-medium disco:whitespace-nowrap disco:transition-all disco:focus-visible:border-ring disco:focus-visible:ring-[3px] disco:focus-visible:ring-ring/50 disco:has-data-[icon=inline-end]:pr-1.5 disco:has-data-[icon=inline-start]:pl-1.5 disco:aria-invalid:border-destructive disco:aria-invalid:ring-destructive/20 disco:dark:aria-invalid:ring-destructive/40 disco:[&>svg]:pointer-events-none disco:[&>svg]:size-3!',
	{
		variants: {
			variant: {
				default:
					' disco:text-primary-foreground disco:[a]:hover:bg-primary/80',
				secondary:
					'disco:bg-secondary disco:text-secondary-foreground disco:[a]:hover:bg-secondary/80',
				destructive:
					'disco:bg-destructive/10 disco:text-destructive disco:focus-visible:ring-destructive/20 disco:dark:bg-destructive/20 disco:dark:focus-visible:ring-destructive/40 disco:[a]:hover:bg-destructive/20',
				outline:
					'disco:border-border disco:text-foreground disco:[a]:hover:bg-muted disco:[a]:hover:text-muted-foreground',
				ghost: 'disco:hover:bg-muted disco:hover:text-muted-foreground disco:dark:hover:bg-muted/50',
				link: 'disco:text-primary disco:underline-offset-4 disco:hover:underline',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

function Badge({ className, variant = 'default', render, ...props }) {
	return useRender({
		defaultTagName: 'span',
		props: mergeProps(
			{
				className: cn(badgeVariants({ variant }), className),
			},
			props
		),
		render,
		state: {
			slot: 'badge',
			variant,
		},
	});
}

export { Badge, badgeVariants };
