import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "disco-group/button disco-inline-flex disco-shrink-0 disco-items-center disco-justify-center disco-rounded-lg disco-border disco-border-transparent disco-bg-clip-padding disco-text-sm disco-font-medium disco-whitespace-nowrap disco-transition-all disco-outline-none disco-select-none focus-visible:disco-border-ring focus-visible:disco-ring-3 focus-visible:disco-ring-ring/50 active:not-aria-[haspopup]:disco-translate-y-px disabled:disco-pointer-events-none disabled:disco-opacity-50 aria-invalid:disco-border-destructive aria-invalid:disco-ring-3 aria-invalid:disco-ring-destructive/20 dark:aria-invalid:disco-border-destructive/50 dark:aria-invalid:disco-ring-destructive/40 [&_svg]:disco-pointer-events-none [&_svg]:disco-shrink-0 [&_svg:not([class*=size-])]:disco-size-4",
  {
    variants: {
      variant: {
        default: "disco-bg-primary disco-text-primary-foreground [a]:hover:disco-bg-primary/80",
        outline:
          "disco-border-border disco-bg-background hover:disco-bg-muted hover:disco-text-foreground aria-expanded:disco-bg-muted aria-expanded:disco-text-foreground dark:disco-border-input dark:disco-bg-input/30 dark:hover:disco-bg-input/50",
        secondary:
          "disco-bg-secondary disco-text-secondary-foreground hover:disco-bg-secondary/80 aria-expanded:disco-bg-secondary aria-expanded:disco-text-secondary-foreground",
        ghost:
          "hover:disco-bg-muted hover:disco-text-foreground aria-expanded:disco-bg-muted aria-expanded:disco-text-foreground dark:hover:disco-bg-muted/50",
        destructive:
          "disco-bg-destructive/10 disco-text-destructive hover:disco-bg-destructive/20 focus-visible:disco-border-destructive/40 focus-visible:disco-ring-destructive/20 dark:disco-bg-destructive/20 dark:hover:disco-bg-destructive/30 dark:focus-visible:disco-ring-destructive/40",
        link: "disco-text-primary disco-underline-offset-4 hover:disco-underline",
      },
      size: {
        default:
          "disco-h-8 disco-gap-1.5 disco-px-2.5 has-data-[icon=inline-end]:disco-pr-2 has-data-[icon=inline-start]:disco-pl-2",
        xs: "disco-h-6 disco-gap-1 disco-rounded-[min(var(--radius-md),10px)] disco-px-2 disco-text-xs in-data-[slot=button-group]:disco-rounded-lg has-data-[icon=inline-end]:disco-pr-1.5 has-data-[icon=inline-start]:disco-pl-1.5 [&_svg:not([class*=size-])]:disco-size-3",
        sm: "disco-h-7 disco-gap-1 disco-rounded-[min(var(--radius-md),12px)] disco-px-2.5 disco-text-[0.8rem] in-data-[slot=button-group]:disco-rounded-lg has-data-[icon=inline-end]:disco-pr-1.5 has-data-[icon=inline-start]:disco-pl-1.5 [&_svg:not([class*=size-])]:disco-size-3.5",
        lg: "disco-h-9 disco-gap-1.5 disco-px-2.5 has-data-[icon=inline-end]:disco-pr-2 has-data-[icon=inline-start]:disco-pl-2",
        icon: "disco-size-8",
        "icon-xs":
          "disco-size-6 disco-rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:disco-rounded-lg [&_svg:not([class*=size-])]:disco-size-3",
        "icon-sm":
          "disco-size-7 disco-rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:disco-rounded-lg",
        "icon-lg": "disco-size-9",
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
