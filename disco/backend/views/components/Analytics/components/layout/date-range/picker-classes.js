const PICKER_CLASSES = {
	root: 'disco-p-0',
	months: 'disco-flex disco-flex-col',
	month: 'disco-flex disco-flex-col disco-gap-1',
	month_caption:
		'disco-relative disco-flex disco-h-7 disco-items-center disco-justify-center',
	caption_label:
		'disco-text-[11px] disco-font-semibold disco-text-[rgba(74,74,74,0.85)] disco-select-none',
	nav: 'disco-absolute disco-inset-x-0 disco-top-0 disco-flex disco-items-center disco-justify-between',
	button_previous:
		'disco-flex disco-h-8 disco-w-8 disco-items-center disco-justify-center disco-rounded disco-text-[rgba(74,74,74,0.4)] disco-transition-colors hover:disco-text-[rgba(74,74,74,0.8)] disabled:disco-opacity-30 disco-z-10',
	button_next:
		'disco-flex disco-h-8 disco-w-8 disco-items-center disco-justify-center disco-rounded disco-text-[rgba(74,74,74,0.4)] disco-transition-colors hover:disco-text-[rgba(74,74,74,0.8)] disabled:disco-opacity-30 disco-z-10',
	weekdays: 'disco-flex',
	// explicit w/h so table columns don't auto-size wider than CELL
	weekday:
		'disco-flex disco-h-[26px] disco-w-[26px] disco-items-center disco-justify-center disco-select-none disco-text-[9px] disco-font-medium disco-text-[rgba(74,74,74,0.4)]',
	weeks: 'disco-flex disco-flex-col',
	week: 'disco-flex',
	// td — explicit size keeps table columns at exactly CELL px
	day: 'disco-flex disco-h-[26px] disco-w-[26px] disco-items-center disco-justify-center disco-p-0',
	range_start: 'disco-rounded-l-full disco-bg-[rgba(8,200,137,0.12)]',
	range_end: 'disco-rounded-r-full disco-bg-[rgba(8,200,137,0.12)]',
	range_middle: 'disco-rounded-none disco-bg-[rgba(8,200,137,0.12)]',
	today: '',
	outside: '',
	disabled: 'disco-opacity-30 disco-pointer-events-none',
	hidden: 'disco-invisible',
	selected: '',
};

export default PICKER_CLASSES;
