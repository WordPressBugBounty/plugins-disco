import { fireEvent, screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import '@wordpress/jest-console';
import 'whatwg-fetch';
import {
	useAddCampaignMutation,
	useDeleteCampaignMutation,
	useGetCampaignsQuery,
	usePatchCampaignMutation,
} from '../../../features/campaigns/campaignsApi';
import {
	useGetBOGOTypesQuery,
	useGetDiscountBasedOnQuery,
	useGetDiscountIntentsQuery,
	useGetDiscountTypesQuery,
	useGetFiltersQuery,
	useGetWhatGetsDiscountQuery,
} from '../../../features/discount/discountApi';
import { useGetSettingsQuery } from '../../../features/settings/settingsApi';
import {
	dateStringToTimestamp,
	dateTimeFormatter,
	getSelectedFilterData,
	prepareCampaignForRequest,
} from '../../../utilities/utilities';
import {
	filters,
	renderWithProviders,
	testCampaigns,
} from '../../../utilities/utils-for-tests';
import Campaigns from '../Campaigns';

jest.mock('../../../features/campaigns/campaignsApi.js', () => ({
	useGetCampaignsQuery: jest.fn(),
	useAddCampaignMutation: jest.fn(),
	usePatchCampaignMutation: jest.fn(),
	useDeleteCampaignMutation: jest.fn(),
}));

jest.mock('../../../features/discount/discountApi', () => ({
	useGetDiscountIntentsQuery: jest.fn(),
	useGetFiltersQuery: jest.fn(),
	useGetWhatGetsDiscountQuery: jest.fn(),
	useGetDiscountMethodsQuery: jest.fn(),
	useGetDiscountTypesQuery: jest.fn(),
	useGetDiscountBasedOnQuery: jest.fn(),
	useGetBOGOTypesQuery: jest.fn(),
}));
jest.mock('../../../features/settings/settingsApi', () => ({
	useGetSettingsQuery: jest.fn(),
}));
jest.mock('../../../utilities/utilities', () => ({
	prepareCampaignForRequest: jest.fn(),
	dateTimeFormatter: jest.fn(),
	getSelectedFilterData: jest.fn(),
	dateStringToTimestamp: jest.fn(),
	truncate: jest.fn((str) => str),
}));

// Mock react-router
jest.mock('react-router', () => {
	return {
		...jest.requireActual('react-router'),
		useNavigate: () => jest.fn(),
	};
});

describe('Discount Campaigns Page', () => {
	beforeEach(() => {
		useGetCampaignsQuery.mockClear();
	});

	afterEach(() => {
		useGetCampaignsQuery.mockClear();
	});

	URL.createObjectURL = jest.fn(() => 'mocked-url');

	useGetCampaignsQuery.mockReturnValue({
		data: testCampaigns,
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});
	const addCampaignMock = jest.fn();
	useAddCampaignMutation.mockReturnValue([
		addCampaignMock,
		{ isLoading: false, isSuccess: true, isError: false, error: null },
	]);

	usePatchCampaignMutation.mockReturnValue([
		jest.fn(),
		{
			data: testCampaigns[0],
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
		},
	]);
	useDeleteCampaignMutation.mockReturnValue([
		jest.fn(),
		{ isLoading: false, isSuccess: true, isError: false, error: null },
	]);

	useGetDiscountIntentsQuery.mockReturnValue({
		data: {
			name: 'discount_intents',
			values: {
				Product: 'Product',
				Cart: 'Cart',
				Shipping: 'Free Shipping',
				Bulk: 'Bulk Discount',
				Bundle: 'Bundle Discount',
				BOGO: 'BOGO',
			},
		},
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});

	useGetFiltersQuery.mockReturnValue({
		data: filters,
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});
	useGetWhatGetsDiscountQuery.mockReturnValue({
		data: {
			name: 'products',
			values: {
				all_products: 'All Products',
				products: 'Few Products',
			},
		},
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});

	useGetDiscountTypesQuery.mockReturnValue({
		data: {
			name: 'discount_types',
			values: {
				percent: '% - Percentage',
				fixed: '$ - Fixed',
				percent_per_product: '% - Percentage Per Product',
				fixed_per_product: '$ - Fixed Per Product',
				free: 'Free',
			},
		},
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});
	useGetDiscountBasedOnQuery.mockReturnValue({
		data: {
			name: 'discount_based_on',
			values: {
				item_quantity: 'Item Quantity',
				item_price: 'Item Price',
				cart_quantity: 'Cart Quantity',
				cart_subtotal: 'Cart Subtotal',
			},
		},
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});
	useGetBOGOTypesQuery.mockReturnValue({
		data: {
			name: 'bogo_types',
			values: {
				all: 'All',
				products: 'Products',
				categories: 'Categories',
			},
		},
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});
	useGetSettingsQuery.mockReturnValue({
		data: { product_price_type: 'price', min_max_discount_amount: '50' },
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});

	prepareCampaignForRequest.mockReturnValue({});
	dateTimeFormatter.mockReturnValue('');
	getSelectedFilterData.mockReturnValue({});
	dateStringToTimestamp.mockReturnValue('');

	describe('Header', () => {
		test('Render Correctly', async () => {
			// Mock console.warn if specific warnings are causing the test to fail
			const originalWarn = console.warn;
			console.warn = (...args) => {
				if (args[0].includes('React Router Future Flag Warning')) {
					return;
				}
				originalWarn(...args);
			};

			// Render the component
			renderWithProviders(<Campaigns />);

			// Ensure elements are found and rendered correctly
			const heading = await screen.findByText('Discount Campaigns'); // Use `findBy` to await presence if async
			const importButton = screen.getByText('Import');
			const createButton = screen.getByText('Create a Discount');
			const settingsButton = screen.getByText('Settings');

			// Assert that all expected elements are in the document
			expect(heading).toBeInTheDocument();
			expect(importButton).toBeInTheDocument();
			expect(createButton).toBeInTheDocument();
			expect(settingsButton).toBeInTheDocument();

			// Restore the original console.warn after the test
			console.warn = originalWarn;
		});

		test('Import Interact Correctly', async () => {
			renderWithProviders(<Campaigns />);

			const importInput =
				screen.getByPlaceholderText('Select Disco File');
			fireEvent.change(importInput, {
				target: {
					files: [
						new File(['{"data": "test data"}'], 'test.disco', {
							type: 'application/json',
						}),
					],
				},
			});

			await waitFor(() => {
				expect(addCampaignMock).toHaveBeenCalled();
			});
		});

		test('Create Discount Button Interact Correctly', async () => {
			const mockNavigate = jest.fn();
			const useNavigateMock = jest.spyOn(
				require('react-router'),
				'useNavigate'
			);

			useNavigateMock.mockImplementation(() => mockNavigate);

			renderWithProviders(<Campaigns />);
			const createButton = screen.getByText('Create a Discount');
			fireEvent.click(createButton);
			expect(mockNavigate).toHaveBeenCalledWith('disco');
		});

		test('Settings Button Interact Correctly', async () => {
			const mockNavigate = jest.fn();
			const useNavigateMock = jest.spyOn(
				require('react-router'),
				'useNavigate'
			);

			useNavigateMock.mockImplementation(() => mockNavigate);

			renderWithProviders(<Campaigns />);
			const settingButton = screen.getByText('Settings');
			fireEvent.click(settingButton);
			expect(mockNavigate).toHaveBeenCalledWith('settings');
		});
	});

	describe('Action Bar', () => {
		test('Render Correctly', () => {
			renderWithProviders(<Campaigns />);

			const bulkActionSelect = screen.getByText('Bulk Actions');
			// const applyButton = screen.getByText('Apply');
			const searchInput = screen.getByPlaceholderText('Search Campaign');
			// const searchButton = screen.getByText('Search');

			expect(bulkActionSelect).toBeInTheDocument();
			// expect(applyButton).toBeInTheDocument();
			expect(searchInput).toBeInTheDocument();
			// expect(searchButton).toBeInTheDocument();
		});

		test('Search Work Correctly', () => {
			renderWithProviders(<Campaigns />);
			const searchInput = screen.getByPlaceholderText('Search Campaign');
			// const searchButton = screen.getByText('Search');

			fireEvent.change(searchInput, { target: { value: 'Winter' } });
			// fireEvent.click(searchButton);
			const percentDiscount = screen.queryByText('50% Off');
			expect(percentDiscount).not.toBeInTheDocument();

			const actionsButtons = screen.getAllByText('Actions');
			expect(actionsButtons.length).toBe(1);
		});
	});

	describe('Campaigns List', () => {
		test('Render Correctly', () => {
			renderWithProviders(<Campaigns />);

			const nameColumn = screen.getByText('Campaign Name');
			const actionColumn = screen.getByText('Actions');
			const winterSaleCamp = screen.getByText('Winter Sale');
			const percentDiscount = screen.getByText('50% Off');
			// const actionsButtons = screen.getAllByText('Actions');

			expect(nameColumn).toBeInTheDocument();
			expect(actionColumn).toBeInTheDocument();
			expect(winterSaleCamp).toBeInTheDocument();
			expect(percentDiscount).toBeInTheDocument();
			// expect(actionsButtons.length).toBe(2);
		});

		test('Name Click Navigate To Edit', () => {
			const mockNavigate = jest.fn();
			const useNavigateMock = jest.spyOn(
				require('react-router'),
				'useNavigate'
			);

			useNavigateMock.mockImplementation(() => mockNavigate);

			renderWithProviders(<Campaigns />);

			const winterSaleCamp = screen.getByText('Winter Sale');
			fireEvent.click(winterSaleCamp);
			expect(mockNavigate).toHaveBeenCalledWith('disco?edit=409', {
				state: testCampaigns[1],
			});
		});
	});
});
