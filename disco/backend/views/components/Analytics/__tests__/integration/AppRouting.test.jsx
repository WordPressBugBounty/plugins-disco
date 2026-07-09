import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import Dashboard from '../../pages/Dashboard';
import NotFound from '../../pages/NotFound';
import { createTestStore } from '../setup/helpers';

// Mock Recharts
jest.mock('recharts', () => ({
	ResponsiveContainer: ({ children }) => <div>{children}</div>,
	LineChart: ({ children }) => <div>{children}</div>,
	PieChart: ({ children }) => <div>{children}</div>,
	Line: () => null,
	Pie: ({ children }) => <div>{children}</div>,
	Cell: () => null,
	CartesianGrid: () => null,
	XAxis: () => null,
	YAxis: () => null,
	Tooltip: () => null,
	Legend: () => null,
}));

// Mock RTK Query hooks
jest.mock('../../features/summary/summaryApi', () => ({
	useGetSummaryQuery: () => ({
		data: undefined,
		isLoading: false,
		isFetching: false,
	}),
	useGetRevenueChartQuery: () => ({
		data: { data: [], interval: 'day' },
		isLoading: false,
	}),
	useGetIntentsPerformanceQuery: () => ({
		data: {
			data: [{ intent: 'Product', revenue: 0, orders: 0, percentage: 0 }],
			total_revenue: 0,
		},
		isLoading: false,
	}),
}));

jest.mock('../../features/campaigns/campaignsApi', () => ({
	useGetCampaignsQuery: () => ({
		data: {
			data: [
				{
					campaign_id: 1,
					campaign_name: 'Test',
					intent: 'Product',
					valid_date: {},
					orders: 0,
					customers: 0,
					revenue: 0,
					status: 'active',
				},
			],
		},
		isLoading: false,
		isFetching: false,
	}),
}));

jest.mock('../../features/products/productsApi', () => ({
	useGetProductsQuery: () => ({
		data: {
			data: [
				{
					id: 1,
					name: 'TestProd',
					image: '',
					unit_price: 10,
					categories: [],
					campaigns: [],
					total_orders: 0,
					total_customers: 0,
					total_revenue: 0,
				},
			],
		},
		isLoading: false,
		isFetching: false,
	}),
}));

function renderApp(route = '/') {
	const store = createTestStore();
	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[route]}>
				<Routes>
					<Route index element={<Dashboard />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</MemoryRouter>
		</Provider>
	);
}

describe('App Routing', () => {
	it('renders Dashboard on root route', () => {
		renderApp('/');
		expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
		// React-Redux may warn about selector memoization
		// expect(console).toHaveWarned();
	});

	it('renders NotFound for unknown routes', () => {
		renderApp('/unknown-page');
		expect(screen.getByText('Page not found')).toBeInTheDocument();
	});

	it('renders NotFound page with back link', () => {
		renderApp('/unknown');
		const link = screen.getByText('Back to Dashboard');
		expect(link.closest('a')).toHaveAttribute('href', '/');
	});
});
