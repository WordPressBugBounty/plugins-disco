import {
	cn,
	fmt,
	formatDate,
	formatTooltipDate,
	formatXAxisDate,
} from '../../lib/utils';

beforeAll(() => {
	global.DISCO = { ...global.DISCO, base_currency: '$' };
});

describe('Utility functions', () => {
	describe('cn', () => {
		it('merges class names', () => {
			const result = cn('foo', 'bar');
			expect(result).toContain('foo');
			expect(result).toContain('bar');
		});

		it('handles conditional classes', () => {
			const result = cn('base', false && 'hidden', 'visible');
			expect(result).toContain('base');
			expect(result).toContain('visible');
			expect(result).not.toContain('hidden');
		});

		it('handles undefined and null', () => {
			const result = cn('base', undefined, null);
			expect(result).toBe('base');
		});
	});

	describe('fmt', () => {
		it('formats a number as USD currency', () => {
			expect(fmt(1234.5)).toBe('$1,234.50');
		});

		it('formats zero', () => {
			expect(fmt(0)).toBe('$0.00');
		});

		it('formats large numbers with commas', () => {
			expect(fmt(1000000)).toBe('$1,000,000.00');
		});

		it('formats decimals to 2 places', () => {
			expect(fmt(99.999)).toBe('$100.00');
		});

		it('handles string numbers', () => {
			expect(fmt('250.5')).toBe('$250.50');
		});
	});

	describe('formatDate', () => {
		it('formats a date string to locale format', () => {
			const result = formatDate('2025-05-15');
			expect(result).toMatch(/May\s+15,\s+2025/);
		});

		it('returns dash for null/undefined', () => {
			expect(formatDate(null)).toBe('—');
			expect(formatDate(undefined)).toBe('—');
			expect(formatDate('')).toBe('—');
		});
	});

	describe('formatTooltipDate', () => {
		it('formats a day interval date', () => {
			const result = formatTooltipDate('2025-05-15', 'day');
			expect(result).toMatch(/May\s+15,\s+2025/);
		});

		it('formats a week interval with range', () => {
			const result = formatTooltipDate('2025-05-12', 'week');
			// Should show May 12 - May 18 (7 day range)
			expect(result).toContain('-');
			expect(result).toMatch(/May\s+12/);
			expect(result).toMatch(/May\s+18/);
		});

		it('formats a month interval with full month range', () => {
			const result = formatTooltipDate('2025-05-01', 'month');
			expect(result).toContain('-');
			expect(result).toMatch(/May\s+1/);
			expect(result).toMatch(/May\s+31/);
		});
	});

	describe('formatXAxisDate', () => {
		it('formats short range date with month and day', () => {
			const result = formatXAxisDate('2025-05-15', false);
			expect(result).toMatch(/May\s+15/);
		});

		it('formats long range date with month and year', () => {
			const result = formatXAxisDate('2025-05-15', true);
			expect(result).toMatch(/May\s+25/);
		});
	});

	describe('Edge cases', () => {
		it('fmt handles NaN gracefully', () => {
			const result = fmt(NaN);
			expect(result).toBe('$NaN');
		});

		it('fmt handles undefined', () => {
			const result = fmt(undefined);
			expect(result).toBe('$NaN');
		});

		it('fmt handles null', () => {
			const result = fmt(null);
			expect(result).toBe('$0.00');
		});

		it('fmt handles negative numbers', () => {
			const result = fmt(-500.5);
			expect(result).toMatch(/-?\$?500\.50/);
		});

		it('fmt handles very large numbers', () => {
			const result = fmt(99999999.99);
			expect(result).toBe('$99,999,999.99');
		});
	});
});
