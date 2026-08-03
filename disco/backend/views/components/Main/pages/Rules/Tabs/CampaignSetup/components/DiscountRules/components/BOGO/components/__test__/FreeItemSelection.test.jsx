import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import '@wordpress/jest-console';
import { renderWithProviders } from '../../../../../../../../../../utilities/utils-for-tests';
import FreeItemSelection from '../FreeItemSelection';

describe('FreeItemSelection', () => {
	afterAll(() => {
		jest.clearAllMocks();
	});

	describe('Render Correctly', () => {
		test('Shows label and dropdown with the default selection', () => {
			renderWithProviders(<FreeItemSelection />);

			expect(screen.getByText('Free Item Selection')).toBeInTheDocument();
			expect(screen.getByRole('button')).toHaveTextContent(
				'Cart order (default)'
			);
		});

		test('Defaults to the "cart_order" example', () => {
			renderWithProviders(<FreeItemSelection />);
			expect(
				screen.getByText(/pair \(added first\) is granted/)
			).toBeInTheDocument();
		});
	});

	describe('Interact Correctly', () => {
		test('Selecting "lowest" updates the store and example', async () => {
			const { store } = renderWithProviders(<FreeItemSelection />);

			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(screen.getByText('Lowest priced item'));

			expect(store.getState().discount.free_item_selection).toBe(
				'lowest'
			);
			expect(
				screen.getByText(/protecting margin/)
			).toBeInTheDocument();
		});

		test('Selecting "highest" updates the store and example', async () => {
			const { store } = renderWithProviders(<FreeItemSelection />);

			await userEvent.click(screen.getByRole('button'));
			await userEvent.click(screen.getByText('Highest priced item'));

			expect(store.getState().discount.free_item_selection).toBe(
				'highest'
			);
			expect(
				screen.getByText(/maximizing perceived reward value/)
			).toBeInTheDocument();
		});
	});
});
