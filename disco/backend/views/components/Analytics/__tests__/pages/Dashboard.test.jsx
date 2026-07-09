import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import { renderWithProviders } from '../setup/helpers';

// Mock Recharts — it requires a real DOM measurement layer
jest.mock('recharts', () => {
	const OriginalModule = jest.requireActual('recharts');
	return {
		...OriginalModule,
		ResponsiveContainer: ({ children }) => (
			<div data-testid="responsive-container">{children}</div>
		),
		LineChart: ({ children }) => (
			<div data-testid="line-chart">{children}</div>
		),
		PieChart: ({ children }) => (
			<div data-testid="pie-chart">{children}</div>
		),
		Line: () => null,
		Pie: ({ children }) => <div>{children}</div>,
		Cell: () => null,
		CartesianGrid: () => null,
		XAxis: () => null,
		YAxis: () => null,
		Tooltip: () => null,
		Legend: () => null,
	};
});

// Mock RTK Query hooks to control data states
jest.mock('../../features/summary/summaryApi', () => ({
	useGetSummaryQuery: jest.fn(),
	useGetRevenueChartQuery: jest.fn(),
	useGetIntentsPerformanceQuery: jest.fn(),
}));

jest.mock('../../features/campaigns/campaignsApi', () => ({
	useGetCampaignsQuery: jest.fn(),
}));

jest.mock('../../features/products/productsApi', () => ({
	useGetProductsQuery: jest.fn(),
}));

const {
	useGetSummaryQuery,
	useGetRevenueChartQuery,
	useGetIntentsPerformanceQuery,
} = require('../../features/summary/summaryApi');

const {
	useGetCampaignsQuery,
} = require('../../features/campaigns/campaignsApi');
const { useGetProductsQuery } = require('../../features/products/productsApi');

// Helper to set all hooks to a specific state
function setHooksState(state) {
	const hookReturn = {
		data: undefined,
		isLoading: false,
		isFetching: false,
		...state,
	};
	useGetSummaryQuery.mockReturnValue(hookReturn);
	useGetRevenueChartQuery.mockReturnValue(hookReturn);
	useGetIntentsPerformanceQuery.mockReturnValue(hookReturn);
	useGetCampaignsQuery.mockReturnValue(hookReturn);
	useGetProductsQuery.mockReturnValue(hookReturn);
}

describe('Dashboard', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders the dashboard heading', () => {
			setHooksState({ isLoading: true });
			renderWithProviders(<Dashboard />);

			expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
		});

		it('renders all summary card titles', () => {
			useGetSummaryQuery.mockReturnValue({
				data: {
					data: {
						active_campaigns: {
							current: 12,
							trend: 'up',
							change_percent: 10,
						},
						net_sales: {
							current: 45000,
							trend: 'up',
							change_percent: 18.6,
						},
						discount_sales: {
							current: 12000,
							trend: 'up',
							change_percent: 22,
						},
						total_orders: {
							current: 342,
							trend: 'up',
							change_percent: 17.9,
						},
						disco_orders: {
							current: 156,
							trend: 'down',
							change_percent: -13,
						},
						customers: {
							current: 98,
							trend: 'up',
							change_percent: 15,
						},
					},
				},
				isLoading: false,
				isFetching: false,
			});
			useGetRevenueChartQuery.mockReturnValue({
				data: { data: [], interval: 'day' },
				isLoading: false,
			});
			useGetIntentsPerformanceQuery.mockReturnValue({
				data: {
					data: [
						{
							intent: 'Product',
							revenue: 1000,
							orders: 10,
							percentage: 100,
						},
					],
					total_revenue: 1000,
				},
				isLoading: false,
			});
			useGetCampaignsQuery.mockReturnValue({
				data: {
					data: [
						{
							campaign_id: 1,
							campaign_name: 'Sale',
							revenue: 5000,
						},
					],
				},
				isLoading: false,
				isFetching: false,
			});
			useGetProductsQuery.mockReturnValue({
				data: {
					data: [
						{ id: 1, name: 'Prod', image: '', total_revenue: 3000 },
					],
				},
				isLoading: false,
				isFetching: false,
			});

			renderWithProviders(<Dashboard />);

			expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
			expect(screen.getByText('Net Sale')).toBeInTheDocument();
			expect(screen.getByText('Discount Sale')).toBeInTheDocument();
			expect(screen.getByText('Total Orders')).toBeInTheDocument();
			expect(
				screen.getByText('Orders with Discount')
			).toBeInTheDocument();
			expect(screen.getByText('Customers')).toBeInTheDocument();
		});

		it('renders chart sections', () => {
			useGetSummaryQuery.mockReturnValue({
				data: { data: {} },
				isLoading: false,
				isFetching: false,
			});
			useGetRevenueChartQuery.mockReturnValue({
				data: {
					data: [
						{
							date: '2025-05-01',
							net_sales: 1000,
							discount_sales: 300,
						},
					],
					interval: 'day',
				},
				isLoading: false,
			});
			useGetIntentsPerformanceQuery.mockReturnValue({
				data: {
					data: [
						{
							intent: 'Product',
							revenue: 5000,
							orders: 50,
							percentage: 100,
						},
					],
					total_revenue: 5000,
				},
				isLoading: false,
			});
			useGetCampaignsQuery.mockReturnValue({
				data: {
					data: [
						{
							campaign_id: 1,
							campaign_name: 'Sale A',
							revenue: 5000,
						},
					],
				},
				isLoading: false,
				isFetching: false,
			});
			useGetProductsQuery.mockReturnValue({
				data: {
					data: [
						{
							id: 1,
							name: 'Prod A',
							image: '',
							total_revenue: 3000,
						},
					],
				},
				isLoading: false,
				isFetching: false,
			});

			renderWithProviders(<Dashboard />);

			expect(screen.getByText('Revenue over time')).toBeInTheDocument();
			expect(screen.getByText('Revenue by intent')).toBeInTheDocument();
		});

		it('renders top campaigns and top products sections', () => {
			useGetSummaryQuery.mockReturnValue({
				data: { data: {} },
				isLoading: false,
				isFetching: false,
			});
			useGetRevenueChartQuery.mockReturnValue({
				data: { data: [], interval: 'day' },
				isLoading: false,
			});
			useGetIntentsPerformanceQuery.mockReturnValue({
				data: {
					data: [
						{
							intent: 'Product',
							revenue: 1000,
							orders: 10,
							percentage: 100,
						},
					],
					total_revenue: 1000,
				},
				isLoading: false,
			});
			useGetCampaignsQuery.mockReturnValue({
				data: {
					data: [
						{
							campaign_id: 1,
							campaign_name: 'Sale A',
							revenue: 5000,
						},
					],
				},
				isLoading: false,
				isFetching: false,
			});
			useGetProductsQuery.mockReturnValue({
				data: {
					data: [
						{
							id: 1,
							name: 'Prod A',
							image: '',
							total_revenue: 3000,
						},
					],
				},
				isLoading: false,
				isFetching: false,
			});

			renderWithProviders(<Dashboard />);

			expect(screen.getByText('Top campaigns')).toBeInTheDocument();
			expect(
				screen.getByText('Top products by revenue')
			).toBeInTheDocument();
		});
	});

	describe('Loading states', () => {
		it('shows loading skeletons for all sections', () => {
			setHooksState({ isLoading: true });
			const { container } = renderWithProviders(<Dashboard />);

			const pulseElements = container.querySelectorAll(
				'.disco-animate-pulse'
			);
			expect(pulseElements.length).toBeGreaterThan(0);
		});
	});

	describe('Empty states', () => {
		it('shows empty state when campaigns data is empty', () => {
			useGetSummaryQuery.mockReturnValue({
				data: { data: {} },
				isLoading: false,
				isFetching: false,
			});
			useGetRevenueChartQuery.mockReturnValue({
				data: { data: [], interval: 'day' },
				isLoading: false,
			});
			useGetIntentsPerformanceQuery.mockReturnValue({
				data: {
					data: [
						{
							intent: 'Product',
							revenue: 0,
							orders: 0,
							percentage: 0,
						},
					],
					total_revenue: 0,
				},
				isLoading: false,
			});
			useGetCampaignsQuery.mockReturnValue({
				data: { data: [] },
				isLoading: false,
				isFetching: false,
			});
			useGetProductsQuery.mockReturnValue({
				data: { data: [] },
				isLoading: false,
				isFetching: false,
			});

			renderWithProviders(<Dashboard />);

			// Empty state for campaigns/products
			expect(screen.getAllByText(/Not Found!/i).length).toBeGreaterThan(0);
		});
	});
});
