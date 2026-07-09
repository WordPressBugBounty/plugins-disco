import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "disco-group/calendar disco-bg-background disco-p-2 disco-[--cell-radius:var(--radius-md)] disco-[--cell-size:--spacing(7)] in-data-[slot=card-content]:disco-bg-transparent in-data-[slot=popover-content]:disco-bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("disco-w-fit", defaultClassNames.root),
        months: cn(
          "disco-relative disco-flex disco-flex-col disco-gap-4 md:disco-flex-row",
          defaultClassNames.months
        ),
        month: cn(
          "disco-flex disco-w-full disco-flex-col disco-gap-4",
          defaultClassNames.month
        ),
        nav: cn(
          "disco-absolute disco-inset-x-0 disco-top-0 disco-flex disco-w-full disco-items-center disco-justify-between disco-gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "disco-size-(--cell-size) disco-p-0 disco-select-none aria-disabled:disco-opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "disco-size-(--cell-size) disco-p-0 disco-select-none aria-disabled:disco-opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "disco-flex disco-h-(--cell-size) disco-w-full disco-items-center disco-justify-center disco-px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "disco-flex disco-h-(--cell-size) disco-w-full disco-items-center disco-justify-center disco-gap-1.5 disco-text-sm disco-font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "disco-relative disco-rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "disco-absolute disco-inset-0 disco-bg-popover disco-opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn("disco-font-medium disco-select-none", captionLayout === "label"
          ? "disco-text-sm"
          : "disco-flex disco-items-center disco-gap-1 disco-rounded-(--cell-radius) disco-text-sm [&>svg]:disco-size-3.5 [&>svg]:disco-text-muted-foreground", defaultClassNames.caption_label),
        table: "disco-w-full disco-border-collapse",
        weekdays: cn("disco-flex", defaultClassNames.weekdays),
        weekday: cn(
          "disco-flex-1 disco-rounded-(--cell-radius) disco-text-[0.8rem] disco-font-normal disco-text-muted-foreground disco-select-none",
          defaultClassNames.weekday
        ),
        week: cn("disco-mt-2 disco-flex disco-w-full", defaultClassNames.week),
        week_number_header: cn(
          "disco-w-(--cell-size) disco-select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "disco-text-[0.8rem] disco-text-muted-foreground disco-select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "disco-group/day disco-relative disco-aspect-square disco-h-full disco-w-full disco-rounded-(--cell-radius) disco-p-0 disco-text-center disco-select-none [&:last-child[data-selected=true]_button]:disco-rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:disco-rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:disco-rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "disco-relative disco-isolate disco-z-0 disco-rounded-l-(--cell-radius) disco-bg-muted after:disco-absolute after:disco-inset-y-0 after:disco-right-0 after:disco-w-4 after:disco-bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("disco-rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "disco-relative disco-isolate disco-z-0 disco-rounded-r-(--cell-radius) disco-bg-muted after:disco-absolute after:disco-inset-y-0 after:disco-left-0 after:disco-w-4 after:disco-bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "disco-rounded-(--cell-radius) disco-bg-muted disco-text-foreground data-[selected=true]:disco-rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "disco-text-muted-foreground aria-selected:disco-text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("disco-text-muted-foreground disco-opacity-50", defaultClassNames.disabled),
        hidden: cn("disco-invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("disco-size-4", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("disco-size-4", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("disco-size-4", className)} {...props} />);
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div
                className="disco-flex disco-size-(--cell-size) disco-items-center disco-justify-center disco-text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props} />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "disco-relative disco-isolate disco-z-10 disco-flex disco-aspect-square disco-size-auto disco-w-full disco-min-w-(--cell-size) disco-flex-col disco-gap-1 disco-border-0 disco-leading-none disco-font-normal group-data-[focused=true]/day:disco-relative group-data-[focused=true]/day:disco-z-10 group-data-[focused=true]/day:disco-border-ring group-data-[focused=true]/day:disco-ring-[3px] group-data-[focused=true]/day:disco-ring-ring/50 data-[range-end=true]:disco-rounded-(--cell-radius) data-[range-end=true]:disco-rounded-r-(--cell-radius) data-[range-end=true]:disco-bg-primary data-[range-end=true]:disco-text-primary-foreground data-[range-middle=true]:disco-rounded-none data-[range-middle=true]:disco-bg-muted data-[range-middle=true]:disco-text-foreground data-[range-start=true]:disco-rounded-(--cell-radius) data-[range-start=true]:disco-rounded-l-(--cell-radius) data-[range-start=true]:disco-bg-primary data-[range-start=true]:disco-text-primary-foreground data-[selected-single=true]:disco-bg-primary data-[selected-single=true]:disco-text-primary-foreground dark:hover:disco-text-foreground [&>span]:disco-text-xs [&>span]:disco-opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props} />
  );
}

export { Calendar, CalendarDayButton }
