import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { apiSlice } from '../../../../../../features/api/apiSlice';
import discountReducer from '../../../../../../features/discount/discountSlice';
import interactionReducer from '../../../../../../features/interaction/interactionSlice';
import {
	cartBannerDesign,
	shippingBannerDesign,
} from '../../../../../../utilities/cart-banner-design';
import BannerView from '../components/BannerView';
import SuccessMessageSection from '../components/SuccessMessageSection';

function renderWithProviders(ui, { preloadedState = {} } = {}) {
	const store = configureStore({
		reducer: {
			[apiSlice.reducerPath]: apiSlice.reducer,
			discount: discountReducer,
			interaction: interactionReducer,
		},
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(apiSlice.middleware),
	});

	function Wrapper({ children }) {
		return <Provider store={store}>{children}</Provider>;
	}

	return { store, ...render(ui, { wrapper: Wrapper }) };
}

const getSuccess = (overrides = {}) => ({
	enable: true,
	text: 'Congratulations! You claimed [discounted_percentage] discount',
	'font-family': '',
	'font-size': '14px',
	'font-weight': 600,
	'font-style': 'normal',
	'text-decoration': 'none',
	...overrides,
});

const getState = ({ success = getSuccess(), banner = {}, ...rest } = {}) => ({
	discount: {
		discount_intent: 'Cart',
		discount_rules: [
			{
				id: 'rule-1',
				discount_type: 'percent',
				discount_value: '20',
			},
		],
		conditions: [],
		design_blocks: {
			cart: {
				enable: true,
				selected_design: 'banner1',
				banner: {
					text: 'OFFER TEXT',
					'font-size': '14px',
					'font-weight': 600,
					color: '#ffffff',
					background: '#07C889',
					border: 0,
					height: '45px',
					radius: {
						'top-left': '8px',
						'top-right': '8px',
						'bottom-right': '8px',
						'bottom-left': '8px',
					},
					button: { enable: true, text: 'Shop Now' },
					...(success ? { success } : {}),
					...banner,
				},
			},
		},
		...rest,
	},
});

describe('Cart notice success message design', () => {
	test('every cart banner design carries an enabled success message', () => {
		Object.entries(cartBannerDesign).forEach(([key, design]) => {
			expect(design.success).toBeDefined();
			expect(design.success.enable).toBe(true);
			expect(design.success.text.length).toBeGreaterThan(0);
			expect(design.success['font-size']).toBe(design['font-size']);
			expect(design.success['font-weight']).toBe(design['font-weight']);
			expect(key).toMatch(/^banner\d+$/);
		});
	});

	test('cart success texts use discount variables, never remaining ones', () => {
		Object.values(cartBannerDesign).forEach((design) => {
			expect(design.success.text).not.toMatch(/\[remaining_/);
		});
	});

	test('shipping designs use the free shipping success text', () => {
		Object.values(shippingBannerDesign).forEach((design) => {
			expect(design.success.text).toContain('FREE SHIPPING');
		});
	});

	test('success message carries no color of its own', () => {
		Object.values(cartBannerDesign).forEach((design) => {
			expect(design.success.color).toBeUndefined();
		});
	});
});

describe('SuccessMessageSection Component', () => {
	test('renders the section with its stored text', () => {
		renderWithProviders(<SuccessMessageSection />, {
			preloadedState: getState(),
		});

		expect(screen.getByText('Success Message')).toBeInTheDocument();
		expect(
			screen.getByDisplayValue(
				'Congratulations! You claimed [discounted_percentage] discount'
			)
		).toBeInTheDocument();
		expect(screen.getByText('Enabled')).toBeInTheDocument();
	});

	test('shows Disabled when the success message is off', () => {
		renderWithProviders(<SuccessMessageSection />, {
			preloadedState: getState({ success: getSuccess({ enable: false }) }),
		});

		expect(screen.getByText('Disabled')).toBeInTheDocument();
	});

	test('toggling the status updates banner.success.enable', async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<SuccessMessageSection />, {
			preloadedState: getState(),
		});

		await user.click(screen.getByTestId('cart-notice-success-status'));

		expect(
			store.getState().discount.design_blocks.cart.banner.success.enable
		).toBe(false);
	});

	test('editing the textarea updates banner.success.text', async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<SuccessMessageSection />, {
			preloadedState: getState({ success: getSuccess({ text: '' }) }),
		});

		await user.type(screen.getByRole('textbox'), 'Nice');

		expect(
			store.getState().discount.design_blocks.cart.banner.success.text
		).toBe('Nice');
	});

	test('editing the success text leaves the banner text untouched', async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<SuccessMessageSection />, {
			preloadedState: getState({ success: getSuccess({ text: '' }) }),
		});

		await user.type(screen.getByRole('textbox'), 'A');

		expect(store.getState().discount.design_blocks.cart.banner.text).toBe(
			'OFFER TEXT'
		);
	});

	test('shows the discount variable hint', () => {
		renderWithProviders(<SuccessMessageSection />, {
			preloadedState: getState(),
		});

		expect(screen.getByText('[discounted_percentage]')).toBeInTheDocument();
	});

	test('hides remaining_* variable hints', () => {
		const preloadedState = getState();
		preloadedState.discount.conditions = [
			{
				base_filters: [
					{ compare_with: 'cart_subtotal', compare: '100' },
					{ compare_with: 'cart_items_quantity', compare: '3' },
				],
			},
		];

		renderWithProviders(<SuccessMessageSection />, { preloadedState });

		expect(screen.queryByText('[remaining_amount]')).not.toBeInTheDocument();
		expect(
			screen.queryByText('[remaining_quantity]')
		).not.toBeInTheDocument();
	});
});

describe('BannerView success state', () => {
	test('shows the offer text and button by default', () => {
		renderWithProviders(<BannerView />, { preloadedState: getState() });

		expect(screen.getByText('OFFER TEXT')).toBeInTheDocument();
		expect(screen.getByText('Shop Now')).toBeInTheDocument();
	});

	test('shows the success text without the button when previewing claimed', () => {
		renderWithProviders(<BannerView showSuccess />, {
			preloadedState: getState(),
		});

		expect(
			screen.getByText('Congratulations! You claimed 20% discount')
		).toBeInTheDocument();
		expect(screen.queryByText('OFFER TEXT')).not.toBeInTheDocument();
		expect(screen.queryByText('Shop Now')).not.toBeInTheDocument();
	});

	test('renders the success text with its own typography', () => {
		renderWithProviders(<BannerView showSuccess />, {
			preloadedState: getState({
				success: getSuccess({ 'font-size': '22px', 'font-weight': 800 }),
			}),
		});

		const text = screen.getByText(
			'Congratulations! You claimed 20% discount'
		);

		expect(text).toHaveStyle({ fontSize: '22px', fontWeight: 800 });
	});

	test('shows the hidden-banner notice when the success message is off', () => {
		renderWithProviders(<BannerView showSuccess />, {
			preloadedState: getState({ success: getSuccess({ enable: false }) }),
		});

		expect(
			screen.getByText('Banner is hidden after the discount is applied')
		).toBeInTheDocument();
		expect(screen.queryByText('OFFER TEXT')).not.toBeInTheDocument();
	});

	test('shows the hidden-banner notice when there is no success message', () => {
		renderWithProviders(<BannerView showSuccess />, {
			preloadedState: getState({ success: null }),
		});

		expect(
			screen.getByText('Banner is hidden after the discount is applied')
		).toBeInTheDocument();
	});
});
