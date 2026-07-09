import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Products from '../../pages/Products';
import { createMockProductsList, renderWithProviders } from '../setup/helpers';

jest.mock('../../features/products/productsApi', () => ({
	useGetProductsQuery: jest.fn(),
}));

const { useGetProductsQuery } = require('../../features/products/productsApi');

const mockData = createMockProductsList(3);

describe('Products', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	function setupLoaded(data = mockData) {
		useGetProductsQuery.mockReturnValue({
			data,
			isLoading: false,
			isFetching: false,
		});
	}

	describe('Rendering', () => {
		it('renders page heading and subtitle', () => {
			setupLoaded();
			renderWithProviders(<Products />);

			expect(screen.getByText('Products')).toBeInTheDocument();
			expect(
				screen.getByText('Revenue and discount performance by product')
			).toBeInTheDocument();
		});

		it('renders product names', () => {
			setupLoaded();
			renderWithProviders(<Products />);

			expect(screen.getByText('Product 1')).toBeInTheDocument();
			expect(screen.getByText('Product 2')).toBeInTheDocument();
		});

		it('renders table headers', () => {
			setupLoaded();
			renderWithProviders(<Products />);

			expect(screen.getByText('Product')).toBeInTheDocument();
			expect(screen.getByText('Category')).toBeInTheDocument();
			expect(screen.getByText('Campaigns')).toBeInTheDocument();
		});
	});

	describe('Loading states', () => {
		it('shows skeletons when loading', () => {
			useGetProductsQuery.mockReturnValue({
				data: undefined,
				isLoading: true,
				isFetching: true,
			});
			const { container } = renderWithProviders(<Products />);

			const pulseElements = container.querySelectorAll(
				'.disco-animate-pulse'
			);
			expect(pulseElements.length).toBeGreaterThan(0);
		});
	});

	describe('Empty states', () => {
		it('shows empty state when no products', () => {
			useGetProductsQuery.mockReturnValue({
				data: {
					data: [],
					collection: { count: 0, total: 0, total_pages: 1 },
				},
				isLoading: false,
				isFetching: false,
			});
			renderWithProviders(<Products />);

			expect(screen.getByText('Products Not Found!')).toBeInTheDocument();
		});
	});

	describe('Pagination', () => {
		it('renders pagination and handles page change', () => {
			useGetProductsQuery.mockReturnValue({
				data: {
					...mockData,
					collection: { count: 20, total: 60, total_pages: 3 },
				},
				isLoading: false,
				isFetching: false,
			});
			renderWithProviders(<Products />);

			expect(screen.getByText('Showing 1 of 3')).toBeInTheDocument();

			// Click page 2
			fireEvent.click(screen.getByText('2'));

			// Hook should be called with page 2
			const lastCall = useGetProductsQuery.mock.calls.at(-1)[0];
			expect(lastCall.page).toBe(2);
		});
	});

	describe('Search', () => {
		it('resets page to 1 when searching', async () => {
			useGetProductsQuery.mockReturnValue({
				data: {
					...mockData,
					collection: { count: 3, total: 3, total_pages: 1 },
				},
				isLoading: false,
				isFetching: false,
			});
			const user = userEvent.setup();
			renderWithProviders(<Products />);

			const searchInput =
				screen.getByPlaceholderText('Search products...');
			await user.type(searchInput, 'widget');

			const lastCall = useGetProductsQuery.mock.calls.at(-1)[0];
			expect(lastCall.page).toBe(1);
			expect(lastCall.search).toBe('widget');
		});
	});

	describe('Sorting', () => {
		it('toggles sort direction on same column', () => {
			setupLoaded();
			renderWithProviders(<Products />);

			// Revenue column header (th element)
			const revenueHeader = screen
				.getAllByText(/Net Sale/)
				.find((el) => el.tagName === 'TH');
			fireEvent.click(revenueHeader);
			const lastCall = useGetProductsQuery.mock.calls.at(-1)[0];
			expect(lastCall.order).toBe('asc');
		});

		it('resets page to 1 when sorting', () => {
			setupLoaded();
			renderWithProviders(<Products />);

			const ordersHeader = screen
				.getAllByText(/Orders/)
				.find((el) => el.tagName === 'TH');
			fireEvent.click(ordersHeader);
			const lastCall = useGetProductsQuery.mock.calls.at(-1)[0];
			expect(lastCall.page).toBe(1);
		});
	});
});
