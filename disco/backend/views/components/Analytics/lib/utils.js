import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

/**
 *
 * @param {number} n
 * @returns {string}
 */
export function fmt(n) {
	const currencySymbol = DISCO.base_currency;
	return (
		currencySymbol +
		Number(n).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
	);
}

/**
 *
 * @param {string} d
 * @returns {String} Local date string
 */
export function formatDate(d) {
	if (!d) return '—';
	return new Date(d).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

/**
 *
 * @param {String} dateStr date string
 * @param {string} interval interval string format
 * @returns {string} local date string
 */
export function formatTooltipDate(dateStr, interval) {
	const start = new Date(dateStr + 'T00:00:00');
	const fmt = { month: 'short', day: 'numeric', year: 'numeric' };

	if (interval === 'week') {
		const end = new Date(start);
		end.setDate(end.getDate() + 6);
		return `${start.toLocaleDateString('en-US', fmt)} - ${end.toLocaleDateString('en-US', fmt)}`;
	}

	if (interval === 'month') {
		const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
		return `${start.toLocaleDateString('en-US', fmt)} - ${end.toLocaleDateString('en-US', fmt)}`;
	}

	return start.toLocaleDateString('en-US', fmt);
}

/**
 *
 * @param {String} dateStr Date
 * @param {boolean} isLongRange
 * @returns {String} Date string
 */
export function formatXAxisDate(dateStr, isLongRange) {
	const date = new Date(dateStr + 'T00:00:00');
	if (isLongRange) {
		const month = date.toLocaleDateString('en-US', { month: 'short' });
		const year = String(date.getFullYear()).slice(-2);
		return `${month} ${year}`;
	}
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * To truncate text and add an ellipsis
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength) {
	if (str.length > maxLength) {
		return str.slice(0, maxLength) + '...';
	}
	return str;
}

/**
 * - Sort unknown campaigns
 * @param {Array} campaigns
 * @returns {Array}
 */
export function campaignsSort(campaigns) {
	return campaigns.sort((a, b) => {
		if (a?.name === 'Unknown') return 1;
		if (b?.name === 'Unknown') return -1;
		return 0;
	});
}
