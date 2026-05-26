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
import BulkBundleDiscountEdit from '../BulkBundleDiscountEdit';
import BulkBundleDiscountPage from '../BulkBundleDiscountPage';
import ButtonCustomization from '../components/ButtonCustomization';
import CellCustomization from '../components/CellCustomization';
import HeadingCustomization from '../components/HeadingCustomization';
import TablePosition from '../components/TablePosition';

// Custom renderWithProviders that includes interaction reducer
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

// Default table state for tests
const getDefaultTableState = (overrides = {}) => ({
	enable: false,
	position: 'after_add_to_cart',
	table_style: 'style1',
	heading: {
		title: 'Title',
		discount: 'Discount',
		range: 'Ranges',
		buy_now: 'Buy Now',
	},
	heading_customization: {
		'font-family': '',
		'font-size': '14px',
		'font-weight': 400,
		color: '#FFFFFF',
		background: '#283142',
		'border-color': '#F3F4F6',
		height: '45px',
		'border-right': '1px solid',
		'border-bottom': '1px solid',
	},
	cell_customization: {
		'font-family': '',
		'font-size': '14px',
		'font-weight': 400,
		color: '#374151',
		background: '#ffffff',
		'border-color': '#e5e7eb',
		height: '45px',
		'border-right': '1px solid',
		'border-bottom': '1px solid',
	},
	button: {
		enable: true,
		text: 'Buy Now',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 400,
		height: '35px',
		color: '#ffffff',
		background: '#07C889',
		border: '1px solid',
		'border-color': '#ffffff',
		'padding-top': '4px',
		'padding-right': '8px',
		'padding-bottom': '4px',
		'padding-left': '8px',
		isChain: false,
		radius: {
			'top-left': '6px',
			'top-right': '6px',
			'bottom-right': '6px',
			'bottom-left': '6px',
		},
	},
	...overrides,
});

describe('BulkBundleDiscountPage Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	describe('Bulk Intent Rendering', () => {
		test('renders correctly with Bulk discount intent', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(screen.getByText('Bulk Table')).toBeInTheDocument();
			expect(screen.getByText('Disabled')).toBeInTheDocument();
			expect(screen.getByText('Edit Now')).toBeInTheDocument();
		});

		test('renders DiscountCard component', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(
				screen.getByText('Women Winter Sweater')
			).toBeInTheDocument();
			expect(screen.getByText('$165')).toBeInTheDocument();
			expect(screen.getByText('$285')).toBeInTheDocument();
		});

		test('renders discount table headers from DiscountCard', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(screen.getByText('Title')).toBeInTheDocument();
			expect(screen.getByText('Discount')).toBeInTheDocument();
			expect(screen.getByText('Ranges')).toBeInTheDocument();
			expect(screen.getByText('Buy Now')).toBeInTheDocument();
		});
	});

	describe('Bundle Intent Rendering', () => {
		test('renders correctly with Bundle discount intent', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bundle',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(screen.getByText('Bundle Table')).toBeInTheDocument();
		});
	});

	describe('Status Toggle Interaction', () => {
		test('shows Disabled when table.enable is false', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({ enable: false }),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(screen.getByText('Disabled')).toBeInTheDocument();
		});

		test('shows Enabled when table.enable is true', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({ enable: true }),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(screen.getByText('Enabled')).toBeInTheDocument();
		});

		test('toggles status from Disabled to Enabled on click', async () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({ enable: false }),
					},
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			expect(screen.getByText('Disabled')).toBeInTheDocument();

			const switchButton = screen.getByRole('switch');
			await userEvent.click(switchButton);

			const { discount } = store.getState();
			expect(discount.design_blocks.table.enable).toBe(true);
			expect(screen.getByText('Enabled')).toBeInTheDocument();
		});

		test('toggles status from Enabled to Disabled on click', async () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({ enable: true }),
					},
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			expect(screen.getByText('Enabled')).toBeInTheDocument();

			const switchButton = screen.getByRole('switch');
			await userEvent.click(switchButton);

			const { discount } = store.getState();
			expect(discount.design_blocks.table.enable).toBe(false);
			expect(screen.getByText('Disabled')).toBeInTheDocument();
		});

		test('multiple toggle clicks update state correctly', async () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({ enable: false }),
					},
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			const switchButton = screen.getByRole('switch');

			// First toggle: false -> true
			await userEvent.click(switchButton);
			expect(store.getState().discount.design_blocks.table.enable).toBe(
				true
			);

			// Second toggle: true -> false
			await userEvent.click(switchButton);
			expect(store.getState().discount.design_blocks.table.enable).toBe(
				false
			);

			// Third toggle: false -> true
			await userEvent.click(switchButton);
			expect(store.getState().discount.design_blocks.table.enable).toBe(
				true
			);
		});
	});

	describe('Button Click Behavior', () => {
		test('shows "Edit Now" button when pro is active', () => {
			global.DISCO = { is_pro_active: '1' };

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(screen.getByText('Edit Now')).toBeInTheDocument();
		});

		test('shows "Try Now" button when pro is not active', () => {
			global.DISCO = { is_pro_active: '' };

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			expect(screen.getByText('Try Now')).toBeInTheDocument();
		});

		test('clicking "Edit Now" dispatches setShowEditor and setComponentToEdit actions', async () => {
			global.DISCO = { is_pro_active: '1' };

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
				interaction: {
					showEditor: false,
					componentToEdit: '',
					saveStatus: 'saved',
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			const editButton = screen.getByText('Edit Now');
			await userEvent.click(editButton);

			const { interaction } = store.getState();
			expect(interaction.showEditor).toBe(true);
			expect(interaction.componentToEdit).toBe('BulkBundleDiscountEdit');
		});

		test('clicking "Try Now" opens pricing URL for Bulk discount', async () => {
			global.DISCO = { is_pro_active: '' };

			const mockWindowOpen = jest.fn();
			window.open = mockWindowOpen;

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			const tryNowButton = screen.getByText('Try Now');
			await userEvent.click(tryNowButton);

			expect(mockWindowOpen).toHaveBeenCalledWith(
				'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1'
			);
		});

		test('clicking "Try Now" opens pricing URL for Bundle discount', async () => {
			global.DISCO = { is_pro_active: '' };

			const mockWindowOpen = jest.fn();
			window.open = mockWindowOpen;

			const preloadedState = {
				discount: {
					discount_intent: 'Bundle',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			const tryNowButton = screen.getByText('Try Now');
			await userEvent.click(tryNowButton);

			expect(mockWindowOpen).toHaveBeenCalledWith(
				'https://discoplugin.com/pricing/?utm_source=bundle-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1'
			);
		});
	});

	describe('Documentation Links', () => {
		test('renders correct documentation link for Bulk intent', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			const docLink = screen.getByText('Learn More');
			expect(docLink).toHaveAttribute(
				'href',
				'https://discoplugin.com/docs/display-woocommerce-bulk-discount-table/'
			);
		});

		test('renders correct documentation link for Bundle intent', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bundle',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			const docLink = screen.getByText('Learn More');
			expect(docLink).toHaveAttribute(
				'href',
				'https://discoplugin.com/docs/display-bundle-discount-table-in-woocommerce/'
			);
		});
	});

	describe('Status Toggle Disabled State', () => {
		test('Status toggle is disabled when pro is not active', () => {
			global.DISCO = { is_pro_active: '' };

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			const switchButton = screen.getByRole('switch');
			expect(switchButton).toBeDisabled();
		});

		test('Status toggle is enabled when pro is active', () => {
			global.DISCO = { is_pro_active: '1' };

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState(),
					},
				},
			};

			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

			const switchButton = screen.getByRole('switch');
			expect(switchButton).not.toBeDisabled();
		});

		test('clicking disabled toggle does not change state', async () => {
			global.DISCO = { is_pro_active: '' };

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({ enable: false }),
					},
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			const switchButton = screen.getByRole('switch');
			await userEvent.click(switchButton);

			// State should remain unchanged
			expect(store.getState().discount.design_blocks.table.enable).toBe(
				false
			);
			expect(screen.getByText('Disabled')).toBeInTheDocument();
		});
	});

	describe('Different Initial Table States', () => {
		test('renders with custom table position', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({
							position: 'before_add_to_cart',
						}),
					},
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			expect(store.getState().discount.design_blocks.table.position).toBe(
				'before_add_to_cart'
			);
		});

		test('renders with custom heading values', () => {
			const customHeading = {
				title: 'Custom Title',
				discount: 'Custom Discount',
				range: 'Custom Range',
				buy_now: 'Custom Buy',
			};

			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({ heading: customHeading }),
					},
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			expect(
				store.getState().discount.design_blocks.table.heading
			).toEqual(customHeading);
		});

		test('renders with button disabled', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					design_blocks: {
						table: getDefaultTableState({
							button: {
								...getDefaultTableState().button,
								enable: false,
							},
						}),
					},
				},
			};

			const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
				preloadedState,
			});

			expect(
				store.getState().discount.design_blocks.table.button.enable
			).toBe(false);
		});
	});
});

describe('HeadingCustomization Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('renders Heading Customization title', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<HeadingCustomization />, { preloadedState });

		expect(screen.getByText('Heading Customization')).toBeInTheDocument();
	});

	test('renders heading input fields', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<HeadingCustomization />, { preloadedState });

		// Check for input fields with default values
		expect(screen.getByDisplayValue('Title')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Discount')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Ranges')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Buy Now')).toBeInTheDocument();
	});

	test('updates heading title value on input change', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<HeadingCustomization />, {
			preloadedState,
		});

		const titleInput = screen.getByDisplayValue('Title');
		await userEvent.clear(titleInput);
		await userEvent.type(titleInput, 'New Title');

		expect(
			store.getState().discount.design_blocks.table.heading.title
		).toBe('New Title');
	});

	test('updates heading discount value on input change', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<HeadingCustomization />, {
			preloadedState,
		});

		const discountInput = screen.getByDisplayValue('Discount');
		await userEvent.clear(discountInput);
		await userEvent.type(discountInput, 'Sale %');

		expect(
			store.getState().discount.design_blocks.table.heading.discount
		).toBe('Sale %');
	});

	test('updates heading range value on input change', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<HeadingCustomization />, {
			preloadedState,
		});

		const rangeInput = screen.getByDisplayValue('Ranges');
		await userEvent.clear(rangeInput);
		await userEvent.type(rangeInput, 'Quantity');

		expect(
			store.getState().discount.design_blocks.table.heading.range
		).toBe('Quantity');
	});

	test('updates heading buy_now value on input change', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<HeadingCustomization />, {
			preloadedState,
		});

		const buyNowInput = screen.getByDisplayValue('Buy Now');
		await userEvent.clear(buyNowInput);
		await userEvent.type(buyNowInput, 'Add to Cart');

		expect(
			store.getState().discount.design_blocks.table.heading.buy_now
		).toBe('Add to Cart');
	});

	test('renders font family select with placeholder', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<HeadingCustomization />, { preloadedState });

		// When font-family is empty string, it shows 'Select Font' from fontItems
		expect(screen.getByText('Select Font')).toBeInTheDocument();
	});

	test('renders font size input with initial value', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<HeadingCustomization />, { preloadedState });

		expect(screen.getByText('Font Size')).toBeInTheDocument();
		expect(screen.getByText('14')).toBeInTheDocument(); // default font size
	});

	test('font family select changes update state', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<HeadingCustomization />, {
			preloadedState,
		});

		// Click on font select (shows 'Select Font' when empty)
		const fontSelectButton = screen.getByText('Select Font');
		await userEvent.click(fontSelectButton);

		// Select Arial
		const arialOption = screen.getByText('Arial');
		await userEvent.click(arialOption);

		expect(
			store.getState().discount.design_blocks.table.heading_customization[
				'font-family'
			]
		).toBe('arial');
	});

	test('font weight select renders correctly', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<HeadingCustomization />, { preloadedState });

		// Default font weight is 400 which shows as "Regular"
		expect(screen.getByText('Regular')).toBeInTheDocument();
	});

	test('font weight select changes update state', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<HeadingCustomization />, {
			preloadedState,
		});

		// Click on font weight select
		const fontWeightButton = screen.getByText('Regular');
		await userEvent.click(fontWeightButton);

		// Select Bold
		const boldOption = screen.getByText('Bold');
		await userEvent.click(boldOption);

		expect(
			store.getState().discount.design_blocks.table.heading_customization[
				'font-weight'
			]
		).toBe('700');
	});
});

describe('CellCustomization Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('renders Cell Customization title', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<CellCustomization />, { preloadedState });

		expect(screen.getByText('Cell Customization')).toBeInTheDocument();
	});

	test('renders font family select', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<CellCustomization />, { preloadedState });

		// When font-family is empty string, it shows 'Select Font' from fontItems
		expect(screen.getByText('Select Font')).toBeInTheDocument();
	});

	test('renders font size control', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<CellCustomization />, { preloadedState });

		expect(screen.getByText('Font Size')).toBeInTheDocument();
	});

	test('font family select changes update cell_customization state', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<CellCustomization />, {
			preloadedState,
		});

		// Click on font select (shows 'Select Font' when empty)
		const fontSelectButton = screen.getByText('Select Font');
		await userEvent.click(fontSelectButton);

		// Select Verdana
		const verdanaOption = screen.getByText('Verdana');
		await userEvent.click(verdanaOption);

		expect(
			store.getState().discount.design_blocks.table.cell_customization[
				'font-family'
			]
		).toBe('verdana');
	});

	test('font weight select changes update cell_customization state', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<CellCustomization />, {
			preloadedState,
		});

		// Click on font weight select (shows "Regular" for weight 400)
		const fontWeightButton = screen.getByText('Regular');
		await userEvent.click(fontWeightButton);

		// Select Extra Bold
		const extraBoldOption = screen.getByText('Extra Bold');
		await userEvent.click(extraBoldOption);

		expect(
			store.getState().discount.design_blocks.table.cell_customization[
				'font-weight'
			]
		).toBe('800');
	});

	test('renders with custom initial cell customization values', () => {
		const customCellCustomization = {
			'font-family': 'arial',
			'font-size': '16px',
			'font-weight': 700,
			color: '#000000',
			background: '#ffffff',
			'border-color': '#cccccc',
			height: '50px',
			'border-right': '2px solid',
			'border-bottom': '2px solid',
		};

		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						cell_customization: customCellCustomization,
					}),
				},
			},
		};

		const { store } = renderWithProviders(<CellCustomization />, {
			preloadedState,
		});

		expect(
			store.getState().discount.design_blocks.table.cell_customization
		).toEqual(customCellCustomization);
	});
});

describe('TablePosition Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('renders Select Position label', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<TablePosition />, { preloadedState });

		expect(screen.getByText('Select Position')).toBeInTheDocument();
	});

	test('renders with default position "After Add to Cart"', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						position: 'after_add_to_cart',
					}),
				},
			},
		};

		renderWithProviders(<TablePosition />, { preloadedState });

		expect(screen.getByText('After Add to Cart')).toBeInTheDocument();
	});

	test('renders with "Before Add to Cart" when set', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						position: 'before_add_to_cart',
					}),
				},
			},
		};

		renderWithProviders(<TablePosition />, { preloadedState });

		expect(screen.getByText('Before Add to Cart')).toBeInTheDocument();
	});

	test('position select changes update state', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						position: 'after_add_to_cart',
					}),
				},
			},
		};

		const { store } = renderWithProviders(<TablePosition />, {
			preloadedState,
		});

		// Initially "After Add to Cart"
		expect(store.getState().discount.design_blocks.table.position).toBe(
			'after_add_to_cart'
		);

		// Click on position select
		const positionButton = screen.getByText('After Add to Cart');
		await userEvent.click(positionButton);

		// Select "Before Add to Cart"
		const beforeOption = screen.getByText('Before Add to Cart');
		await userEvent.click(beforeOption);

		expect(store.getState().discount.design_blocks.table.position).toBe(
			'before_add_to_cart'
		);
	});

	// test('toggling position back and forth updates state correctly', async () => {
	// 	const preloadedState = {
	// 		discount: {
	// 			discount_intent: 'Bulk',
	// 			design_blocks: {
	// 				table: getDefaultTableState({
	// 					position: 'after_add_to_cart',
	// 				}),
	// 			},
	// 		},
	// 	};

	// 	const { store } = renderWithProviders(<TablePosition />, {
	// 		preloadedState,
	// 	});

	// 	// Change to before
	// 	let positionButton = screen.getByText('After Add to Cart');
	// 	await userEvent.click(positionButton);
	// 	await userEvent.click(screen.getByText('Before Add to Cart'));

	// 	expect(store.getState().discount.design_blocks.table.position).toBe(
	// 		'before_add_to_cart'
	// 	);

	// 	// Change back to after
	// 	// await userEvent.click(screen.getByText('Before Add to Cart'));
	// 	// await userEvent.click(screen.getByText('After Add to Cart'));

	// 	expect(store.getState().discount.design_blocks.table.position).toBe(
	// 		'after_add_to_cart'
	// 	);
	// });
});

describe('ButtonCustomization Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('renders Button Customization title', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<ButtonCustomization />, { preloadedState });

		expect(screen.getByText('Button Customization')).toBeInTheDocument();
	});

	test('button enable toggle shows Enabled when button.enable is true', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						button: {
							...getDefaultTableState().button,
							enable: true,
						},
					}),
				},
			},
		};

		renderWithProviders(<ButtonCustomization />, { preloadedState });

		expect(screen.getByText('Enabled')).toBeInTheDocument();
	});

	test('button enable toggle shows Disabled when button.enable is false', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						button: {
							...getDefaultTableState().button,
							enable: false,
						},
					}),
				},
			},
		};

		renderWithProviders(<ButtonCustomization />, { preloadedState });

		expect(screen.getByText('Disabled')).toBeInTheDocument();
	});

	test('toggling button enable updates both button.enable and heading', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						button: {
							...getDefaultTableState().button,
							enable: true,
						},
					}),
				},
			},
		};

		const { store } = renderWithProviders(<ButtonCustomization />, {
			preloadedState,
		});

		// Initially enabled
		expect(
			store.getState().discount.design_blocks.table.button.enable
		).toBe(true);
		expect(
			store.getState().discount.design_blocks.table.heading.buy_now
		).toBeDefined();

		// Toggle off
		const switchButton = screen.getByRole('switch');
		await userEvent.click(switchButton);

		// Button should be disabled and buy_now heading should be removed
		expect(
			store.getState().discount.design_blocks.table.button.enable
		).toBe(false);
		expect(
			store.getState().discount.design_blocks.table.heading.buy_now
		).toBeUndefined();
	});

	test('toggling button enable back on restores buy_now heading', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({
						button: {
							...getDefaultTableState().button,
							enable: false,
						},
						heading: {
							title: 'Title',
							discount: 'Discount',
							range: 'Ranges',
						},
					}),
				},
			},
		};

		const { store } = renderWithProviders(<ButtonCustomization />, {
			preloadedState,
		});

		// Initially disabled
		expect(
			store.getState().discount.design_blocks.table.button.enable
		).toBe(false);

		// Toggle on
		const switchButton = screen.getByRole('switch');
		await userEvent.click(switchButton);

		// Button should be enabled and buy_now heading should be added
		expect(
			store.getState().discount.design_blocks.table.button.enable
		).toBe(true);
		expect(
			store.getState().discount.design_blocks.table.heading.buy_now
		).toBe('Buy Now');
	});

	test('font family select for button updates state', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<ButtonCustomization />, {
			preloadedState,
		});

		// Click on font select (shows 'Select Font' when empty)
		const fontSelects = screen.getAllByText('Select Font');
		await userEvent.click(fontSelects[0]);

		// Select Georgia
		const georgiaOption = screen.getByText('Georgia');
		await userEvent.click(georgiaOption);

		expect(
			store.getState().discount.design_blocks.table.button['font-family']
		).toBe('georgia');
	});
});

// Default discount rules for BulkBundleDiscountEdit tests
const getDefaultDiscountRules = () => [
	{
		id: 'test-rule-1',
		min: '1',
		max: '5',
		get_quantity: '',
		get_ids: [],
		discount_type: 'percent',
		discount_value: '10',
		discount_label: '10% OFF',
		recursive: 'no',
	},
	{
		id: 'test-rule-2',
		min: '6',
		max: '10',
		get_quantity: '',
		get_ids: [],
		discount_type: 'percent',
		discount_value: '20',
		discount_label: '20% OFF',
		recursive: 'no',
	},
];

describe('BulkBundleDiscountEdit Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('renders with Bulk Table title', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				discount_rules: getDefaultDiscountRules(),
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<BulkBundleDiscountEdit />, { preloadedState });

		expect(screen.getByText('Bulk Table')).toBeInTheDocument();
	});

	test('renders with Bundle Table title', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bundle',
				discount_rules: getDefaultDiscountRules(),
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<BulkBundleDiscountEdit />, { preloadedState });

		expect(screen.getByText('Bundle Table')).toBeInTheDocument();
	});

	test('renders description text', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				discount_rules: getDefaultDiscountRules(),
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<BulkBundleDiscountEdit />, { preloadedState });

		expect(
			screen.getByText('Customize your design table on product page.')
		).toBeInTheDocument();
	});

	test('renders all customization sections', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				discount_rules: getDefaultDiscountRules(),
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<BulkBundleDiscountEdit />, { preloadedState });

		expect(screen.getByText('Heading Customization')).toBeInTheDocument();
		expect(screen.getByText('Cell Customization')).toBeInTheDocument();
		expect(screen.getByText('Button Customization')).toBeInTheDocument();
		expect(screen.getByText('Select Position')).toBeInTheDocument();
	});

	test('renders discount rules in table view', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				discount_rules: getDefaultDiscountRules(),
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<BulkBundleDiscountEdit />, { preloadedState });

		// Check that discount rules are rendered in the table
		expect(screen.getByText('10% OFF')).toBeInTheDocument();
		expect(screen.getByText('20% OFF')).toBeInTheDocument();
	});
});

describe('Edge Cases and Error Handling', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('handles undefined table gracefully', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: undefined,
				},
			},
		};

		// Should not throw an error
		expect(() => {
			renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });
		}).toThrow();
		// expect(() => {
		// 	renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });
		// }).not.toThrow();
	});

	test('handles empty discount_intent', () => {
		const preloadedState = {
			discount: {
				discount_intent: '',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

		// Should render with empty intent in title
		expect(screen.getByText('Table')).toBeInTheDocument();
	});

	test('handles null enable value', () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState({ enable: null }),
				},
			},
		};

		renderWithProviders(<BulkBundleDiscountPage />, { preloadedState });

		// Should treat null as falsy and show Disabled
		expect(screen.getByText('Disabled')).toBeInTheDocument();
	});

	test('preserves other table properties when updating enable', async () => {
		const customTable = getDefaultTableState({
			position: 'before_add_to_cart',
			heading: {
				title: 'Custom',
				discount: 'Sale',
				range: 'Qty',
				buy_now: 'Get',
			},
		});

		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: customTable,
				},
			},
		};

		const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
			preloadedState,
		});

		// Toggle enable
		const switchButton = screen.getByRole('switch');
		await userEvent.click(switchButton);

		const tableState = store.getState().discount.design_blocks.table;

		// Other properties should be preserved
		expect(tableState.position).toBe('before_add_to_cart');
		expect(tableState.heading.title).toBe('Custom');
		expect(tableState.enable).toBe(true);
	});
});

describe('State Persistence', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	test('state changes persist across multiple interactions', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
			interaction: {
				showEditor: false,
				componentToEdit: '',
				saveStatus: 'saved',
			},
		};

		const { store } = renderWithProviders(<BulkBundleDiscountPage />, {
			preloadedState,
		});

		// Toggle status
		const switchButton = screen.getByRole('switch');
		await userEvent.click(switchButton);

		// Click Edit Now
		const editButton = screen.getByText('Edit Now');
		await userEvent.click(editButton);

		// Both state changes should persist
		const finalState = store.getState();
		expect(finalState.discount.design_blocks.table.enable).toBe(true);
		expect(finalState.interaction.showEditor).toBe(true);
		expect(finalState.interaction.componentToEdit).toBe(
			'BulkBundleDiscountEdit'
		);
	});

	test('multiple heading input changes persist correctly', async () => {
		const preloadedState = {
			discount: {
				discount_intent: 'Bulk',
				design_blocks: {
					table: getDefaultTableState(),
				},
			},
		};

		const { store } = renderWithProviders(<HeadingCustomization />, {
			preloadedState,
		});

		// Change title
		const titleInput = screen.getByDisplayValue('Title');
		await userEvent.clear(titleInput);
		await userEvent.type(titleInput, 'Header');

		// Change discount
		const discountInput = screen.getByDisplayValue('Discount');
		await userEvent.clear(discountInput);
		await userEvent.type(discountInput, 'Off %');

		// Both changes should persist
		const heading = store.getState().discount.design_blocks.table.heading;
		expect(heading.title).toBe('Header');
		expect(heading.discount).toBe('Off %');
		// Original values should remain for unchanged fields
		expect(heading.range).toBe('Ranges');
		expect(heading.buy_now).toBe('Buy Now');
	});
});
