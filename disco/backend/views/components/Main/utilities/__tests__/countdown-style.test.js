/**
 * Tests for countdown-style utility functions
 */
import {
	toStyleObject,
	getContainerStyle,
	getBoxStyle,
	replaceVariables,
	calculateTimeLeft,
	getTimeUnits,
	buildDefaultCountdownState,
} from '../countdown-style';

describe('countdown-style utilities', () => {
	describe('toStyleObject', () => {
		it('should convert kebab-case to camelCase', () => {
			const input = {
				'font-size': '14px',
				'font-weight': 600,
				'text-align': 'center',
			};
			const result = toStyleObject(input);
			expect(result).toEqual({
				fontSize: '14px',
				fontWeight: 600,
				textAlign: 'center',
			});
		});

		it('should skip specified keys like text, isChain, radius', () => {
			const input = {
				text: 'Hello',
				isChain: true,
				radius: { 'top-left': '6px' },
				color: '#FFFFFF',
			};
			const result = toStyleObject(input);
			expect(result).toEqual({ color: '#FFFFFF' });
			expect(result.text).toBeUndefined();
			expect(result.isChain).toBeUndefined();
			expect(result.radius).toBeUndefined();
		});

		it('should return empty object for null/undefined input', () => {
			expect(toStyleObject(null)).toEqual({});
			expect(toStyleObject(undefined)).toEqual({});
		});
	});

	describe('getContainerStyle', () => {
		it('should apply border radius from radius object', () => {
			const container = {
				background: '#FF0000',
				radius: {
					'top-left': '6px',
					'top-right': '6px',
					'bottom-right': '6px',
					'bottom-left': '6px',
				},
				border: 0,
				'border-color': 'rgba(0, 0, 0, 0)',
			};
			const result = getContainerStyle(container);
			expect(result.borderRadius).toBe('6px 6px 6px 6px');
		});

		it('should apply border styles', () => {
			const container = {
				border: 2,
				'border-color': '#000000',
			};
			const result = getContainerStyle(container);
			expect(result.borderWidth).toBe('2px');
			expect(result.borderStyle).toBe('solid');
			expect(result.borderColor).toBe('#000000');
		});

		it('should return empty object for null input', () => {
			expect(getContainerStyle(null)).toEqual({});
		});
	});

	describe('getBoxStyle', () => {
		it('should apply box styles with border radius', () => {
			const box = {
				background: '#FFFFFF',
				padding: '8px 12px',
				radius: {
					'top-left': '2px',
					'top-right': '2px',
					'bottom-right': '2px',
					'bottom-left': '2px',
				},
				border: 1,
				'border-color': '#CCCCCC',
			};
			const result = getBoxStyle(box);
			expect(result.background).toBe('#FFFFFF');
			expect(result.padding).toBe('8px 12px');
			expect(result.borderRadius).toBe('2px 2px 2px 2px');
			expect(result.borderWidth).toBe('1px');
		});

		it('should return empty object for null input', () => {
			expect(getBoxStyle(null)).toEqual({});
		});
	});

	describe('replaceVariables', () => {
		it('should replace [discounted_percentage] with sample value', () => {
			const text = 'Save [discounted_percentage] today!';
			expect(replaceVariables(text)).toBe('Save 20% today!');
		});

		it('should replace [discount_amount] with sample value', () => {
			const text = 'You save [discount_amount]';
			expect(replaceVariables(text)).toBe('You save $50');
		});

		it('should replace [remaining_quantity] with sample value', () => {
			const text = 'Only [remaining_quantity] left!';
			expect(replaceVariables(text)).toBe('Only 2 left!');
		});

		it('should replace [remaining_amount] with sample value', () => {
			const text = 'Add [remaining_amount] more';
			expect(replaceVariables(text)).toBe('Add $25 more');
		});

		it('should replace multiple variables', () => {
			const text = '[discounted_percentage] OFF - Save [discount_amount]!';
			expect(replaceVariables(text)).toBe('20% OFF - Save $50!');
		});

		it('should return empty string for null/undefined', () => {
			expect(replaceVariables(null)).toBe('');
			expect(replaceVariables(undefined)).toBe('');
		});
	});

	describe('calculateTimeLeft', () => {
		it('should return default values for past date', () => {
			const pastDate = '2020-01-01T00:00:00';
			const result = calculateTimeLeft(pastDate);
			expect(result).toEqual({
				days: '02',
				hours: '08',
				minutes: '15',
				seconds: '05',
			});
		});

		it('should calculate time left for future date', () => {
			// Set a date 1 day, 2 hours, 30 minutes, 45 seconds in the future
			const now = new Date();
			const futureDate = new Date(
				now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000
			);
			const result = calculateTimeLeft(futureDate.toISOString());

			expect(result.days).toBe('01');
			expect(result.hours).toBe('02');
			expect(result.minutes).toBe('30');
			// Seconds might vary slightly due to execution time
			expect(parseInt(result.seconds)).toBeGreaterThanOrEqual(44);
			expect(parseInt(result.seconds)).toBeLessThanOrEqual(46);
		});

		it('should pad single digit values with zero', () => {
			const now = new Date();
			const futureDate = new Date(now.getTime() + 5 * 1000); // 5 seconds from now
			const result = calculateTimeLeft(futureDate.toISOString());

			expect(result.days).toBe('00');
			expect(result.hours).toBe('00');
			expect(result.minutes).toBe('00');
		});
	});

	describe('getTimeUnits', () => {
		it('should return array of time units', () => {
			const timeLeft = {
				days: '02',
				hours: '12',
				minutes: '30',
				seconds: '45',
			};
			const result = getTimeUnits(timeLeft);

			expect(result).toHaveLength(4);
			expect(result[0]).toEqual({ value: '02', label: 'DAYS' });
			expect(result[1]).toEqual({ value: '12', label: 'HOURS' });
			expect(result[2]).toEqual({ value: '30', label: 'MINUTES' });
			expect(result[3]).toEqual({ value: '45', label: 'SECONDS' });
		});
	});

	describe('buildDefaultCountdownState', () => {
		const mockDesign = {
			id: 'design1',
			hasSeparator: true,
			singleContainer: false,
			title: {
				text: 'Test Title',
				'font-family': 'Arial',
				'font-size': '14px',
				'font-weight': 600,
				'font-style': 'normal',
				color: '#FFFFFF',
			},
			subtitle: {
				text: 'Test Subtitle',
				'font-family': 'Arial',
				'font-size': '12px',
				'font-weight': 400,
				'font-style': 'normal',
				color: '#CCCCCC',
			},
			container: {
				background: '#FF0000',
				'border-radius': '6px',
				padding: '12px 16px',
				border: 0,
				'border-color': 'rgba(0, 0, 0, 0)',
			},
			box: {
				background: '#FFFFFF',
				'border-radius': '2px',
				padding: '8px 12px',
				'min-width': '60px',
			},
			number: {
				'font-family': 'Arial',
				'font-size': '20px',
				'font-weight': 700,
				color: '#FF0000',
			},
			label: {
				'font-family': 'Arial',
				'font-size': '9px',
				'font-weight': 400,
				color: '#333333',
			},
			separator: {
				color: '#FFFFFF',
				'font-size': '20px',
				'font-weight': 700,
			},
		};

		it('should build default state from design', () => {
			const result = buildDefaultCountdownState(mockDesign);

			expect(result.selected_design).toBe('design1');
			expect(result.hasSeparator).toBe(true);
			expect(result.singleContainer).toBe(false);
		});

		it('should include title properties', () => {
			const result = buildDefaultCountdownState(mockDesign);

			expect(result.title.text).toBe('Test Title');
			expect(result.title.color).toBe('#FFFFFF');
			expect(result.title['font-size']).toBe('14px');
		});

		it('should include container properties', () => {
			const result = buildDefaultCountdownState(mockDesign);

			expect(result.container.background).toBe('#FF0000');
			expect(result.container.padding).toBe('12px 16px');
		});

		it('should include box properties with min-width', () => {
			const result = buildDefaultCountdownState(mockDesign);

			expect(result.box.background).toBe('#FFFFFF');
			expect(result.box['min-width']).toBe('60px');
		});

		it('should include separator properties', () => {
			const result = buildDefaultCountdownState(mockDesign);

			expect(result.separator.color).toBe('#FFFFFF');
			expect(result.separator['font-size']).toBe('20px');
		});
	});
});
