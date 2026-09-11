import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "disco:group/button disco:inline-flex disco:shrink-0 disco:items-center disco:justify-center disco:rounded-lg disco:border disco:border-transparent disco:bg-clip-padding disco:text-sm disco:font-medium disco:whitespace-nowrap disco:transition-all disco:outline-hidden disco:select-none disco:focus-visible:border-ring disco:focus-visible:ring-3 disco:focus-visible:ring-ring/50 disco:active:not-aria-[haspopup]:translate-y-px disco:disabled:pointer-events-none disco:disabled:opacity-50 disco:aria-invalid:border-destructive disco:aria-invalid:ring-3 disco:aria-invalid:ring-destructive/20 disco:dark:aria-invalid:border-destructive/50 disco:dark:aria-invalid:ring-destructive/40 disco:[&_svg]:pointer-events-none disco:[&_svg]:shrink-0 disco:[&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default: "disco:bg-primary disco:text-primary-foreground disco:[a]:hover:bg-primary/80",
        outline:
          "disco:border-border disco:bg-background disco:hover:bg-muted disco:hover:text-foreground disco:aria-expanded:bg-muted disco:aria-expanded:text-foreground disco:dark:border-input disco:dark:bg-input/30 disco:dark:hover:bg-input/50",
        secondary:
          "disco:bg-secondary disco:text-secondary-foreground disco:hover:bg-secondary/80 disco:aria-expanded:bg-secondary disco:aria-expanded:text-secondary-foreground",
        ghost:
          "disco:hover:bg-muted disco:hover:text-foreground disco:aria-expanded:bg-muted disco:aria-expanded:text-foreground disco:dark:hover:bg-muted/50",
        destructive:
          "disco:bg-destructive/10 disco:text-destructive disco:hover:bg-destructive/20 disco:focus-visible:border-destructive/40 disco:focus-visible:ring-destructive/20 disco:dark:bg-destructive/20 disco:dark:hover:bg-destructive/30 disco:dark:focus-visible:ring-destructive/40",
        link: "disco:text-primary disco:underline-offset-4 disco:hover:underline",
      },
      size: {
        default:
          "disco:h-8 disco:gap-1.5 disco:px-2.5 disco:has-data-[icon=inline-end]:pr-2 disco:has-data-[icon=inline-start]:pl-2",
        xs: "disco:h-6 disco:gap-1 disco:rounded-[min(var(--radius-md),10px)] disco:px-2 disco:text-xs disco:in-data-[slot=button-group]:rounded-lg disco:has-data-[icon=inline-end]:pr-1.5 disco:has-data-[icon=inline-start]:pl-1.5 disco:[&_svg:not([class*=size-])]:size-3",
        sm: "disco:h-7 disco:gap-1 disco:rounded-[min(var(--radius-md),12px)] disco:px-2.5 disco:text-[0.8rem] disco:in-data-[slot=button-group]:rounded-lg disco:has-data-[icon=inline-end]:pr-1.5 disco:has-data-[icon=inline-start]:pl-1.5 disco:[&_svg:not([class*=size-])]:size-3.5",
        lg: "disco:h-9 disco:gap-1.5 disco:px-2.5 disco:has-data-[icon=inline-end]:pr-2 disco:has-data-[icon=inline-start]:pl-2",
        icon: "disco:size-8",
        "icon-xs":
          "disco:size-6 disco:rounded-[min(var(--radius-md),10px)] disco:in-data-[slot=button-group]:rounded-lg disco:[&_svg:not([class*=size-])]:size-3",
        "icon-sm":
          "disco:size-7 disco:rounded-[min(var(--radius-md),12px)] disco:in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "disco:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
