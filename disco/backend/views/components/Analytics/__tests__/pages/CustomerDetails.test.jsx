import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import CustomerDetails from '../../pages/CustomerDetails';
import { createMockCustomer, renderWithProviders } from '../setup/helpers';

beforeAll(() => {
	global.DISCO = { ...global.DISCO, base_currency: '$' };
});

jest.mock('../../features/customers/customersApi', () => ({
	useGetCustomerQuery: jest.fn(),
	useGetOrdersQuery: jest.fn(),
	useGetProductsQuery: jest.fn(),
}));

// Mock embedded tables to isolate tests
jest.mock('../../components/customers/CustomerOrdersTable', () => {
	return function MockCustomerOrdersTable() {
		return <div data-testid="customer-orders-table">Orders Table</div>;
	};
});

const {
	useGetCustomerQuery,
} = require('../../features/customers/customersApi');

// Mock react-router useParams
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({ customerId: '1' }),
}));

const mockCustomer = createMockCustomer({
	id: 1,
	name: 'Jane Smith',
	email: 'jane@example.com',
	state: 'New York',
	campaigns: [{ name: 'Summer Sale' }],
	orders: 5,
	total_spent: 1250.0,
});

describe('CustomerDetails', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders customer name and details', () => {
			useGetCustomerQuery.mockReturnValue({
				data: { data: mockCustomer },
				isLoading: false,
			});
			renderWithProviders(<CustomerDetails />);

			expect(screen.getByText('Jane Smith')).toBeInTheDocument();
			expect(screen.getByText('jane@example.com')).toBeInTheDocument();
			expect(screen.getByText('New York')).toBeInTheDocument();
		});

		it('renders customer metrics', () => {
			useGetCustomerQuery.mockReturnValue({
				data: { data: mockCustomer },
				isLoading: false,
			});
			renderWithProviders(<CustomerDetails />);

			expect(screen.getByText('Total Spent')).toBeInTheDocument();
			expect(screen.getByText('$1,250.00')).toBeInTheDocument();
		});
	});

	describe('Loading states', () => {
		it('shows skeleton loading state', () => {
			useGetCustomerQuery.mockReturnValue({
				data: undefined,
				isLoading: true,
			});
			const { container } = renderWithProviders(<CustomerDetails />);

			const pulseElements = container.querySelectorAll(
				'.disco-animate-pulse'
			);
			expect(pulseElements.length).toBeGreaterThan(0);
		});
	});

	describe('Customer not found', () => {
		it('shows CustomerNotFound when customer is null', () => {
			useGetCustomerQuery.mockReturnValue({
				data: { data: null },
				isLoading: false,
			});
			renderWithProviders(<CustomerDetails />);

			expect(screen.getByText('Customer not found')).toBeInTheDocument();
			expect(screen.getByText('Back to Customers')).toBeInTheDocument();
		});

		it('shows CustomerNotFound when data is empty', () => {
			useGetCustomerQuery.mockReturnValue({
				data: {},
				isLoading: false,
			});
			renderWithProviders(<CustomerDetails />);

			expect(screen.getByText('Customer not found')).toBeInTheDocument();
		});
	});
});
