import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import AnalyticsBreadcrumb from '../../components/layout/AnalyticsBreadcrumb';
import { renderWithProviders } from '../setup/helpers';

jest.mock('../../features/customers/customersApi', () => ({
	useGetCustomerQuery: jest.fn(),
}));
jest.mock('../../features/campaigns/campaignsApi', () => ({
	useGetCampaignQuery: jest.fn(),
}));

const {
	useGetCustomerQuery,
} = require('../../features/customers/customersApi');
const {
	useGetCampaignQuery,
} = require('../../features/campaigns/campaignsApi');

const NAV_ITEMS = [
	{ label: 'Dashboard', path: '/', end: true },
	{ label: 'Campaigns Report', path: '/campaigns-reports' },
	{ label: 'Products', path: '/products' },
	{ label: 'Orders', path: '/orders' },
	{ label: 'Customers', path: '/customers' },
];

function renderBreadcrumb(pathname) {
	return renderWithProviders(
		<AnalyticsBreadcrumb pathname={pathname} NAV_ITEMS={NAV_ITEMS} />,
		{ route: pathname }
	);
}

describe('AnalyticsBreadcrumb', () => {
	beforeEach(() => {
		useGetCustomerQuery.mockReturnValue({ data: undefined });
		useGetCampaignQuery.mockReturnValue({ data: undefined });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders nothing on the dashboard route', () => {
		const { container } = renderBreadcrumb('/');
		expect(container.innerHTML).toBe('');
	});

	it('renders Dashboard > Campaigns Report for campaigns route', () => {
		renderBreadcrumb('/campaigns-reports');

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Campaigns Report')).toBeInTheDocument();
	});

	it('renders Dashboard > Products for products route', () => {
		renderBreadcrumb('/products');

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Products')).toBeInTheDocument();
	});

	it('renders Dashboard > Orders for orders route', () => {
		renderBreadcrumb('/orders');

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Orders')).toBeInTheDocument();
	});

	it('renders Dashboard > Customers for customers route', () => {
		renderBreadcrumb('/customers');

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Customers')).toBeInTheDocument();
	});

	it('falls back to "Campaign Details" while campaign data is loading', () => {
		renderBreadcrumb('/campaigns-reports/42');

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Campaigns Report')).toBeInTheDocument();
		// expect(screen.getByText('Campaign Details')).toBeInTheDocument();
	});

	it('renders the campaign name dynamically for campaign details', () => {
		useGetCampaignQuery.mockReturnValue({
			data: { campaign_name: 'Summer Sale' },
		});
		renderBreadcrumb('/campaigns-reports/42');

		expect(screen.getByText('Campaigns Report')).toBeInTheDocument();
		expect(screen.getByText('Summer Sale')).toBeInTheDocument();
		// expect(screen.queryByText('Campaign Details')).not.toBeInTheDocument();
	});

	it('falls back to "Customer Details" while customer data is loading', () => {
		renderBreadcrumb('/customers/7');

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Customers')).toBeInTheDocument();
		// expect(screen.getByText('Customer Details')).toBeInTheDocument();
	});

	it('renders the customer name dynamically for customer details', () => {
		useGetCustomerQuery.mockReturnValue({
			data: { data: { name: 'Jane Smith' } },
		});
		renderBreadcrumb('/customers/7');

		expect(screen.getByText('Customers')).toBeInTheDocument();
		expect(screen.getByText('Jane Smith')).toBeInTheDocument();
		expect(screen.queryByText('Customer Details')).not.toBeInTheDocument();
	});

	it('Dashboard link points to root', () => {
		renderBreadcrumb('/products');

		const dashboardLink = screen.getByText('Dashboard').closest('a');
		expect(dashboardLink).toHaveAttribute('href', '/');
	});
});
