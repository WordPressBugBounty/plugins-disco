/**
 * Shared test utilities for the Analytics app.
 *
 * Provides:
 *  - A pre-configured Redux store factory
 *  - A custom `render` that wraps components in Provider + MemoryRouter
 *  - Mock data factories for every entity the app uses
 */
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { analyticsApi } from '../../features/api/analyticsApi';
import dateRangeReducer from '../../features/dateRange/dateRangeSlice';

// ---------------------------------------------------------------------------
// Store factory
// ---------------------------------------------------------------------------
export function createTestStore(preloadedState = {}) {
	return configureStore({
		reducer: {
			[analyticsApi.reducerPath]: analyticsApi.reducer,
			dateRange: dateRangeReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(analyticsApi.middleware),
		preloadedState,
	});
}

// ---------------------------------------------------------------------------
// Custom render with all providers
// ---------------------------------------------------------------------------
export function renderWithProviders(
	ui,
	{
		preloadedState = {},
		store = createTestStore(preloadedState),
		route = '/',
		...renderOptions
	} = {}
) {
	function Wrapper({ children }) {
		return (
			<Provider store={store}>
				<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
			</Provider>
		);
	}

	return {
		store,
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
	};
}

// ---------------------------------------------------------------------------
// Mock data factories
// ---------------------------------------------------------------------------
export function createMockSummary(overrides = {}) {
	return {
		data: {
			active_campaigns: {
				current: 12,
				previous: 10,
				change_percent: 20.0,
				trend: 'up',
			},
			net_sales: {
				current: 45230.5,
				previous: 38120.25,
				change_percent: 18.6,
				trend: 'up',
			},
			discount_sales: {
				current: 12450.0,
				previous: 10200.0,
				change_percent: 22.1,
				trend: 'up',
			},
			total_orders: {
				current: 342,
				previous: 290,
				change_percent: 17.9,
				trend: 'up',
			},
			disco_orders: {
				current: 156,
				previous: 180,
				change_percent: -13.3,
				trend: 'down',
			},
			customers: {
				current: 98,
				previous: 85,
				change_percent: 15.3,
				trend: 'up',
			},
			...overrides,
		},
	};
}

export function createMockCampaign(overrides = {}) {
	return {
		campaign_id: 1,
		campaign_name: 'Summer Sale',
		intent: 'Product',
		valid_date: { from: '2025-06-01', to: '2025-06-30' },
		orders: 45,
		customers: 32,
		revenue: 12500.0,
		status: 'active',
		total_orders: 45,
		total_customers: 32,
		average_order_value: 277.78,
		...overrides,
	};
}

export function createMockCampaignsList(count = 3) {
	return {
		data: Array.from({ length: count }, (_, i) =>
			createMockCampaign({
				campaign_id: i + 1,
				campaign_name: `Campaign ${i + 1}`,
				revenue: 10000 - i * 1000,
			})
		),
		collection: { count, total: count, total_pages: 1 },
	};
}

export function createMockProduct(overrides = {}) {
	return {
		id: 1,
		name: 'Premium Widget',
		image: 'https://example.com/widget.jpg',
		unit_price: 49.99,
		categories: [{ name: 'Widgets' }],
		campaigns: [{ name: 'Summer Sale' }],
		total_orders: 120,
		total_customers: 85,
		total_revenue: 5999.8,
		...overrides,
	};
}

export function createMockProductsList(count = 3) {
	return {
		data: Array.from({ length: count }, (_, i) =>
			createMockProduct({
				id: i + 1,
				name: `Product ${i + 1}`,
				total_revenue: 5000 - i * 500,
			})
		),
		collection: { count, total: count, total_pages: 1 },
	};
}

export function createMockOrder(overrides = {}) {
	return {
		id: 101,
		customer_name: 'John Doe',
		campaigns: [{ name: 'Summer Sale' }],
		products: [{ name: 'Premium Widget' }],
		revenue: 149.99,
		quantity: 2,
		date: '2025-05-10',
		...overrides,
	};
}

export function createMockOrdersList(count = 3) {
	return {
		data: Array.from({ length: count }, (_, i) =>
			createMockOrder({
				id: 101 + i,
				customer_name: `Customer ${i + 1}`,
				revenue: 200 - i * 25,
			})
		),
		collection: { count, total: count, total_pages: 1 },
	};
}

export function createMockCustomer(overrides = {}) {
	return {
		id: 1,
		name: 'Jane Smith',
		email: 'jane@example.com',
		city: 'New York',
		avatar: '',
		campaigns: [{ name: 'Summer Sale' }],
		orders: 5,
		total_spent: 1250.0,
		...overrides,
	};
}

export function createMockCustomersList(count = 3) {
	return {
		data: Array.from({ length: count }, (_, i) =>
			createMockCustomer({
				id: i + 1,
				name: `Customer ${i + 1}`,
				email: `customer${i + 1}@example.com`,
				total_spent: 2000 - i * 200,
			})
		),
		collection: { count, total: count, total_pages: 1 },
	};
}

export function createMockRevenueChart(days = 7) {
	return {
		data: Array.from({ length: days }, (_, i) => ({
			date: `2025-05-${String(i + 1).padStart(2, '0')}`,
			net_sales: 1000 + i * 100,
			discount_sales: 300 + i * 30,
		})),
		interval: 'day',
	};
}

export function createMockIntentsPerformance() {
	return {
		data: [
			{ intent: 'Product', revenue: 5000, orders: 50, percentage: 40 },
			{ intent: 'Cart', revenue: 2500, orders: 25, percentage: 20 },
			{ intent: 'Shipping', revenue: 1875, orders: 18, percentage: 15 },
			{ intent: 'Bulk', revenue: 1250, orders: 12, percentage: 10 },
			{ intent: 'BOGO', revenue: 1000, orders: 10, percentage: 8 },
			{ intent: 'Bundle', revenue: 625, orders: 6, percentage: 5 },
			{ intent: 'Others', revenue: 250, orders: 3, percentage: 2 },
		],
		total_revenue: 12500,
	};
}
