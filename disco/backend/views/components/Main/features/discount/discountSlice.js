import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_COUNTDOWN_DESIGN } from '../../utilities/count-down';
import { DEFAULT_TEXT_HIGHLIGHT_DESIGN } from '../../utilities/text-highlight-design';
import { DEFAULT_PRODUCT_BADGE_DESIGN } from '../../utilities/product-badge-design';

const initialState = {
	name: '',
	discount_intent: '',

	discount_method: 'automated',
	discount_coupon: '',

	priority: '1',
	status: '1',

	show_discount_on_cart_page: false,

	bogo_type: 'all',
	discount_based_on: 'item_quantity',

	discount_rules: [
		{
			id: uuidv4(),
			min: '',
			max: '',
			get_quantity: '',
			get_ids: [],
			discount_type: 'percent',
			discount_value: '',
			discount_label: '',
			recursive: 'no',
		},
	],

	discount_max_user: '0',
	discount_valid_from: '',
	discount_valid_to: '',

	products: ['all'],
	conditions: [],

	ui: [0, 0],

	design_blocks: {
		badge: {
			enable: false,
			badge_type: 'editable',
			selected_design: DEFAULT_PRODUCT_BADGE_DESIGN,
			position: 'top_left',
			hasSeparator: false,
			singleContainer: false,

			// Main container styles
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				height: '30px',
				padding: '5px 10px',
				background: 'rgb(7, 200, 131)',
				'clip-path':
					'polygon(0% 0%, 100% 0%, 85% 49%, 100% 100%, 0% 100%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: '#FFFFFF',
				'font-family': 'Manrope, sans-serif',
				'font-size': '14px',
				'font-weight': 700,
			},
		},

		// 🧾 Text highlight (single product page)
		text_highlight: {
			enable: false,
			badge_type: 'editable',
			selected_design: DEFAULT_TEXT_HIGHLIGHT_DESIGN,
			position: 'after_add_to_cart',

			// Main container styles
			container: {
				width: '150px',
				height: '40px',
				display: 'flex',
				padding: '5px 20px',
				alignItems: 'center',
				justifyContent: 'center',
				'background-color': 'rgb(146, 81, 227)',
				'border-color': '#fff',
				'border-width': '0px',
				radius: {
					'top-left': '0px',
					'top-right': '0px',
					'bottom-right': '0px',
					'bottom-left': '0px',
				},
				'border-style': 'solid',
				clipPath:
					'polygon(100% 0%, 90% 50%, 100% 100%, 0% 100%, 10% 50%, 0% 0%)',
			},
			// Title styles
			title: {
				text: 'Big savings: [discounted_amount]',
				color: '#FFFFFF',
				'font-family': 'Manrope, sans-serif',
				'font-size': '14px',
				'font-weight': 600,
				'text-align': 'center',
			},
		},

		// ⏳ Countdown timer
		countdown: {
			enable: false,
			selected_design: DEFAULT_COUNTDOWN_DESIGN,
			position: 'after_add_to_cart',

			// Primary Text (Title)
			title: {
				text: 'Exclusive Deals',
				'font-family': '',
				'font-size': '14px',
				'font-weight': 600,
				'font-style': 'normal',
				'text-decoration': 'none',
				color: '#FFFFFF',
			},

			// Secondary Text (Subtitle)
			subtitle: {
				text: 'Available for a limited time only!',
				'font-family': '',
				'font-size': '12px',
				'font-weight': 400,
				'font-style': 'normal',
				'text-decoration': 'none',
				color: '#FFFFFF',
			},

			// Container (Area) styles
			container: {
				background:
					'linear-gradient(90deg, #F39177 0%, #F61F48 35.5%, #A758EE 69%, #86C5FE 100%)',
				'border-radius': '6px',
				padding: '12px 16px 12px 16px',
				'max-width': '370px',
				border: 0,
				'border-color': 'rgba(0, 0, 0, 0)',
				isChain: false,
				radius: {
					'top-left': '6px',
					'top-right': '6px',
					'bottom-right': '6px',
					'bottom-left': '6px',
				},
			},

			// Counter Box styles
			box: {
				background: '#FFFFFF',
				'border-radius': '2px',
				padding: '8px 12px 8px 12px',
				'min-width': '50px',
				border: 0,
				'border-color': 'rgba(0, 0, 0, 0)',
				isChain: false,
				radius: {
					'top-left': '2px',
					'top-right': '2px',
					'bottom-right': '2px',
					'bottom-left': '2px',
				},
			},

			// Number styles (countdown digits)
			number: {
				'font-family': '',
				'font-size': '20px',
				'font-weight': 700,
				color: '#FF4133',
			},

			// Label styles (DAYS, HOURS, etc.)
			label: {
				'font-family': '',
				'font-size': '9px',
				'font-weight': 400,
				color: '#1A1D1F',
			},

			// Separator styles
			separator: {
				color: '#FFFFFF',
				'font-size': '20px',
				'font-weight': 700,
			},

			// Design metadata
			hasSeparator: false,
			singleContainer: false,
		},
		cart: {
			enable: false,
			design_type: 'notice',
			selected_design: 'banner1',

			// Banner Customization (includes text, styling, and button)
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
				// Banner Button (Shop Now inside banner)
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

			// Checkout Message Customization
			checkout_message: {
				enable: true,
				text: 'You have saved [Discount Amount] on this order',
				'font-family': '',
				'font-size': '14px',
				'font-weight': 400,
				'font-style': 'normal',
				'text-decoration': 'none',
				color: '#16a34a',
			},

			// Product Item Savings Badge
			savings_badge: {
				enable: true,
				text: 'SAVE [Amount]',
				bg_color: '#ef4444',
				text_color: '#ffffff',
				'font-size': '12px',
			},
		},
		// 📊 Bulk, Bundle discount table
		table: {
			enable: false,
			position: 'after_add_to_cart',
			table_style: 'style1',

			heading: {
				title: 'Title',
				discount: 'Discount',
				range: 'Ranges',
				buy_now: 'Buy Now',
			},

			// ========================
			// Heading Text (Used for header font styles)
			// ========================
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

			// ========================
			// Cell Customization (Used for body font styles)
			// ========================
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

			// ========================
			// Button Customization (Using the vibrant purple from original component)
			// ========================
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
		},
	},
};

export const discountSlice = createSlice({
	name: 'discount',
	initialState,
	reducers: {
		reset: () => initialState,
		editCampaign: (state, action) => {
			return { ...initialState, ...action.payload };
		},
		updateOption: (state, action) => {
			state[action.payload.option] = action.payload.value;
		},

		updateProducts: (state, action) => {
			if (
				state.products.find(
					(_product) => _product.id === action.payload.id
				)
			) {
				state.products = state.products.filter(
					(_product) => _product.id !== action.payload.id
				);
			} else {
				state.products.push(action.payload);
			}
		},

		removeProduct: (state, action) => {
			state.products = state.products.filter(
				(_product) => _product.id !== action.payload.id
			);
		},

		// *! Condition's Reducers

		addCondition: (state, action) => {
			const condition_group_index = state.conditions.findIndex(
				(filter) => filter.id === action.payload
			);
			if (condition_group_index !== -1) {
				state.conditions[condition_group_index].base_filters.push({
					id: uuidv4(),
					compare_with: '',
					operator: 'and',
				});
			}
		},

		addConditionGroup: (state) => {
			state.conditions.push({
				id: uuidv4(),
				base_operator: 'and',
				base_filters: [
					{
						id: uuidv4(),
						compare_with: '',
						operator: 'and',
					},
				],
			});
		},

		updateConditionGroup: (state, action) => {
			const condition_group_index = state.conditions.findIndex(
				(filter) => filter.id === action.payload.id
			);
			if (condition_group_index !== -1) {
				state.conditions[condition_group_index].base_operator =
					action.payload.operator;
			}
		},

		deleteConditionGroup: (state, action) => {
			state.conditions = state.conditions.filter(
				(conditionGroup) => conditionGroup.id !== action.payload
			);
		},

		updateConditionValues: (state, action) => {
			const condition_group_index = state.conditions.findIndex(
				(filter) => filter.id === action.payload.group_id
			);

			if (condition_group_index !== -1) {
				const condition_index = state.conditions[
					condition_group_index
				].base_filters.findIndex(
					(filter) => filter.id === action.payload.values.id
				);

				if (condition_index !== -1) {
					state.conditions[condition_group_index].base_filters[
						condition_index
					] = action.payload.values;
				}
			}
		},

		deleteCondition: (state, action) => {
			const condition_group_index = state.conditions.findIndex(
				(filter) => filter.id === action.payload.group_id
			);
			if (condition_group_index !== -1) {
				if (
					state.conditions[condition_group_index].base_filters
						.length === 1
				) {
					state.conditions = state.conditions.filter(
						(conditionGroup) =>
							conditionGroup.id !== action.payload.group_id
					);
				} else {
					state.conditions[condition_group_index].base_filters =
						state.conditions[
							condition_group_index
						].base_filters.filter(
							(condition) =>
								condition.id !== action.payload.condition_id
						);
				}
			}
		},

		// *! UI Tab Reducers

		setTab: (state, action) => {
			state.ui[0] = action.payload;
			if (state.ui[1] < state.ui[0]) {
				state.ui[1] = state.ui[0];
			}
		},

		// *! Discount Rules Reducers

		changeBOGOType: (state, action) => {
			if (state.bogo_type !== action.payload) {
				state.bogo_type = action.payload;
				state.discount_rules = state.discount_rules.map((rule) => ({
					...rule,
					get_ids: [],
				}));
			}
		},

		changeDiscountIntention: (state, action) => {
			state.discount_intent = action.payload;
			state.discount_rules = [
				{
					id: uuidv4(),
					min: '',
					max: '',
					get_quantity: '',
					get_ids: [],
					discount_type: 'percent',
					discount_value: '',
					discount_label: '',
					recursive: 'no',
				},
			];
			state.design_blocks = initialState.design_blocks;
		},

		addNewDiscountRule: (state) => {
			state.discount_rules.push({
				id: uuidv4(),
				min: '',
				max: '',
				get_quantity: '',
				get_ids: [],
				discount_type: 'percent',
				discount_value: '',
				discount_label: '',
				recursive: 'no',
			});
		},

		updateDiscountRule: (state, action) => {
			const index = state.discount_rules.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index !== -1) {
				state.discount_rules[index] = action.payload;
			}
		},
		deleteDiscountRule: (state, action) => {
			state.discount_rules = state.discount_rules.filter(
				(item) => item.id !== action.payload
			);
		},

		// Enable recursive on a single rule and drop every other rule. Recursive
		// applies one repeating tier, so multiple tiers no longer make sense.
		keepOnlyRecursiveRule: (state, action) => {
			const rule = state.discount_rules.find(
				(item) => item.id === action.payload
			);
			if (rule) {
				state.discount_rules = [{ ...rule, recursive: 'yes' }];
			}
		},

		// *! Design Block Reducers

		updateBadge: (state, action) => {
			state.design_blocks.badge[action.payload.name] =
				action.payload.value;
		},

		updateTextHighlight: (state, action) => {
			state.design_blocks.text_highlight[action.payload.name] =
				action.payload.value;
		},

		updateCountdown: (state, action) => {
			state.design_blocks.countdown[action.payload.name] =
				action.payload.value;
		},

		applyCountdownDesign: (state, action) => {
			const countdown = state.design_blocks.countdown;
			const { designKey, design } = action.payload;
			countdown.selected_design = designKey;
			countdown.title = { ...countdown.title, text: design.title.text, color: design.title.color, 'font-size': design.title['font-size'], 'font-weight': design.title['font-weight'] };
			countdown.subtitle = { ...countdown.subtitle, text: design.subtitle.text, color: design.subtitle.color, 'font-size': design.subtitle['font-size'], 'font-weight': design.subtitle['font-weight'] };
			countdown.container = { ...countdown.container, background: design.container.background, 'border-radius': design.container['border-radius'], border: design.container.border, 'border-color': design.container['border-color'], radius: { 'top-left': design.container['border-radius'], 'top-right': design.container['border-radius'], 'bottom-right': design.container['border-radius'], 'bottom-left': design.container['border-radius'] } };
			countdown.box = { ...countdown.box, background: design.box.background, 'border-radius': design.box['border-radius'], 'min-width': design.box['min-width'] || '50px', radius: { 'top-left': design.box['border-radius'], 'top-right': design.box['border-radius'], 'bottom-right': design.box['border-radius'], 'bottom-left': design.box['border-radius'] } };
			countdown.number = { ...countdown.number, color: design.number.color, 'font-size': design.number['font-size'], 'font-weight': design.number['font-weight'] };
			countdown.label = { ...countdown.label, color: design.label.color, 'font-size': design.label['font-size'], 'font-weight': design.label['font-weight'] };
			countdown.separator = { color: design.separator.color, 'font-size': design.separator['font-size'], 'font-weight': design.separator['font-weight'] };
			countdown.image = { url: design.image.url };
			countdown.hasSeparator = design.hasSeparator;
			countdown.singleContainer = design.singleContainer;
		},

		updateTable: (state, action) => {
			state.design_blocks.table[action.payload.name] =
				action.payload.value;
		},

		updateCartPage: (state, action) => {
			state.design_blocks.cart[action.payload.name] =
				action.payload.value;
		},

		// updateSinglePage: (state, action) => {
		// 	state.design_blocks.singlePage[action.payload.name] =
		// 		action.payload.value;
		// },
		// updateCartPage: (state, action) => {
		// 	state.design_blocks.cartPage[action.payload.name] =
		// 		action.payload.value;
		// },
	},
});

export const {
	reset,
	editCampaign,
	updateOption,
	updateProducts,
	removeProduct,
	addCondition,
	addConditionGroup,
	updateConditionGroup,
	deleteConditionGroup,
	updateConditionValues,
	deleteCondition,
	setTab,

	changeBOGOType,
	changeDiscountIntention,
	addNewDiscountRule,
	updateDiscountRule,
	deleteDiscountRule,
	keepOnlyRecursiveRule,

	updateBadge,
	updateTextHighlight,
	updateCountdown,
	applyCountdownDesign,
	updateTable,
	updateCartPage,
} = discountSlice.actions;

export default discountSlice.reducer;
