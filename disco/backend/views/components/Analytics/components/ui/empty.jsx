import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

function Empty({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "disco-flex disco-w-full disco-min-w-0 disco-flex-1 disco-flex-col disco-items-center disco-justify-center disco-gap-4 disco-rounded-xl disco-border-dashed disco-p-6 disco-text-center disco-text-balance",
        className
      )}
      {...props} />
  );
}

function EmptyHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "disco-flex disco-max-w-sm disco-flex-col disco-items-center disco-gap-2",
        className
      )}
      {...props} />
  );
}

const emptyMediaVariants = cva(
  "disco-mb-2 disco-flex disco-shrink-0 disco-items-center disco-justify-center [&_svg]:disco-pointer-events-none [&_svg]:disco-shrink-0",
  {
    variants: {
      variant: {
        default: "disco-bg-transparent",
        icon: "disco-flex disco-size-8 disco-shrink-0 disco-items-center disco-justify-center disco-rounded-lg disco-bg-muted disco-text-foreground [&_svg:not([class*=size-])]:disco-size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props} />
  );
}

function EmptyTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-title"
      className={cn("disco- disco-text-sm disco-font-medium disco-tracking-tight", className)}
      {...props} />
  );
}

function EmptyDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "disco-text-sm/relaxed disco-text-muted-foreground [&>a]:disco-underline [&>a]:disco-underline-offset-4 [&>a:hover]:disco-text-primary",
        className
      )}
      {...props} />
  );
}

function EmptyContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "disco-flex disco-w-full disco-max-w-sm disco-min-w-0 disco-flex-col disco-items-center disco-gap-2.5 disco-text-sm disco-text-balance",
        className
      )}
      {...props} />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
