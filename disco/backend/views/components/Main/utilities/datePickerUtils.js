import { format, formatISO, isValid, parseISO } from 'date-fns';

/**
 * Parses a date value from a string or Date object.
 * Returns null if the value is falsy or results in an invalid date.
 *
 * @param {string | Date | null | undefined} value - ISO string or Date object to parse
 * @returns {Date | null} Parsed Date object, or null if invalid
 */
export function parseDate(value) {
	if (!value) return null;
	const date = typeof value === 'string' ? parseISO(value) : new Date(value);
	return isValid(date) ? date : null;
}

/**
 * Formats a date value for display in the trigger button.
 * Uses the format: "dd/MM/yyyy, hh:mm AM/PM" (e.g. "04/06/2026, 02:30 PM").
 *
 * @param {string | Date | null | undefined} value - ISO string or Date object to format
 * @returns {string} Formatted date string, or empty string if invalid
 */
export function formatDisplay(value) {
	const date = parseDate(value);
	if (!date) return '';
	return format(date, 'dd/MM/yyyy, hh:mm aa');
}

/**
 * Extracts 12-hour time parts from a date value.
 * Defaults to current time if the value is empty or invalid.
 *
 * @param {string | Date | null | undefined} value - ISO string or Date object
 * @returns {{ hour: number, minute: number, period: 'AM' | 'PM' }}
 */
export function get12HourParts(value) {
	const date = parseDate(value) || new Date();
	let h = date.getHours();
	const m = date.getMinutes();
	const period = h >= 12 ? 'PM' : 'AM';
	h = h % 12 || 12;
	return { hour: h, minute: m, period };
}

/**
 * Converts a 12-hour format hour and period to 24-hour format.
 *
 * @param {number} hour - Hour in 12-hour format (1-12)
 * @param {'AM' | 'PM'} period - AM or PM
 * @returns {number} Hour in 24-hour format (0-23)
 */
export function to24Hour(hour, period) {
	if (period === 'AM') return hour === 12 ? 0 : hour;
	return hour === 12 ? 12 : hour + 12;
}

/**
 * Builds an ISO 8601 date string from a day, 12-hour time parts.
 * Falls back to the current date/time if day is falsy.
 *
 * @param {Date | null} day - The date to use
 * @param {number} hour - Hour in 12-hour format (1-12)
 * @param {number} minute - Minute (0-59)
 * @param {'AM' | 'PM'} period - AM or PM
 * @returns {string} ISO 8601 formatted date string
 */
export function buildDate(day, hour, minute, period) {
	const date = new Date(day || new Date());
	date.setHours(to24Hour(hour, period), minute, 0, 0);
	return formatISO(date);
}
