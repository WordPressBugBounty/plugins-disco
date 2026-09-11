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
        "disco:group/calendar disco:bg-background disco:p-2 disco:[--cell-radius:var(--radius-md)] disco:[--cell-size:--spacing(7)] disco:in-data-[slot=card-content]:bg-transparent disco:in-data-[slot=popover-content]:bg-transparent",
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
        root: cn("disco:w-fit", defaultClassNames.root),
        months: cn(
          "disco:relative disco:flex disco:flex-col disco:gap-4 disco:md:flex-row",
          defaultClassNames.months
        ),
        month: cn(
          "disco:flex disco:w-full disco:flex-col disco:gap-4",
          defaultClassNames.month
        ),
        nav: cn(
          "disco:absolute disco:inset-x-0 disco:top-0 disco:flex disco:w-full disco:items-center disco:justify-between disco:gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "disco:size-(--cell-size) disco:p-0 disco:select-none disco:aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "disco:size-(--cell-size) disco:p-0 disco:select-none disco:aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "disco:flex disco:h-(--cell-size) disco:w-full disco:items-center disco:justify-center disco:px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "disco:flex disco:h-(--cell-size) disco:w-full disco:items-center disco:justify-center disco:gap-1.5 disco:text-sm disco:font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "disco:relative disco:rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "disco:absolute disco:inset-0 disco:bg-popover disco:opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn("disco:font-medium disco:select-none", captionLayout === "label"
          ? "disco:text-sm"
          : "disco:flex disco:items-center disco:gap-1 disco:rounded-(--cell-radius) disco:text-sm disco:[&>svg]:size-3.5 disco:[&>svg]:text-muted-foreground", defaultClassNames.caption_label),
        table: "disco:w-full disco:border-collapse",
        weekdays: cn("disco:flex", defaultClassNames.weekdays),
        weekday: cn(
          "disco:flex-1 disco:rounded-(--cell-radius) disco:text-[0.8rem] disco:font-normal disco:text-muted-foreground disco:select-none",
          defaultClassNames.weekday
        ),
        week: cn("disco:mt-2 disco:flex disco:w-full", defaultClassNames.week),
        week_number_header: cn(
          "disco:w-(--cell-size) disco:select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "disco:text-[0.8rem] disco:text-muted-foreground disco:select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "disco:group/day disco:relative disco:aspect-square disco:h-full disco:w-full disco:rounded-(--cell-radius) disco:p-0 disco:text-center disco:select-none disco:[&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "disco:[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "disco:[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "disco:relative disco:isolate disco:z-0 disco:rounded-l-(--cell-radius) disco:bg-muted disco:after:absolute disco:after:inset-y-0 disco:after:right-0 disco:after:w-4 disco:after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("disco:rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "disco:relative disco:isolate disco:z-0 disco:rounded-r-(--cell-radius) disco:bg-muted disco:after:absolute disco:after:inset-y-0 disco:after:left-0 disco:after:w-4 disco:after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "disco:rounded-(--cell-radius) disco:bg-muted disco:text-foreground disco:data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "disco:text-muted-foreground disco:aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("disco:text-muted-foreground disco:opacity-50", defaultClassNames.disabled),
        hidden: cn("disco:invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("disco:size-4", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("disco:size-4", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("disco:size-4", className)} {...props} />);
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div
                className="disco:flex disco:size-(--cell-size) disco:items-center disco:justify-center disco:text-center">
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
        "disco:relative disco:isolate disco:z-10 disco:flex disco:aspect-square disco:size-auto disco:w-full disco:min-w-(--cell-size) disco:flex-col disco:gap-1 disco:border-0 disco:leading-none disco:font-normal disco:group-data-[focused=true]/day:relative disco:group-data-[focused=true]/day:z-10 disco:group-data-[focused=true]/day:border-ring disco:group-data-[focused=true]/day:ring-[3px] disco:group-data-[focused=true]/day:ring-ring/50 disco:data-[range-end=true]:rounded-(--cell-radius) disco:data-[range-end=true]:rounded-r-(--cell-radius) disco:data-[range-end=true]:bg-primary disco:data-[range-end=true]:text-primary-foreground disco:data-[range-middle=true]:rounded-none disco:data-[range-middle=true]:bg-muted disco:data-[range-middle=true]:text-foreground disco:data-[range-start=true]:rounded-(--cell-radius) disco:data-[range-start=true]:rounded-l-(--cell-radius) disco:data-[range-start=true]:bg-primary disco:data-[range-start=true]:text-primary-foreground disco:data-[selected-single=true]:bg-primary disco:data-[selected-single=true]:text-primary-foreground disco:dark:hover:text-foreground disco:[&>span]:text-xs disco:[&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props} />
  );
}

export { Calendar, CalendarDayButton }
