import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router';
import { apiSlice } from '../../../../../../features/api/apiSlice';
import campaignReducer from '../../../../../../features/campaigns/campaignSlice';
import discountReducer from '../../../../../../features/discount/discountSlice';
import interactionReducer from '../../../../../../features/interaction/interactionSlice';
import {
	getConditionValue,
	getDynamicVariables,
} from '../../../../../../utilities/cart-banner-design';
import CartPage from '../CartPage';
import BannerTextInput from '../components/BannerTextInput';

// Custom renderWithProviders
function renderWithProviders(
	ui,
	{
		preloadedState = {},
		store = configureStore({
			reducer: {
				[apiSlice.reducerPath]: apiSlice.reducer,
				discount: discountReducer,
				interaction: interactionReducer,
				campaignState: campaignReducer,
			},
			preloadedState,
			middleware: (getDefaultMiddleware) =>
				getDefaultMiddleware().concat(apiSlice.middleware),
		}),
		...renderOptions
	} = {}
) {
	function Wrapper({ children }) {
		return (
			<Provider store={store}>
				<HashRouter basename="/">{children}</HashRouter>
			</Provider>
		);
	}

	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Default cart state for tests
const getDefaultCartState = (overrides = {}) => ({
	enable: false,
	design_type: 'notice',
	selected_design: 'banner1',
	banner: {
		text: '[discounted_percentage] OFF - Limited Time!',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background: '#07C889',
		'border-color': '#07C889',
		icon_color: '#ffffff',
		border: 0,
		height: '45px',
		isChain: false,
		radius: {
			'top-left': '8px',
			'top-right': '8px',
			'bottom-right': '8px',
			'bottom-left': '8px',
		},
		button: {
			enable: true,
			text: 'Shop Now',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#07C889',
			background: '#ffffff',
			'border-color': '#ffffff',
			border: 0,
			height: '35px',
			width: '100px',
			isChain: false,
			radius: {
				'top-left': '4px',
				'top-right': '4px',
				'bottom-right': '4px',
				'bottom-left': '4px',
			},
		},
	},
	checkout_message: {
		enable: true,
		text: 'You have saved [discounted_amount] on this order',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 400,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#16a34a',
	},
	savings_badge: {
		enable: true,
		text: 'SAVE [Amount]',
		bg_color: '#ef4444',
		text_color: '#ffffff',
		'font-size': '12px',
	},
	...overrides,
});

// Default discount rules
const getDefaultDiscountRules = (overrides = {}) => [
	{
		id: 'test-rule-1',
		min: '',
		max: '',
		get_quantity: '',
		get_ids: [],
		discount_type: 'percent',
		discount_value: '20',
		discount_label: '',
		recursive: 'no',
		...overrides,
	},
];

describe('CartPage Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		test('renders correctly with Cart discount intent', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState(),
					},
				},
			};

			renderWithProviders(<CartPage />, { preloadedState });

			expect(screen.getByText('Cart Notice')).toBeInTheDocument();
			expect(screen.getByText('Disabled')).toBeInTheDocument();
			expect(screen.getByText('Edit Now')).toBeInTheDocument();
		});

		test('renders with different discount intent', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState(),
					},
				},
			};

			renderWithProviders(<CartPage />, { preloadedState });

			expect(screen.getByText('Cart Notice')).toBeInTheDocument();
		});
	});

	describe('Status Toggle', () => {
		test('shows Disabled when cart.enable is false', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState({ enable: false }),
					},
				},
			};

			renderWithProviders(<CartPage />, { preloadedState });

			expect(screen.getByText('Disabled')).toBeInTheDocument();
		});

		test('shows Enabled when cart.enable is true', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState({ enable: true }),
					},
				},
			};

			renderWithProviders(<CartPage />, { preloadedState });

			expect(screen.getByText('Enabled')).toBeInTheDocument();
		});

		test('toggles status from Disabled to Enabled on click', async () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState({ enable: false }),
					},
				},
			};

			const { store } = renderWithProviders(<CartPage />, {
				preloadedState,
			});

			expect(screen.getByText('Disabled')).toBeInTheDocument();

			const switchButton = screen.getByRole('switch');
			await userEvent.click(switchButton);

			const { discount } = store.getState();
			expect(discount.design_blocks.cart.enable).toBe(true);
			expect(screen.getByText('Enabled')).toBeInTheDocument();
		});

		test('Status toggle is disabled when pro is not active', () => {
			global.DISCO = { is_pro_active: '' };

			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState(),
					},
				},
			};

			renderWithProviders(<CartPage />, { preloadedState });

			const switchButton = screen.getByRole('switch');
			expect(switchButton).toBeDisabled();
		});
	});

	describe('Button Click Behavior', () => {
		test('shows "Edit Now" button when pro is active', () => {
			global.DISCO = { is_pro_active: '1' };

			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState(),
					},
				},
			};

			renderWithProviders(<CartPage />, { preloadedState });

			expect(screen.getByText('Edit Now')).toBeInTheDocument();
		});

		test('clicking "Edit Now" dispatches setShowEditor and setComponentToEdit actions', async () => {
			global.DISCO = { is_pro_active: '1' };

			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState(),
					},
				},
				interaction: {
					showEditor: false,
					componentToEdit: '',
					saveStatus: 'saved',
				},
			};

			const { store } = renderWithProviders(<CartPage />, {
				preloadedState,
			});

			const editButton = screen.getByText('Edit Now');
			await userEvent.click(editButton);

			const { interaction } = store.getState();
			expect(interaction.showEditor).toBe(true);
			expect(interaction.componentToEdit).toBe('CartPageEdit');
		});

		test('clicking button when pro is not active opens pricing URL', async () => {
			global.DISCO = { is_pro_active: '' };

			const mockWindowOpen = jest.fn();
			window.open = mockWindowOpen;

			const preloadedState = {
				discount: {
					discount_intent: 'Cart',
					discount_rules: getDefaultDiscountRules(),
					design_blocks: {
						cart: getDefaultCartState(),
					},
				},
			};

			renderWithProviders(<CartPage />, { preloadedState });

			const button = screen.getByText('Try Now');
			await userEvent.click(button);

			expect(mockWindowOpen).toHaveBeenCalledWith(
				'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1'
			);
		});
	});
});

describe('getDynamicVariables Utility', () => {
	test('returns discounted_percentage for percent discount type', () => {
		const discount_intent = 'Cart';
		const discount_rules = [
			{ discount_type: 'percent', discount_value: '25' },
		];
		const conditions = [];

		const result = getDynamicVariables(
			discount_intent,
			discount_rules,
			conditions
		);

		expect(result).toEqual([
			{ label: 'discounted_percentage', example: '25%' },
		]);
	});

	test('returns discounted_amount for fixed discount type', () => {
		const discount_intent = 'Cart';
		const discount_rules = [
			{ discount_type: 'fixed', discount_value: '10' },
		];
		const conditions = [];

		const result = getDynamicVariables(
			discount_intent,
			discount_rules,
			conditions
		);

		expect(result).toEqual([
			{ label: 'discounted_amount', example: '$10' },
		]);
	});

	test('returns default percentage when no discount rules', () => {
		const discount_intent = 'Cart';
		const discount_rules = [];
		const conditions = [];

		const result = getDynamicVariables(
			discount_intent,
			discount_rules,
			conditions
		);

		expect(result).toEqual([
			{ label: 'discounted_percentage', example: '20%' },
		]);
	});

	test('includes remaining_quantity when cart_items_quantity condition is set', () => {
		const discount_intent = 'Cart';
		const discount_rules = [
			{ discount_type: 'percent', discount_value: '15' },
		];
		const conditions = [
			{
				id: 'group-1',
				base_filters: [
					{ compare_with: 'cart_items_quantity', compare: '5' },
				],
			},
		];

		const result = getDynamicVariables(
			discount_intent,
			discount_rules,
			conditions
		);

		expect(result).toContainEqual({
			label: 'remaining_quantity',
			example: '5',
		});
	});

	test('includes remaining_amount when cart_subtotal condition is set', () => {
		const discount_intent = 'Cart';
		const discount_rules = [
			{ discount_type: 'percent', discount_value: '15' },
		];
		const conditions = [
			{
				id: 'group-1',
				base_filters: [
					{ compare_with: 'cart_subtotal', compare: '100' },
				],
			},
		];

		const result = getDynamicVariables(
			discount_intent,
			discount_rules,
			conditions
		);

		expect(result).toContainEqual({
			label: 'remaining_amount',
			example: '$100',
		});
	});

	test('includes remaining_cart_items when cart_items_count condition is set', () => {
		const discount_intent = 'Cart';
		const discount_rules = [
			{ discount_type: 'percent', discount_value: '15' },
		];
		const conditions = [
			{
				id: 'group-1',
				base_filters: [
					{ compare_with: 'cart_items_count', compare: '3' },
				],
			},
		];

		const result = getDynamicVariables(
			discount_intent,
			discount_rules,
			conditions
		);

		expect(result).toContainEqual({
			label: 'remaining_cart_items',
			example: '3',
		});
	});

	test('includes all dynamic variables when all conditions are set', () => {
		const discount_intent = 'Cart';
		const discount_rules = [
			{ discount_type: 'fixed', discount_value: '50' },
		];
		const conditions = [
			{
				id: 'group-1',
				base_filters: [
					{ compare_with: 'cart_items_quantity', compare: '10' },
					{ compare_with: 'cart_subtotal', compare: '200' },
					{ compare_with: 'cart_items_count', compare: '5' },
				],
			},
		];

		const result = getDynamicVariables(
			discount_intent,
			discount_rules,
			conditions
		);

		expect(result).toHaveLength(4);
		expect(result).toContainEqual({
			label: 'discounted_amount',
			example: '$50',
		});
		expect(result).toContainEqual({
			label: 'remaining_quantity',
			example: '10',
		});
		expect(result).toContainEqual({
			label: 'remaining_amount',
			example: '$200',
		});
		expect(result).toContainEqual({
			label: 'remaining_cart_items',
			example: '5',
		});
	});
});

describe('getConditionValue Utility', () => {
	test('returns null when conditions is empty', () => {
		const conditions = [];
		const result = getConditionValue(conditions, 'cart_subtotal');
		expect(result).toBeNull();
	});

	test('returns null when filter not found', () => {
		const conditions = [
			{
				id: 'group-1',
				base_filters: [
					{ compare_with: 'other_filter', compare: '100' },
				],
			},
		];
		const result = getConditionValue(conditions, 'cart_subtotal');
		expect(result).toBeNull();
	});

	test('returns compare value when filter is found', () => {
		const conditions = [
			{
				id: 'group-1',
				base_filters: [
					{ compare_with: 'cart_subtotal', compare: '150' },
				],
			},
		];
		const result = getConditionValue(conditions, 'cart_subtotal');
		expect(result).toBe('150');
	});

	test('returns first match from multiple groups', () => {
		const conditions = [
			{
				id: 'group-1',
				base_filters: [{ compare_with: 'other_filter', compare: '50' }],
			},
			{
				id: 'group-2',
				base_filters: [
					{ compare_with: 'cart_subtotal', compare: '200' },
				],
			},
		];
		const result = getConditionValue(conditions, 'cart_subtotal');
		expect(result).toBe('200');
	});
});

describe('BannerTextInput Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('renders textarea with value', () => {
		const preloadedState = {
			discount: {
				discount_rules: getDefaultDiscountRules(),
				conditions: [],
				design_blocks: {
					cart: getDefaultCartState(),
				},
			},
		};

		renderWithProviders(
			<BannerTextInput value="Test banner text" onChange={() => {}} />,
			{ preloadedState }
		);

		expect(
			screen.getByDisplayValue('Test banner text')
		).toBeInTheDocument();
	});

	test('shows discounted_percentage hint for percent discount type', () => {
		const preloadedState = {
			discount: {
				discount_rules: [
					{ discount_type: 'percent', discount_value: '30' },
				],
				conditions: [],
				design_blocks: {
					cart: getDefaultCartState(),
				},
			},
		};

		renderWithProviders(<BannerTextInput value="" onChange={() => {}} />, {
			preloadedState,
		});

		expect(screen.getByText('[discounted_percentage]')).toBeInTheDocument();
		expect(screen.getByText('30%')).toBeInTheDocument();
	});

	test('shows discounted_amount hint for fixed discount type', () => {
		const preloadedState = {
			discount: {
				discount_rules: [
					{ discount_type: 'fixed', discount_value: '15' },
				],
				conditions: [],
				design_blocks: {
					cart: getDefaultCartState(),
				},
			},
		};

		renderWithProviders(<BannerTextInput value="" onChange={() => {}} />, {
			preloadedState,
		});

		expect(screen.getByText('[discounted_amount]')).toBeInTheDocument();
		expect(screen.getByText('$15')).toBeInTheDocument();
	});

	test('shows remaining_quantity hint when condition is set', () => {
		const preloadedState = {
			discount: {
				discount_rules: getDefaultDiscountRules(),
				conditions: [
					{
						id: 'group-1',
						base_filters: [
							{
								compare_with: 'cart_items_quantity',
								compare: '8',
							},
						],
					},
				],
				design_blocks: {
					cart: getDefaultCartState(),
				},
			},
		};

		renderWithProviders(<BannerTextInput value="" onChange={() => {}} />, {
			preloadedState,
		});

		expect(screen.getByText('[remaining_quantity]')).toBeInTheDocument();
		expect(screen.getByText('8')).toBeInTheDocument();
	});

	test('does not show remaining hints when conditions are not set', () => {
		const preloadedState = {
			discount: {
				discount_rules: getDefaultDiscountRules(),
				conditions: [],
				design_blocks: {
					cart: getDefaultCartState(),
				},
			},
		};

		renderWithProviders(<BannerTextInput value="" onChange={() => {}} />, {
			preloadedState,
		});

		expect(
			screen.queryByText('[remaining_quantity]')
		).not.toBeInTheDocument();
		expect(
			screen.queryByText('[remaining_amount]')
		).not.toBeInTheDocument();
		expect(
			screen.queryByText('[remaining_cart_items]')
		).not.toBeInTheDocument();
	});

	test('calls onChange when textarea value changes', async () => {
		const mockOnChange = jest.fn();
		const preloadedState = {
			discount: {
				discount_rules: getDefaultDiscountRules(),
				conditions: [],
				design_blocks: {
					cart: getDefaultCartState(),
				},
			},
		};

		renderWithProviders(
			<BannerTextInput value="" onChange={mockOnChange} />,
			{ preloadedState }
		);

		const textarea = screen.getByRole('textbox');
		await userEvent.type(textarea, 'New text');

		expect(mockOnChange).toHaveBeenCalled();
	});

	test('renders emoji picker button', () => {
		const preloadedState = {
			discount: {
				discount_rules: getDefaultDiscountRules(),
				conditions: [],
				design_blocks: {
					cart: getDefaultCartState(),
				},
			},
		};

		renderWithProviders(<BannerTextInput value="" onChange={() => {}} />, {
			preloadedState,
		});

		expect(screen.getByText('😊')).toBeInTheDocument();
	});
});

describe('Edge Cases', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('handles undefined cart gracefully', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Cart',
				discount_rules: getDefaultDiscountRules(),
				design_blocks: {
					cart: undefined,
				},
			},
		};

		expect(() => {
			renderWithProviders(<CartPage />, { preloadedState });
		}).not.toThrow();
	});

	test('handles null discount_rules gracefully', () => {
		const result = getDynamicVariables('Cart', null, []);
		expect(result).toHaveLength(1);
		expect(result[0].label).toBe('discounted_percentage');
	});

	test('handles undefined conditions gracefully', () => {
		const result = getDynamicVariables(
			'Cart',
			[{ discount_type: 'percent', discount_value: '10' }],
			undefined
		);
		expect(result).toHaveLength(1);
	});

	test('handles empty discount_value', () => {
		const result = getDynamicVariables(
			'Cart',
			[{ discount_type: 'percent', discount_value: '' }],
			[]
		);
		expect(result[0].example).toBe('20%'); // Default fallback
	});
});
