import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import '@wordpress/jest-console';
import 'whatwg-fetch';
import {
	useAddCampaignMutation,
	useDeleteCampaignMutation,
	useGetCampaignsQuery,
	usePatchCampaignMutation,
	useUpdateCampaignMutation,
} from '../../../../../features/campaigns/campaignsApi';
import {
	useGetBOGOTypesQuery,
	useGetDiscountBasedOnQuery,
	useGetDiscountIntentsQuery,
	useGetDiscountMethodsQuery,
	useGetDiscountTypesQuery,
	useGetFiltersQuery,
	useGetWhatGetsDiscountQuery,
} from '../../../../../features/discount/discountApi';
import {
	dateTimeFormatter,
	getSelectedFilterData,
	prepareCampaignForRequest,
} from '../../../../../utilities/utilities';

import {
	useGetProductsQuery,
	useGetSearchItemQuery,
} from '../../../../../features/search/searchApi';
import {
	filters,
	renderWithProviders,
	testCampaigns,
} from '../../../../../utilities/utils-for-tests';
import CampaignSetup from '../CampaignSetup';
jest.mock('../../../../../features/search/searchApi', () => ({
	useGetProductsQuery: jest.fn(),
	useGetSearchItemQuery: jest.fn(),
}));

jest.mock('../../../../../features/campaigns/campaignsApi.js', () => ({
	useGetCampaignsQuery: jest.fn(),
	useAddCampaignMutation: jest.fn(),
	usePatchCampaignMutation: jest.fn(),
	useDeleteCampaignMutation: jest.fn(),
	useUpdateCampaignMutation: jest.fn(),
}));

jest.mock('../../../../../features/discount/discountApi', () => ({
	useGetDiscountIntentsQuery: jest.fn(),
	useGetFiltersQuery: jest.fn(),
	useGetWhatGetsDiscountQuery: jest.fn(),
	useGetDiscountMethodsQuery: jest.fn(),
	useGetDiscountTypesQuery: jest.fn(),
	useGetDiscountBasedOnQuery: jest.fn(),
	useGetBOGOTypesQuery: jest.fn(),
}));

jest.mock('../../../../../utilities/utilities', () => ({
	prepareCampaignForRequest: jest.fn(),
	dateTimeFormatter: jest.fn(),
	getSelectedFilterData: jest.fn(),
	discountRulesToTableData: jest.fn(),
}));

// Mock react-router
jest.mock('react-router', () => {
	return {
		...jest.requireActual('react-router'),
		useNavigate: () => jest.fn(),
	};
});

describe('Create Discount Tab', () => {
	afterAll(() => {
		jest.clearAllMocks();
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
		{
			data: testCampaigns[0],
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
		},
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
	useUpdateCampaignMutation.mockReturnValue([
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
				Bulk: 'Bulk',
				Bundle: 'Bundle',
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

	useGetDiscountMethodsQuery.mockReturnValue({
		data: {
			name: 'discount_methods',
			values: {
				automated: 'Automated Discount',
				coupon: 'Coupon Discount',
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

	useGetProductsQuery.mockReturnValue({
		data: [
			{
				id: 17,
				name: 'Beanie',
				sku: 'woo-beanie',
				image: 'http://localhost/quasar/wp-content/uploads/2023/09/beanie-2.jpg',
			},
		],
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});

	useGetSearchItemQuery.mockReturnValue({
		data: [
			{
				id: 17,
				name: 'Beanie',
				sku: 'woo-beanie',
				image: 'http://localhost/quasar/wp-content/uploads/2023/09/beanie-2.jpg',
			},
		],
		isLoading: false,
		isSuccess: true,
		isError: false,
		error: null,
	});

	prepareCampaignForRequest.mockReturnValue({});
	dateTimeFormatter.mockReturnValue('');
	getSelectedFilterData.mockReturnValue({});

	describe('Campaign Name', () => {
		test('Render Correctly', async () => {
			const originalWarn = console.warn;
			console.warn = (...args) => {
				if (
					args[0].includes(
						'React Router Future Flag Warning: React Router will begin wrapping state updates'
					) ||
					args[0].includes(
						'React Router Future Flag Warning: Relative route resolution within Splat routes'
					)
				) {
					return;
				}
				originalWarn(...args);
			};

			renderWithProviders(<CampaignSetup />);
			const intent = screen.getByText('Product');
			await userEvent.click(intent);
			const heading = screen.getByText('Conditions');
			const addCondition = screen.getByText('Add Condition');

			expect(heading).toBeInTheDocument();
			expect(addCondition).toBeInTheDocument();

			// Restore the original console.warn after the test
			console.warn = originalWarn;
		});
		test('Interact Correctly', async () => {
			userEvent.setup();
			const { store } = renderWithProviders(<CampaignSetup />);
			const nameInput = screen.getByPlaceholderText(
				'20% discount on all products'
			);
			await userEvent.type(nameInput, 'My Discount');
			expect(nameInput).toHaveValue('My Discount');
			const { discount } = store.getState();
			expect(discount.name).toBe('My Discount');
		});
	});

	describe('Discount Intention', () => {
		test('Render Correctly', () => {
			renderWithProviders(<CampaignSetup />);
			const heading = screen.getByText('Discount Intent');
			const product = screen.getByText('Product');
			const cart = screen.getByText('Cart');
			const freeShipping = screen.getByText('Shipping');
			const bulkDiscount = screen.getByText('Bulk');
			const bundleDiscount = screen.getByText('Bundle');
			const bogo = screen.getByText('BOGO');

			expect(heading).toBeInTheDocument();
			expect(product).toBeInTheDocument();
			expect(cart).toBeInTheDocument();
			expect(freeShipping).toBeInTheDocument();
			expect(bulkDiscount).toBeInTheDocument();
			expect(bundleDiscount).toBeInTheDocument();
			expect(bogo).toBeInTheDocument();
		});
		describe('Interact Correctly', () => {
			test('Product Intent Button', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const { discount } = store.getState();
				const productRulesCard = screen.getByText('Product Rules');

				expect(discount.discount_intent).toBe('Product');
				expect(productRulesCard).toBeInTheDocument();
			});

			test('Cart Intent Button', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Cart');
				await userEvent.click(intent);
				const { discount } = store.getState();
				expect(discount.discount_intent).toBe('Cart');
				const rulesCard = screen.getByText('Cart Rules');
				expect(rulesCard).toBeInTheDocument();
			});

			test('Shipping Intent Button', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Shipping');
				await userEvent.click(intent);
				const { discount } = store.getState();
				expect(discount.discount_intent).toBe('Shipping');
			});

			test('Bulk Intent Button', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Bulk');
				await userEvent.click(intent);
				const { discount } = store.getState();
				expect(discount.discount_intent).toBe('Bulk');
				const rulesCard = screen.getByText('Bulk Rules');
				expect(rulesCard).toBeInTheDocument();
			});
			test('Bundle Intent Button', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Bundle');
				await userEvent.click(intent);
				const { discount } = store.getState();
				expect(discount.discount_intent).toBe('Bundle');
				const rulesCard = screen.getByText('Bundle Rules');
				expect(rulesCard).toBeInTheDocument();
			});
		});
	});
	describe('Discount Card', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const intent = screen.getByText('Product');
			await userEvent.click(intent);
			const title = screen.getByText('Discount');
			// const method = screen.getByText('Method');
			const filter = screen.getByText('Filter Products');
			const allButton = screen.getByText('All Products');
			const fewButton = screen.getByText('Few Products');
			const limit = screen.getByText('User Limit');
			const limitInput = screen.getByPlaceholderText('Unlimited');
			const validity = screen.getByText('Valid Between');

			expect(title).toBeInTheDocument();
			// expect(method).toBeInTheDocument();
			expect(filter).toBeInTheDocument();
			expect(allButton).toBeInTheDocument();
			expect(fewButton).toBeInTheDocument();
			expect(limit).toBeInTheDocument();
			expect(limitInput).toBeInTheDocument();
			expect(validity).toBeInTheDocument();
		});

		describe('Interact Correctly', () => {
			test('Filter Products', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const all = screen.getByText('All Products');
				const few = screen.getByText('Few Products');

				expect(all).toBeInTheDocument();
				expect(few).toBeInTheDocument();

				await userEvent.click(few);
				const { discount: fewProducts } = store.getState();
				expect(fewProducts.products.length).toBe(0);
				const searchInput =
					screen.getByPlaceholderText('Search Product');
				const placeholder = screen.getByText(
					'Selected Product Will Appear Here.'
				);

				expect(searchInput).toBeInTheDocument();
				expect(placeholder).toBeInTheDocument();

				await userEvent.type(searchInput, 'Ben');
				expect(searchInput).toHaveValue('Ben');

				await userEvent.click(all);
				const { discount: allProducts } = store.getState();
				expect(allProducts.products.length).toBe(1);
				expect(allProducts.products[0]).toBe('all');

				expect(searchInput).not.toBeInTheDocument();
				expect(placeholder).not.toBeInTheDocument();
			});

			test('User Limit', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const limit = screen.getByPlaceholderText('Unlimited');
				expect(limit).toBeInTheDocument();

				await userEvent.type(limit, '500');
				expect(limit).toHaveValue(500);
				const { discount } = store.getState();
				expect(discount.discount_max_user).toBe('500');
			});

			test('Valid Between', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				// Get the elements
				const validFrom = screen.getByTestId('discount_valid_from');
				const validTo = screen.getByTestId('discount_valid_to');

				// Check if elements are in the document
				expect(validFrom).toBeInTheDocument();
				expect(validTo).toBeInTheDocument();

				// Type values into the input fields
				await userEvent.type(validFrom, '2023-11-08T14:30');
				await userEvent.type(validTo, '2023-12-08T14:30');

				// Verify input values
				expect(validFrom).toHaveValue('2023-11-08T14:30');
				expect(validTo).toHaveValue('2023-12-08T14:30');

				// Get the state from the store
				const { discount } = store.getState();

				// Convert expected and received timestamps to Date objects for comparison
				const expectedValidFrom = new Date('2023-11-08T14:30:00');
				const expectedValidTo = new Date('2023-12-08T14:30:00');
				const actualValidFrom = new Date(discount.discount_valid_from);
				const actualValidTo = new Date(discount.discount_valid_to);

				// Compare Date objects
				expect(actualValidFrom.getTime()).toBe(
					expectedValidFrom.getTime()
				);
				expect(actualValidTo.getTime()).toBe(expectedValidTo.getTime());
			});
		});
	});

	describe('Product Rules', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const intent = screen.getByText('Product');
			await userEvent.click(intent);
			const type = screen.getByText('% - Percentage');
			const value = screen.getByPlaceholderText('Value');
			// const label = screen.getByPlaceholderText('Label');

			expect(type).toBeInTheDocument();
			expect(value).toBeInTheDocument();
			// expect(label).toBeInTheDocument();
		});

		describe('Interact Correctly', () => {
			test('Discount Type', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const type = screen.getByText('% - Percentage');
				await userEvent.click(type);
				const fixedType = screen.getByText('$ - Fixed');
				expect(fixedType).toBeInTheDocument();
				await userEvent.click(fixedType);
				const percentType = screen.queryByText('% - Percentage');
				expect(percentType).toBeInTheDocument();
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_type).toBe('fixed');
			});
			test('Discount Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const valueInput = screen.getByPlaceholderText('Value');
				await userEvent.type(valueInput, '50');
				expect(valueInput).toHaveValue(50);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_value).toBe('50');
			});
		});
	});

	describe('Cart Rules', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const intent = screen.getByText('Product');
			await userEvent.click(intent);
			const cart = screen.getByText('Cart');
			await userEvent.click(cart);
			const rulesCard = screen.getByText('Cart Rules');
			const type = screen.getByText('% - Percentage');
			const value = screen.getByPlaceholderText('Value');
			// const label = screen.getByPlaceholderText('Label');

			expect(rulesCard).toBeInTheDocument();
			expect(type).toBeInTheDocument();
			expect(value).toBeInTheDocument();
			// expect(label).toBeInTheDocument();
		});
	});

	describe('Bulk Rules', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const bulk = screen.getByText('Bulk');
			await userEvent.click(bulk);

			const rulesCard = screen.getByText('Bulk Rules');
			const min = screen.getByPlaceholderText('Maximum');
			const max = screen.getByPlaceholderText('Maximum');
			const type = screen.getByText('% - Percentage');
			const value = screen.getByPlaceholderText('Value');
			// const label = screen.getByPlaceholderText('Discount Label');
			const addMore = screen.getByText('Add More');

			expect(rulesCard).toBeInTheDocument();
			expect(min).toBeInTheDocument();
			expect(max).toBeInTheDocument();
			expect(type).toBeInTheDocument();
			expect(value).toBeInTheDocument();
			// expect(label).toBeInTheDocument();
			expect(addMore).toBeInTheDocument();
		});

		describe('Interact Correctly', () => {
			test('Minimum Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bulk = screen.getByText('Bulk');
				await userEvent.click(bulk);

				const min = screen.getByPlaceholderText('Minimum');
				await userEvent.type(min, '5');
				expect(min).toHaveValue(5);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].min).toBe('5');
			});
			test('Maximum Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bulk = screen.getByText('Bulk');
				await userEvent.click(bulk);

				const max = screen.getByPlaceholderText('Maximum');
				await userEvent.type(max, '5');
				expect(max).toHaveValue(5);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].max).toBe('5');
			});
			test('Discount Type', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bulk = screen.getByText('Bulk');
				await userEvent.click(bulk);

				const type = screen.getByText('% - Percentage');
				await userEvent.click(type);
				const fixedType = screen.queryByText('$ - Fixed');
				expect(fixedType).toBeInTheDocument();
				await userEvent.click(fixedType);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_type).toBe('fixed');
			});
			test('Discount Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bulk = screen.getByText('Bulk');
				await userEvent.click(bulk);

				const value = screen.getByPlaceholderText('Value');
				await userEvent.type(value, '50');
				expect(value).toHaveValue(50);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_value).toBe('50');
			});
			test('Discount Label', async () => {
				renderWithProviders(<CampaignSetup />);
				const bulk = screen.getByText('Bulk');
				await userEvent.click(bulk);

				// const label = screen.getByPlaceholderText('Discount Label');
				// await userEvent.type(label, '50 Taka Off');
				// expect(label).toHaveValue('50 Taka Off');
				// const { discount } = store.getState();
				// expect(discount.discount_rules[0].discount_label).toBe(
				// 	'50 Taka Off'
				// );
			});
			test('Add More', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bulk = screen.getByText('Bulk');
				await userEvent.click(bulk);

				const addMore = screen.getByText('Add More');

				await userEvent.click(addMore);
				const { discount } = store.getState();
				expect(discount.discount_rules.length).toBe(2);
				const min = screen.getAllByPlaceholderText('Minimum');
				expect(min.length).toBe(2);
			});
		});
	});

	describe('Bundle Rules', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const bundle = screen.getByText('Bundle');
			await userEvent.click(bundle);

			const rulesCard = screen.getByText('Bundle Rules');
			const quantity = screen.getByPlaceholderText('Quantity');
			const type = screen.getByText('% - Percentage');
			const value = screen.getByPlaceholderText('Value');
			// const label = screen.getByPlaceholderText('Discount Label');
			const addMore = screen.getByText('Add More');
			const recursive = screen.getByText('Recursive');

			expect(rulesCard).toBeInTheDocument();
			expect(quantity).toBeInTheDocument();
			expect(type).toBeInTheDocument();
			expect(value).toBeInTheDocument();
			// expect(label).toBeInTheDocument();
			expect(addMore).toBeInTheDocument();
			expect(recursive).toBeInTheDocument();
		});

		describe('Interact Correctly', () => {
			test('Discount Type', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bundle = screen.getByText('Bundle');
				await userEvent.click(bundle);

				const type = screen.getByText('% - Percentage');
				await userEvent.click(type);
				const fixedType = screen.queryByText('$ - Fixed');
				expect(fixedType).toBeInTheDocument();
				await userEvent.click(fixedType);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_type).toBe('fixed');
			});

			test('Discount Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bundle = screen.getByText('Bundle');
				await userEvent.click(bundle);

				const value = screen.getByPlaceholderText('Value');
				await userEvent.type(value, '50');
				expect(value).toHaveValue(50);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_value).toBe('50');
			});

			test('Recursive Check', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bundle = screen.getByText('Bundle');
				await userEvent.click(bundle);

				const check = screen.getByText('Recursive');
				await userEvent.click(check);

				const { discount } = store.getState();
				expect(discount.discount_rules[0].recursive).toBe('yes');
				const uncheck = screen.getByText('Recursive');
				await userEvent.click(uncheck);
				const { discount: uncheckDiscount } = store.getState();
				expect(uncheckDiscount.discount_rules[0].recursive).toBe('no');
			});

			test('Add More', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bundle = screen.getByText('Bundle');
				await userEvent.click(bundle);

				const addMore = screen.getByText('Add More');

				await userEvent.click(addMore);
				const { discount } = store.getState();
				expect(discount.discount_rules.length).toBe(2);
				const quantity = screen.getAllByPlaceholderText('Quantity');
				expect(quantity.length).toBe(2);
			});
		});
	});

	describe('BOGO Card', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const bogo = screen.getByText('BOGO');
			await userEvent.click(bogo);
			const typeLabel = screen.getByText('BOGO Type');
			const bogoType = screen.getByText('All');

			expect(typeLabel).toBeInTheDocument();
			expect(bogoType).toBeInTheDocument();
		});

		describe('Interact Correctly', () => {
			test('BOGO Type', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);
				const bogoType = screen.getByText('All');
				await userEvent.click(bogoType);
				const typeProducts = screen.queryByText('Products');
				expect(typeProducts).toBeInTheDocument();

				await userEvent.click(typeProducts);
				const { discount } = store.getState();
				expect(discount.bogo_type).toBe('products');
			});
		});
	});

	describe('BOGO Rules', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const bogo = screen.getByText('BOGO');
			await userEvent.click(bogo);

			const rulesCard = screen.getByText('BOGO Rules');
			const min = screen.getByPlaceholderText('Minimum');
			const max = screen.getByPlaceholderText('Maximum');
			const getQty = screen.getByPlaceholderText('Get Quantity');
			const type = screen.getByText('% - Percentage');
			const value = screen.getByPlaceholderText('Value');
			const recursive = screen.getByText('Recursive');
			const addMore = screen.getByText('Add More');

			expect(rulesCard).toBeInTheDocument();
			expect(min).toBeInTheDocument();
			expect(max).toBeInTheDocument();
			expect(getQty).toBeInTheDocument();
			expect(type).toBeInTheDocument();
			expect(value).toBeInTheDocument();
			expect(recursive).toBeInTheDocument();
			expect(addMore).toBeInTheDocument();
		});
		describe('Interact Correctly', () => {
			test('Minimum Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const min = screen.getByPlaceholderText('Minimum');
				await userEvent.type(min, '5');
				expect(min).toHaveValue(5);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].min).toBe('5');
			});
			test('Maximum Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const max = screen.getByPlaceholderText('Maximum');
				await userEvent.type(max, '5');
				expect(max).toHaveValue(5);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].max).toBe('5');
			});

			test('Search Product', async () => {
				renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);
				const bogoType = screen.getByText('All');
				await userEvent.click(bogoType);
				const typeProducts = screen.queryByText('Products');

				await userEvent.click(typeProducts);
				const searchInput =
					screen.getByPlaceholderText('Search Product');
				expect(searchInput).toBeInTheDocument();
			});

			test('Search Category', async () => {
				renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const bogoType = screen.getByText('All');
				await userEvent.click(bogoType);
				const typeCategories = screen.queryByText('Categories');

				await userEvent.click(typeCategories);
				const searchInput =
					screen.getByPlaceholderText('Search Category');
				expect(searchInput).toBeInTheDocument();
			});

			test('Get Quantity', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const getQty = screen.getByPlaceholderText('Get Quantity');
				await userEvent.type(getQty, '1');
				expect(getQty).toHaveValue(1);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].get_quantity).toBe('1');
			});
			test('Discount Type', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const type = screen.getByText('% - Percentage');
				await userEvent.click(type);
				const fixedType = screen.queryByText('$ - Fixed');
				expect(fixedType).toBeInTheDocument();
				await userEvent.click(fixedType);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_type).toBe('fixed');
			});

			test('Discount Value', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const value = screen.getByPlaceholderText('Value');
				await userEvent.type(value, '50');
				expect(value).toHaveValue(50);
				const { discount } = store.getState();
				expect(discount.discount_rules[0].discount_value).toBe('50');
			});

			test('Recursive Check', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const recursive = screen.getByTestId('recursive-checkbox-0');
				await userEvent.click(recursive);

				const { discount } = store.getState();
				expect(discount.discount_rules[0].recursive).toBe('yes');
				const itemQtyInput =
					screen.getByPlaceholderText('Item Quantity');
				expect(itemQtyInput).toBeInTheDocument();
			});

			test('Add More', async () => {
				const { store } = renderWithProviders(<CampaignSetup />);
				const bogo = screen.getByText('BOGO');
				await userEvent.click(bogo);

				const addMore = screen.getByText('Add More');

				await userEvent.click(addMore);
				const { discount } = store.getState();
				expect(discount.discount_rules.length).toBe(2);
				const min = screen.getAllByPlaceholderText('Minimum');
				expect(min.length).toBe(2);
			});
		});
	});

	describe('Conditions', () => {
		test('Render Correctly', async () => {
			renderWithProviders(<CampaignSetup />);
			const intent = screen.getByText('Product');
			await userEvent.click(intent);
			const heading = screen.getByText('Conditions');
			const addCondition = screen.getByText('Add Condition');

			expect(heading).toBeInTheDocument();
			expect(addCondition).toBeInTheDocument();
		});

		describe('Interact Correctly', () => {
			test('Add a Condition', async () => {
				window.scroll = jest.fn();

				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const addCondition = screen.getByText('Add Condition');

				await userEvent.click(addCondition);
				const allAddConditions = screen.getAllByText('Add Condition');
				expect(allAddConditions.length).toBe(1);
				const selectFilter = screen.getByText('Select Filter');
				expect(selectFilter).toBeInTheDocument();
				const { discount } = store.getState();
				expect(discount.conditions.length).toBe(1);
			});

			test('Select Filter', async () => {
				window.scroll = jest.fn();
				renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const addCondition = screen.getByText('Add Condition');
				await userEvent.click(addCondition);
				const selectFilter = screen.getByText('Select Filter');
				await userEvent.click(selectFilter);
				const id = screen.getByText('ID');
				expect(id).toBeInTheDocument();
			});

			test('Add Another Condition', async () => {
				window.scroll = jest.fn();
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const addCondition = screen.getByText('Add Condition');
				await userEvent.click(addCondition);
				const addAnotherCondition = screen.getByText(
					'Add Another Condition'
				);
				// const addAnotherCondition = screen.getByTestId('add-another-condition');
				await userEvent.click(addAnotherCondition);
				const { discount } = store.getState();
				expect(discount.conditions[0].base_filters.length).toBe(2);
			});

			test('Add Condition Group', async () => {
				window.scroll = jest.fn();
				const { store } = renderWithProviders(<CampaignSetup />);
				const intent = screen.getByText('Product');
				await userEvent.click(intent);
				const addCondition = screen.getByText('Add Condition');
				await userEvent.click(addCondition);
				await userEvent.click(addCondition);

				const allAddConditions = screen.getAllByText(
					'Add Another Condition'
				);
				await userEvent.click(allAddConditions[1]);
				const { discount } = store.getState();
				expect(discount.conditions.length).toBe(2);
			});
		});
	});
});
