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
import TextHighlight from '../TextHighlight';

// ─── Mock Child Components ──────────────────────────────────────

jest.mock('../components/TextHighlightCard', () => {
	return function MockTextHighlightCard() {
		return <div data-testid="text-highlight-card">TextHighlightCard</div>;
	};
});

jest.mock('../../components/BadgeActions', () => {
	return function MockBadgeActions({ children }) {
		return <div data-testid="badge-actions">{children}</div>;
	};
});

jest.mock('../../components/BadgeComponentContainer', () => {
	return function MockBadgeComponentContainer({ children }) {
		return <div data-testid="badge-component-container">{children}</div>;
	};
});

jest.mock('../../components/BadgeTitle', () => {
	return function MockBadgeTitle({ title, className }) {
		return (
			<div data-testid="badge-title" className={className}>
				{title}
			</div>
		);
	};
});

jest.mock('../../components/Status', () => {
	return function MockStatus({ status, handleStatus }) {
		return (
			<button
				data-testid="status-toggle"
				data-status={String(status)}
				onClick={() => handleStatus(!status)}
			>
				Status: {status ? 'Enabled' : 'Disabled'}
			</button>
		);
	};
});

jest.mock('../../../../../../components/Button', () => {
	return function MockButton({ children, onClick, className }) {
		return (
			<button
				data-testid="edit-button"
				className={className}
				onClick={onClick}
			>
				{children}
			</button>
		);
	};
});

// ─── State Factories ────────────────────────────────────────────

const getDefaultTextHighlightState = (overrides = {}) => ({
	enable: false,
	items: [
		{
			text: '20% OFF',
			link: '',
			icon: '',
		},
	],
	properties: {
		position: 'after_title',
		animation: 'none',
		delay: 0,
	},
	style: {
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background: '#ef4444',
		'border-color': '#ef4444',
		border: 0,
		height: 'auto',
		width: 'auto',
		isChain: false,
		radius: {
			'top-left': '4px',
			'top-right': '4px',
			'bottom-right': '4px',
			'bottom-left': '4px',
		},
	},
	...overrides,
});

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

// ─── Render Helper ──────────────────────────────────────────────

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

const getPreloadedState = (
	textHighlightOverrides = {},
	extraOverrides = {}
) => ({
	discount: {
		discount_intent: 'Bulk',
		discount_rules: getDefaultDiscountRules(),
		conditions: [],
		design_blocks: {
			text_highlight: getDefaultTextHighlightState(
				textHighlightOverrides
			),
		},
		...extraOverrides,
	},
	interaction: {
		showEditor: false,
		componentToEdit: '',
	},
	campaignState: {},
});

// ─── Tests ──────────────────────────────────────────────────────

describe('TextHighlight Component', () => {
	const originalDISCO = global.DISCO;

	beforeEach(() => {
		global.DISCO = { is_pro_active: '1' };
	});

	afterEach(() => {
		global.DISCO = originalDISCO;
		jest.clearAllMocks();
	});

	// ─── Rendering ──────────────────────────────────────────────

	describe('Rendering', () => {
		test('renders correctly with default state', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			expect(
				screen.getByTestId('badge-component-container')
			).toBeInTheDocument();
			expect(
				screen.getByTestId('text-highlight-card')
			).toBeInTheDocument();
			expect(screen.getByTestId('badge-title')).toHaveTextContent(
				'Text Highlight'
			);
			expect(screen.getByTestId('badge-actions')).toBeInTheDocument();
			expect(screen.getByTestId('status-toggle')).toBeInTheDocument();
			expect(screen.getByTestId('edit-button')).toBeInTheDocument();
		});

		test('renders the TextHighlightCard preview', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			expect(
				screen.getByTestId('text-highlight-card')
			).toBeInTheDocument();
		});

		test('renders BadgeTitle with correct title and className', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			const title = screen.getByTestId('badge-title');
			expect(title).toHaveTextContent('Text Highlight');
			expect(title).toHaveClass('disco-mt-3');
		});

		test('renders the Edit Now button with correct text', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			expect(screen.getByTestId('edit-button')).toHaveTextContent(
				'Edit Now'
			);
		});

		test('renders BadgeActions containing Status and Button', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			const actions = screen.getByTestId('badge-actions');
			expect(actions).toContainElement(
				screen.getByTestId('status-toggle')
			);
			expect(actions).toContainElement(screen.getByTestId('edit-button'));
		});

		test('renders with different discount intent', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(
					{},
					{ discount_intent: 'Product' }
				),
			});

			expect(
				screen.getByTestId('badge-component-container')
			).toBeInTheDocument();
		});
	});

	// ─── Status Toggle ──────────────────────────────────────────

	describe('Status Toggle', () => {
		test('shows Disabled when text_highlight.enable is false', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: false }),
			});

			const statusToggle = screen.getByTestId('status-toggle');
			expect(statusToggle).toHaveAttribute('data-status', 'false');
			expect(statusToggle).toHaveTextContent('Status: Disabled');
		});

		test('shows Enabled when text_highlight.enable is true', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: true }),
			});

			const statusToggle = screen.getByTestId('status-toggle');
			expect(statusToggle).toHaveAttribute('data-status', 'true');
			expect(statusToggle).toHaveTextContent('Status: Enabled');
		});

		test('toggles status from Disabled to Enabled on click and updates store', async () => {
			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: false }),
			});

			const statusToggle = screen.getByTestId('status-toggle');
			expect(statusToggle).toHaveAttribute('data-status', 'false');

			await userEvent.click(statusToggle);

			const state = store.getState();
			expect(state.discount.design_blocks.text_highlight.enable).toBe(
				true
			);
		});

		test('toggles status from Enabled to Disabled on click and updates store', async () => {
			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: true }),
			});

			const statusToggle = screen.getByTestId('status-toggle');
			expect(statusToggle).toHaveAttribute('data-status', 'true');

			await userEvent.click(statusToggle);

			const state = store.getState();
			expect(state.discount.design_blocks.text_highlight.enable).toBe(
				false
			);
		});

		test('multiple toggles update store correctly', async () => {
			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: false }),
			});

			const statusToggle = screen.getByTestId('status-toggle');

			// false → true
			await userEvent.click(statusToggle);
			expect(
				store.getState().discount.design_blocks.text_highlight.enable
			).toBe(true);

			// true → false
			await userEvent.click(statusToggle);
			expect(
				store.getState().discount.design_blocks.text_highlight.enable
			).toBe(false);

			// false → true
			await userEvent.click(statusToggle);
			expect(
				store.getState().discount.design_blocks.text_highlight.enable
			).toBe(true);
		});

		test('status toggle does not affect other design_blocks state', async () => {
			const preloadedState = {
				...getPreloadedState({ enable: false }),
			};
			// Add another design block to verify isolation
			preloadedState.discount.design_blocks.badge = { enable: true };

			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState,
			});

			await userEvent.click(screen.getByTestId('status-toggle'));

			const state = store.getState();
			expect(state.discount.design_blocks.text_highlight.enable).toBe(
				true
			);
			expect(state.discount.design_blocks.badge.enable).toBe(true);
		});
	});

	// ─── Button Click Behavior ──────────────────────────────────

	describe('Button Click Behavior', () => {
		test('shows "Edit Now" button when pro is active', () => {
			global.DISCO = { is_pro_active: '1' };

			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			expect(screen.getByTestId('edit-button')).toHaveTextContent(
				'Edit Now'
			);
		});

		test('clicking "Edit Now" dispatches setShowEditor and setComponentToEdit actions', async () => {
			global.DISCO = { is_pro_active: '1' };

			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			await userEvent.click(screen.getByTestId('edit-button'));

			const state = store.getState();
			expect(state.interaction.showEditor).toBe(true);
			expect(state.interaction.componentToEdit).toBe('TextHighlightEdit');
		});

		test('clicking button when pro is not active opens pricing URL', async () => {
			global.DISCO = { is_pro_active: '' };
			const windowOpenSpy = jest
				.spyOn(window, 'open')
				.mockImplementation(() => {});

			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			await userEvent.click(screen.getByTestId('edit-button'));

			expect(windowOpenSpy).toHaveBeenCalledTimes(1);
			expect(windowOpenSpy).toHaveBeenCalledWith(
				'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1'
			);

			windowOpenSpy.mockRestore();
		});

		test('clicking button when pro is not active does not update store', async () => {
			global.DISCO = { is_pro_active: '' };
			const windowOpenSpy = jest
				.spyOn(window, 'open')
				.mockImplementation(() => {});

			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			await userEvent.click(screen.getByTestId('edit-button'));

			const state = store.getState();
			expect(state.interaction.showEditor).toBe(false);
			expect(state.interaction.componentToEdit).toBe('');

			windowOpenSpy.mockRestore();
		});

		test('clicking button when pro is active does not open external URL', async () => {
			global.DISCO = { is_pro_active: '1' };
			const windowOpenSpy = jest
				.spyOn(window, 'open')
				.mockImplementation(() => {});

			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			await userEvent.click(screen.getByTestId('edit-button'));

			expect(windowOpenSpy).not.toHaveBeenCalled();

			windowOpenSpy.mockRestore();
		});

		test('multiple edit clicks for pro user set editor state consistently', async () => {
			global.DISCO = { is_pro_active: '1' };

			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			const editButton = screen.getByTestId('edit-button');

			await userEvent.click(editButton);
			expect(store.getState().interaction.showEditor).toBe(true);
			expect(store.getState().interaction.componentToEdit).toBe(
				'TextHighlightEdit'
			);

			// Click again — should remain the same
			await userEvent.click(editButton);
			expect(store.getState().interaction.showEditor).toBe(true);
			expect(store.getState().interaction.componentToEdit).toBe(
				'TextHighlightEdit'
			);
		});

		test('handles DISCO.is_pro_active with truthy non-"1" value', async () => {
			global.DISCO = { is_pro_active: 'yes' };

			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(),
			});

			await userEvent.click(screen.getByTestId('edit-button'));

			const state = store.getState();
			expect(state.interaction.showEditor).toBe(true);
			expect(state.interaction.componentToEdit).toBe('TextHighlightEdit');
		});
	});

	// ─── Edge Cases ─────────────────────────────────────────────

	describe('Edge Cases', () => {
		test('handles undefined text_highlight gracefully', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					discount_rules: getDefaultDiscountRules(),
					conditions: [],
					design_blocks: {
						text_highlight: undefined,
					},
				},
				interaction: {
					showEditor: false,
					componentToEdit: '',
				},
				campaignState: {},
			};

			renderWithProviders(<TextHighlight />, { preloadedState });

			const statusToggle = screen.getByTestId('status-toggle');
			expect(statusToggle).toHaveAttribute('data-status', 'false');
			expect(statusToggle).toHaveTextContent('Status: Disabled');
		});

		test('handles null enable value gracefully (defaults to false)', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: null }),
			});

			const statusToggle = screen.getByTestId('status-toggle');
			expect(statusToggle).toHaveAttribute('data-status', 'false');
		});

		test('handles empty design_blocks gracefully', () => {
			const preloadedState = {
				discount: {
					discount_intent: 'Bulk',
					discount_rules: [],
					conditions: [],
					design_blocks: {},
				},
				interaction: {
					showEditor: false,
					componentToEdit: '',
				},
				campaignState: {},
			};

			renderWithProviders(<TextHighlight />, { preloadedState });

			const statusToggle = screen.getByTestId('status-toggle');
			expect(statusToggle).toHaveAttribute('data-status', 'false');
		});

		test('preserves other text_highlight properties when toggling status', async () => {
			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({
					enable: false,
					items: [
						{ text: 'Custom Text', link: '/sale', icon: 'star' },
					],
					properties: {
						position: 'before_title',
						animation: 'fade',
						delay: 500,
					},
				}),
			});

			await userEvent.click(screen.getByTestId('status-toggle'));

			const state = store.getState();
			const textHighlight = state.discount.design_blocks.text_highlight;
			expect(textHighlight.enable).toBe(true);
			expect(textHighlight.items[0].text).toBe('Custom Text');
			expect(textHighlight.items[0].link).toBe('/sale');
			expect(textHighlight.properties.position).toBe('before_title');
			expect(textHighlight.properties.animation).toBe('fade');
			expect(textHighlight.properties.delay).toBe(500);
		});

		test('handles empty discount_rules gracefully', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({}, { discount_rules: [] }),
			});

			expect(
				screen.getByTestId('badge-component-container')
			).toBeInTheDocument();
		});

		test('handles undefined conditions gracefully', () => {
			renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState(
					{},
					{ conditions: undefined }
				),
			});

			expect(
				screen.getByTestId('badge-component-container')
			).toBeInTheDocument();
		});

		test('status toggle and edit button work independently', async () => {
			global.DISCO = { is_pro_active: '1' };

			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: false }),
			});

			// Toggle status first
			await userEvent.click(screen.getByTestId('status-toggle'));
			expect(
				store.getState().discount.design_blocks.text_highlight.enable
			).toBe(true);
			expect(store.getState().interaction.showEditor).toBe(false);

			// Then click edit
			await userEvent.click(screen.getByTestId('edit-button'));
			expect(
				store.getState().discount.design_blocks.text_highlight.enable
			).toBe(true);
			expect(store.getState().interaction.showEditor).toBe(true);
			expect(store.getState().interaction.componentToEdit).toBe(
				'TextHighlightEdit'
			);
		});

		test('rapid status toggles produce correct final state', async () => {
			const { store } = renderWithProviders(<TextHighlight />, {
				preloadedState: getPreloadedState({ enable: false }),
			});

			const toggle = screen.getByTestId('status-toggle');

			// 5 rapid clicks: false → true → false → true → false → true
			for (let i = 0; i < 5; i++) {
				await userEvent.click(toggle);
			}

			// Odd number of clicks from false → should be true
			expect(
				store.getState().discount.design_blocks.text_highlight.enable
			).toBe(true);
		});
	});
});
