import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Customers from '../../pages/Customers';
import { createMockCustomersList, renderWithProviders } from '../setup/helpers';

jest.mock('../../features/customers/customersApi', () => ({
	useGetCustomersQuery: jest.fn(),
}));

const {
	useGetCustomersQuery,
} = require('../../features/customers/customersApi');

const mockData = createMockCustomersList(3);

describe('Customers', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	function setupLoaded(data = mockData) {
		useGetCustomersQuery.mockReturnValue({
			data,
			isLoading: false,
			isFetching: false,
		});
	}

	describe('Rendering', () => {
		it('renders page heading and subtitle', () => {
			setupLoaded();
			renderWithProviders(<Customers />);

			expect(screen.getByText('Customers')).toBeInTheDocument();
			expect(
				screen.getByText(
					'Customers who used at least one Disco campaign'
				)
			).toBeInTheDocument();
		});

		it('renders customer names', () => {
			setupLoaded();
			renderWithProviders(<Customers />);

			expect(screen.getByText('Customer 1')).toBeInTheDocument();
			expect(screen.getByText('Customer 2')).toBeInTheDocument();
		});

		it('renders customer emails', () => {
			setupLoaded();
			renderWithProviders(<Customers />);

			expect(
				screen.getByText('customer1@example.com')
			).toBeInTheDocument();
		});

		it('renders table headers', () => {
			setupLoaded();
			renderWithProviders(<Customers />);

			expect(screen.getByText('Customer')).toBeInTheDocument();
			expect(screen.getByText('State')).toBeInTheDocument();
			expect(screen.getByText('Campaigns Used')).toBeInTheDocument();
			expect(screen.getByText(/Orders/)).toBeInTheDocument();
			expect(screen.getByText(/Spent/)).toBeInTheDocument();
		});
	});

	describe('Loading states', () => {
		it('shows loading skeletons', () => {
			useGetCustomersQuery.mockReturnValue({
				data: undefined,
				isLoading: true,
				isFetching: true,
			});
			const { container } = renderWithProviders(<Customers />);

			const pulseElements = container.querySelectorAll(
				'.disco-animate-pulse'
			);
			expect(pulseElements.length).toBeGreaterThan(0);
		});
	});

	describe('Empty states', () => {
		it('shows empty state when no customers', () => {
			useGetCustomersQuery.mockReturnValue({
				data: {
					data: [],
					collection: { count: 0, total: 0, total_pages: 1 },
				},
				isLoading: false,
				isFetching: false,
			});
			renderWithProviders(<Customers />);

			expect(
				screen.getByText('Customers Not Found!')
			).toBeInTheDocument();
		});
	});

	describe('Sorting', () => {
		it('default sort is by spent descending', () => {
			setupLoaded();
			renderWithProviders(<Customers />);

			const firstCall = useGetCustomersQuery.mock.calls[0][0];
			expect(firstCall.sort_by).toBe('total_spent');
			expect(firstCall.order).toBe('desc');
		});
	});

	describe('Search', () => {
		it('resets page and passes search to hook', async () => {
			setupLoaded();
			const user = userEvent.setup();
			renderWithProviders(<Customers />);

			const searchInput = screen.getByPlaceholderText(
				'Search Customers...'
			);
			await user.type(searchInput, 'jane');

			const lastCall = useGetCustomersQuery.mock.calls.at(-1)[0];
			expect(lastCall.search).toBe('jane');
			expect(lastCall.page).toBe(1);
		});
	});
});
