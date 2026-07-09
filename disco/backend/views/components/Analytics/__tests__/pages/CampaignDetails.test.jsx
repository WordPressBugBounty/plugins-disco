import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import CampaignDetails from '../../pages/CampaignDetails';
import { createMockCampaign, renderWithProviders } from '../setup/helpers';

beforeAll(() => {
	global.DISCO = { ...global.DISCO, base_currency: '$' };
});

jest.mock('../../features/campaigns/campaignsApi', () => ({
	useGetCampaignQuery: jest.fn(),
}));

jest.mock('../../components/campaigns/CampaignProductsTable', () => {
	return function MockCampaignProductsTable() {
		return <div data-testid="campaign-products-table">Products Table</div>;
	};
});

jest.mock('../../components/campaigns/CampaignCustomersTable', () => {
	return function MockCampaignCustomersTable() {
		return (
			<div data-testid="campaign-customers-table">Customers Table</div>
		);
	};
});

const {
	useGetCampaignQuery,
} = require('../../features/campaigns/campaignsApi');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({ campaignId: '1' }),
}));

const mockCampaign = createMockCampaign({
	campaign_id: 1,
	campaign_name: 'Summer Sale',
	intent: 'Product',
	status: 'active',
	revenue: 12500.0,
	average_order_value: 277.78,
	total_orders: 45,
	total_customers: 32,
});

describe('CampaignDetails', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders campaign name and badges', () => {
			useGetCampaignQuery.mockReturnValue({
				data: mockCampaign,
				isLoading: false,
			});
			renderWithProviders(<CampaignDetails />);

			expect(screen.getByText('Summer Sale')).toBeInTheDocument();
			expect(screen.getByText('Product')).toBeInTheDocument();
			expect(screen.getByText('active')).toBeInTheDocument();
		});

		it('renders campaign metrics', () => {
			useGetCampaignQuery.mockReturnValue({
				data: mockCampaign,
				isLoading: false,
			});
			renderWithProviders(<CampaignDetails />);

			expect(screen.getByText('Revenue')).toBeInTheDocument();
			expect(screen.getByText('$12,500.00')).toBeInTheDocument();
			expect(screen.getByText('Total Orders')).toBeInTheDocument();
			expect(screen.getByText('45')).toBeInTheDocument();
			expect(screen.getByText('Avg Order Value')).toBeInTheDocument();
		});

		it('renders tabs for Products and Customers', () => {
			useGetCampaignQuery.mockReturnValue({
				data: mockCampaign,
				isLoading: false,
			});
			renderWithProviders(<CampaignDetails />);

			// Tab buttons
			const tabs = screen.getAllByRole('button');
			const tabLabels = tabs.map((t) => t.textContent);
			expect(tabLabels).toContain('Products');
			expect(tabLabels).toContain('Customers');
		});
	});

	describe('Loading states', () => {
		it('shows skeleton loading state', () => {
			useGetCampaignQuery.mockReturnValue({
				data: undefined,
				isLoading: true,
			});
			const { container } = renderWithProviders(<CampaignDetails />);

			const pulseElements = container.querySelectorAll(
				'.disco-animate-pulse'
			);
			expect(pulseElements.length).toBeGreaterThan(0);
		});
	});

	describe('Tab switching', () => {
		it('shows products table by default', () => {
			useGetCampaignQuery.mockReturnValue({
				data: mockCampaign,
				isLoading: false,
			});
			renderWithProviders(<CampaignDetails />);

			expect(
				screen.getByTestId('campaign-products-table')
			).toBeInTheDocument();
		});

		it('switches to customers tab on click', () => {
			useGetCampaignQuery.mockReturnValue({
				data: mockCampaign,
				isLoading: false,
			});
			renderWithProviders(<CampaignDetails />);

			// Find the Customers tab button specifically
			const customersTab = screen
				.getAllByText('Customers')
				.find((el) => el.tagName === 'BUTTON');
			fireEvent.click(customersTab);

			expect(
				screen.getByTestId('campaign-customers-table')
			).toBeInTheDocument();
			expect(
				screen.queryByTestId('campaign-products-table')
			).not.toBeInTheDocument();
		});
	});

	describe('Edge cases', () => {
		it('renders nothing when data is null and not loading', () => {
			useGetCampaignQuery.mockReturnValue({
				data: null,
				isLoading: false,
			});
			renderWithProviders(<CampaignDetails />);

			// Campaign header should not be rendered
			expect(screen.queryByText('Summer Sale')).not.toBeInTheDocument();
		});
	});
});
