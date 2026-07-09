import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Orders from '../../pages/Orders';
import { createMockOrdersList, renderWithProviders } from '../setup/helpers';

jest.mock('../../features/orders/ordersApi', () => ({
	useGetOrdersQuery: jest.fn(),
}));

const { useGetOrdersQuery } = require('../../features/orders/ordersApi');

const mockData = createMockOrdersList(3);

describe('Orders', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	function setupLoaded(data = mockData) {
		useGetOrdersQuery.mockReturnValue({
			data,
			isLoading: false,
			isFetching: false,
		});
	}

	describe('Rendering', () => {
		it('renders page heading and subtitle', () => {
			setupLoaded();
			renderWithProviders(<Orders />);

			expect(screen.getByText('Orders')).toBeInTheDocument();
			expect(
				screen.getByText('Orders influenced by Disco campaigns')
			).toBeInTheDocument();
		});

		it('renders order IDs with # prefix', () => {
			setupLoaded();
			renderWithProviders(<Orders />);

			expect(screen.getByText('#101')).toBeInTheDocument();
			expect(screen.getByText('#102')).toBeInTheDocument();
		});

		it('renders customer names', () => {
			setupLoaded();
			renderWithProviders(<Orders />);

			expect(screen.getByText('Customer 1')).toBeInTheDocument();
		});

		it('renders table headers', () => {
			setupLoaded();
			renderWithProviders(<Orders />);

			expect(screen.getByText('Order')).toBeInTheDocument();
			expect(screen.getByText('Customer')).toBeInTheDocument();
			expect(screen.getByText('Campaign')).toBeInTheDocument();
			expect(screen.getByText(/Products/)).toBeInTheDocument();
			expect(screen.getByText(/Total Spent/)).toBeInTheDocument();
			expect(screen.getByText(/Date/)).toBeInTheDocument();
		});
	});

	describe('Loading states', () => {
		it('shows skeletons when loading', () => {
			useGetOrdersQuery.mockReturnValue({
				data: undefined,
				isLoading: true,
				isFetching: true,
			});
			const { container } = renderWithProviders(<Orders />);

			const pulseElements = container.querySelectorAll(
				'.disco-animate-pulse'
			);
			expect(pulseElements.length).toBeGreaterThan(0);
		});
	});

	describe('Empty states', () => {
		it('shows empty state when no orders', () => {
			useGetOrdersQuery.mockReturnValue({
				data: {
					data: [],
					collection: { count: 0, total: 0, total_pages: 1 },
				},
				isLoading: false,
				isFetching: false,
			});
			renderWithProviders(<Orders />);

			expect(screen.getByText('Orders Not Found!')).toBeInTheDocument();
		});
	});

	describe('Sorting', () => {
		it('default sort is by date descending', () => {
			setupLoaded();
			renderWithProviders(<Orders />);

			const firstCall = useGetOrdersQuery.mock.calls[0][0];
			expect(firstCall.sort_by).toBe('date');
			expect(firstCall.order).toBe('desc');
		});

		it('toggles sort direction', () => {
			setupLoaded();
			renderWithProviders(<Orders />);

			fireEvent.click(screen.getByText(/Date/));
			const lastCall = useGetOrdersQuery.mock.calls.at(-1)[0];
			expect(lastCall.order).toBe('asc');
		});
	});

	describe('Search', () => {
		it('calls hook with search param', async () => {
			setupLoaded();
			const user = userEvent.setup();
			renderWithProviders(<Orders />);

			const searchInput = screen.getByPlaceholderText('Search orders...');
			await user.type(searchInput, '101');

			const lastCall = useGetOrdersQuery.mock.calls.at(-1)[0];
			expect(lastCall.search).toBe('101');
		});
	});

	describe('Pagination', () => {
		it('handles page navigation', () => {
			useGetOrdersQuery.mockReturnValue({
				data: {
					...mockData,
					collection: { count: 20, total: 40, total_pages: 2 },
				},
				isLoading: false,
				isFetching: false,
			});
			renderWithProviders(<Orders />);

			expect(screen.getByText('Showing 1 of 2')).toBeInTheDocument();

			fireEvent.click(screen.getByText('2'));
			const lastCall = useGetOrdersQuery.mock.calls.at(-1)[0];
			expect(lastCall.page).toBe(2);
		});
	});
});
