import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "disco-group/badge disco-inline-flex disco-h-5 disco-w-fit disco-shrink-0 disco-items-center disco-justify-center disco-gap-1 disco-overflow-hidden disco-rounded-4xl disco-border disco-border-transparent disco-px-2 disco-py-0.5 disco-text-xs disco-font-medium disco-whitespace-nowrap disco-transition-all focus-visible:disco-border-ring focus-visible:disco-ring-[3px] focus-visible:disco-ring-ring/50 has-data-[icon=inline-end]:disco-pr-1.5 has-data-[icon=inline-start]:disco-pl-1.5 aria-invalid:disco-border-destructive aria-invalid:disco-ring-destructive/20 dark:aria-invalid:disco-ring-destructive/40 [&>svg]:disco-pointer-events-none [&>svg]:disco-size-3!",
  {
    variants: {
      variant: {
        default: "disco-bg-primary disco-text-primary-foreground [a]:hover:disco-bg-primary/80",
        secondary:
          "disco-bg-secondary disco-text-secondary-foreground [a]:hover:disco-bg-secondary/80",
        destructive:
          "disco-bg-destructive/10 disco-text-destructive focus-visible:disco-ring-destructive/20 dark:disco-bg-destructive/20 dark:focus-visible:disco-ring-destructive/40 [a]:hover:disco-bg-destructive/20",
        outline:
          "disco-border-border disco-text-foreground [a]:hover:disco-bg-muted [a]:hover:disco-text-muted-foreground",
        ghost:
          "hover:disco-bg-muted hover:disco-text-muted-foreground dark:hover:disco-bg-muted/50",
        link: "disco-text-primary disco-underline-offset-4 hover:disco-underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps({
      className: cn(badgeVariants({ variant }), className),
    }, props),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants }
