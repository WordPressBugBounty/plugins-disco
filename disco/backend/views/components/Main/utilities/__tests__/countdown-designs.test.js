/**
 * Tests for countdown-designs configuration
 */
import {
	countdownDesigns,
	DEFAULT_COUNTDOWN_DESIGN,
} from '../count-down';

describe('countdown-designs', () => {
	describe('DEFAULT_COUNTDOWN_DESIGN', () => {
		it('should be defined', () => {
			expect(DEFAULT_COUNTDOWN_DESIGN).toBeDefined();
		});

		it('should be a valid design key', () => {
			expect(countdownDesigns[DEFAULT_COUNTDOWN_DESIGN]).toBeDefined();
		});

		it('should be design4', () => {
			expect(DEFAULT_COUNTDOWN_DESIGN).toBe('design4');
		});
	});

	describe('countdownDesigns', () => {
		it('should have 4 designs', () => {
			expect(Object.keys(countdownDesigns)).toHaveLength(4);
		});

		it('should have design1, design2, design3, design4', () => {
			expect(countdownDesigns.design1).toBeDefined();
			expect(countdownDesigns.design2).toBeDefined();
			expect(countdownDesigns.design3).toBeDefined();
			expect(countdownDesigns.design4).toBeDefined();
		});

		describe('design structure', () => {
			Object.entries(countdownDesigns).forEach(([designKey, design]) => {
				describe(`${designKey}`, () => {
					it('should have an id', () => {
						expect(design.id).toBe(designKey);
					});

					it('should have a name', () => {
						expect(design.name).toBeDefined();
						expect(typeof design.name).toBe('string');
					});

					it('should have hasSeparator boolean', () => {
						expect(typeof design.hasSeparator).toBe('boolean');
					});

					it('should have singleContainer boolean', () => {
						expect(typeof design.singleContainer).toBe('boolean');
					});

					it('should have container styles', () => {
						expect(design.container).toBeDefined();
						expect(design.container.background).toBeDefined();
						expect(design.container.padding).toBeDefined();
						expect(design.container['max-width']).toBe('370px');
					});

					it('should have title styles with text', () => {
						expect(design.title).toBeDefined();
						expect(design.title.text).toBeDefined();
						expect(design.title.color).toBeDefined();
						expect(design.title['font-size']).toBeDefined();
					});

					it('should have subtitle styles with text', () => {
						expect(design.subtitle).toBeDefined();
						expect(design.subtitle.text).toBeDefined();
						expect(design.subtitle.color).toBeDefined();
					});

					it('should have box_container styles', () => {
						expect(design.box_container).toBeDefined();
						expect(design.box_container.display).toBe('flex');
					});

					it('should have box styles', () => {
						expect(design.box).toBeDefined();
						expect(design.box.background).toBeDefined();
						expect(design.box['min-width']).toBeDefined();
					});

					it('should have number styles', () => {
						expect(design.number).toBeDefined();
						expect(design.number.color).toBeDefined();
						expect(design.number['font-size']).toBeDefined();
						expect(design.number['font-weight']).toBeDefined();
					});

					it('should have label styles', () => {
						expect(design.label).toBeDefined();
						expect(design.label.color).toBeDefined();
						expect(design.label['font-size']).toBeDefined();
					});

					it('should have separator styles', () => {
						expect(design.separator).toBeDefined();
						expect(design.separator.color).toBeDefined();
						expect(design.separator['font-size']).toBeDefined();
					});
				});
			});
		});

		describe('design4 (default)', () => {
			const design = countdownDesigns.design4;

			it('should be marked as default', () => {
				expect(design.isDefault).toBe(true);
			});

			it('should not have separator', () => {
				expect(design.hasSeparator).toBe(false);
			});

			it('should not be single container', () => {
				expect(design.singleContainer).toBe(false);
			});

			it('should have gradient background', () => {
				expect(design.container.background).toContain('linear-gradient');
			});
		});

		describe('design1', () => {
			const design = countdownDesigns.design1;

			it('should not be default', () => {
				expect(design.isDefault).toBe(false);
			});

			it('should be single container', () => {
				expect(design.singleContainer).toBe(true);
			});

			it('should not have separator', () => {
				expect(design.hasSeparator).toBe(false);
			});
		});

		describe('design2', () => {
			const design = countdownDesigns.design2;

			it('should not be default', () => {
				expect(design.isDefault).toBe(false);
			});

			it('should not be single container', () => {
				expect(design.singleContainer).toBe(false);
			});

			it('should have border', () => {
				expect(design.container.border).toBe(1);
			});
		});

		describe('design3', () => {
			const design = countdownDesigns.design3;

			it('should not be default', () => {
				expect(design.isDefault).toBe(false);
			});

			it('should have separator', () => {
				expect(design.hasSeparator).toBe(true);
			});

			it('should not be single container', () => {
				expect(design.singleContainer).toBe(false);
			});
		});
	});

	describe('color consistency', () => {
		Object.entries(countdownDesigns).forEach(([designKey, design]) => {
			it(`${designKey} should have valid color values`, () => {
				expect(design.title.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
				expect(design.subtitle.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
				expect(design.number.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
				expect(design.label.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
				expect(design.separator.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
			});
		});
	});

	describe('font sizes', () => {
		Object.entries(countdownDesigns).forEach(([designKey, design]) => {
			it(`${designKey} should have valid font size values`, () => {
				expect(design.title['font-size']).toMatch(/^\d+px$/);
				expect(design.subtitle['font-size']).toMatch(/^\d+px$/);
				expect(design.number['font-size']).toMatch(/^\d+px$/);
				expect(design.label['font-size']).toMatch(/^\d+px$/);
				expect(design.separator['font-size']).toMatch(/^\d+px$/);
			});
		});
	});
});
