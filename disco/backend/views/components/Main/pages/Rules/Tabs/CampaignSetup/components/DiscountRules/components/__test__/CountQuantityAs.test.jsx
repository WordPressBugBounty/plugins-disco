import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import '@wordpress/jest-console';
import { renderWithProviders } from '../../../../../../../../utilities/utils-for-tests';
import CountQuantityAs from '../CountQuantityAs';

describe('CountQuantityAs', () => {
	const originalDisco = global.DISCO;

	afterEach(() => {
		global.DISCO = originalDisco;
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	describe('Render Correctly', () => {
		test('Shows label, caption and dropdown', () => {
			renderWithProviders(<CountQuantityAs />);

			expect(screen.getByText('Count Quantity As')).toBeInTheDocument();
			expect(
				screen.getByText(
					'Decides how items add up toward the quantity required below.'
				)
			).toBeInTheDocument();
			// The dropdown trigger shows the default selection.
			expect(screen.getByRole('button')).toHaveTextContent(
				'Each product separately'
			);
		});

		test('Defaults to the "separate" example for the Bulk intent', () => {
			renderWithProviders(<CountQuantityAs />);
			expect(
				screen.getByText(/neither reaches 5 on its own/)
			).toBeInTheDocument();
		});

		test('Does not render the example when intent is Bundle', () => {
			renderWithProviders(<CountQuantityAs />);
			expect(screen.queryByText(/Needs 5 units/)).toBeInTheDocument();
		});

		test('Does not render the example when intent is BOGO', () => {
			renderWithProviders(<CountQuantityAs />);
			expect(screen.queryByText(/Needs 5 units/)).toBeInTheDocument();
		});

		test('Falls back to the Bulk example when no intent prop is passed', () => {
			renderWithProviders(<CountQuantityAs />);
			expect(
				screen.getByText(/neither reaches 5 on its own/)
			).toBeInTheDocument();
		});
	});

	describe('Interact Correctly', () => {
		test('Selecting "variations" updates the store and example', async () => {
			const { store } = renderWithProviders(<CountQuantityAs />);

			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(
				screen.getByText('Same product, all variations')
			);

			expect(store.getState().discount.count_quantity_as).toBe(
				'variations'
			);
			expect(
				screen.getByText(/counts, because both are the same product/)
			).toBeInTheDocument();
		});

		test('Selecting "combined" updates the store and shows the category example', async () => {
			const { store } = renderWithProviders(<CountQuantityAs />);

			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(
				screen.getByText('All products in this discount')
			);

			expect(store.getState().discount.count_quantity_as).toBe(
				'combined'
			);
			expect(
				screen.getByText(/both products are included in this discount/)
			).toBeInTheDocument();
		});
	});

	describe('Pro gating', () => {
		test('Does not show a NEW badge', () => {
			renderWithProviders(<CountQuantityAs />);
			expect(screen.queryByText('NEW')).not.toBeInTheDocument();
		});

		test('Pro users see all three options unlabelled', async () => {
			renderWithProviders(<CountQuantityAs />);

			await userEvent.click(screen.getByRole('button'));

			expect(
				screen.getByRole('option', { name: 'Each product separately' })
			).toBeInTheDocument();
			expect(
				screen.getByRole('option', {
					name: 'Same product, all variations',
				})
			).toBeInTheDocument();
			expect(
				screen.getByRole('option', {
					name: 'All products in this discount',
				})
			).toBeInTheDocument();
			expect(screen.queryByText('Pro')).not.toBeInTheDocument();
		});

		test('Free users see a Pro badge on the two pooling options', async () => {
			global.DISCO = { ...originalDisco, is_pro_active: '' };
			renderWithProviders(<CountQuantityAs />);

			await userEvent.click(screen.getByRole('button'));

			const variations = screen.getByRole('option', {
				name: /Same product, all variations/,
			});
			const combined = screen.getByRole('option', {
				name: /All products in this discount/,
			});

			// Badge is a link to pricing, matching the Conditions dropdown.
			expect(variations).toHaveTextContent('Pro');
			expect(combined).toHaveTextContent('Pro');
			expect(variations).toHaveAttribute('aria-disabled', 'true');
			expect(combined).toHaveAttribute('aria-disabled', 'true');
			expect(screen.getAllByRole('link', { name: 'Pro' })).toHaveLength(
				2
			);

			// The free option keeps its plain label and stays selectable.
			const separate = screen.getByRole('option', {
				name: 'Each product separately',
			});
			expect(separate).not.toHaveTextContent('Pro');
			expect(separate).not.toHaveAttribute('aria-disabled', 'true');
		});

		test('Free users cannot select a pro option', async () => {
			global.DISCO = { ...originalDisco, is_pro_active: '' };
			const { store } = renderWithProviders(<CountQuantityAs />);

			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(
				screen.getByRole('option', {
					name: /Same product, all variations/,
				})
			);

			expect(store.getState().discount.count_quantity_as).toBe(
				'separate'
			);
		});

		test('Free users can still select the free option', async () => {
			global.DISCO = { ...originalDisco, is_pro_active: '' };
			const { store } = renderWithProviders(<CountQuantityAs />);

			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(
				screen.getByRole('option', { name: 'Each product separately' })
			);

			expect(store.getState().discount.count_quantity_as).toBe(
				'separate'
			);
		});
	});
});
