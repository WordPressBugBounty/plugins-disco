// Pre-made Cart Banner Designs
// Each design contains banner styling including button configuration
// Colors are based on notice1.svg through notice9.svg images

/**
 * Get condition value from conditions array
 */
export const getConditionValue = (conditions, filterName) => {
	for (const group of conditions || []) {
		const filter = group.base_filters?.find(
			(f) => f.compare_with === filterName
		);
		if (filter) return filter.compare;
	}
	return null;
};

/**
 * Compute dynamic variables based on discount configuration
 */
export const getDynamicVariables = (
	discount_intent,
	discount_rules,
	conditions
) => {
	const variables = [];
	const firstRule = discount_rules?.[0];
	const discountType = firstRule?.discount_type || 'percent';
	const discountValue = firstRule?.discount_value || '20';

	if (discount_intent !== 'Shipping') {
		// Always show discount variable based on type
		if (discountType === 'fixed') {
			variables.push({
				label: 'discounted_amount',
				example: `$${discountValue}`,
			});
		} else {
			variables.push({
				label: 'discounted_percentage',
				example: `${discountValue}%`,
			});
		}

		// Show remaining_quantity if cart_items_quantity or item_quantity condition is set
		const quantityValue =
			getConditionValue(conditions, 'cart_items_quantity') ||
			getConditionValue(conditions, 'item_quantity');
		if (quantityValue) {
			variables.push({
				label: 'remaining_quantity',
				example: quantityValue,
			});
		}
	}

	// Show remaining_amount if cart_subtotal or cart_subtotal_with_tax condition is set
	const subtotalValue =
		getConditionValue(conditions, 'cart_subtotal') ||
		getConditionValue(conditions, 'cart_subtotal_with_tax');
	if (subtotalValue) {
		variables.push({
			label: 'remaining_amount',
			example: `$${subtotalValue}`,
		});
	}

	// Show remaining_cart_items if cart_items_count or item_count condition is set
	const lineItemValue =
		getConditionValue(conditions, 'cart_items_count') ||
		getConditionValue(conditions, 'item_count');
	if (lineItemValue) {
		variables.push({
			label: 'remaining_cart_items',
			example: lineItemValue,
		});
	}

	return variables;
};

export const cartBannerDesign = {
	// ------------------- BANNER 1 - Gradient Rainbow (notice1.svg) -------------------
	banner1: {
		text: 'Add More [remaining_quantity] Item to SAVE [discounted_percentage] OFF',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 700,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background:
			'linear-gradient(90deg, #F39177 0%, #F61F48 35.5%, #A758EE 69%, #86C5FE 100%)',
		'border-color': 'transparent',
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
			text: 'Shop Now ➤',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 700,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#323232',
			background: '#facf57',
			'border-color': '#ffffff',
			border: 0,
			height: '35px',
			width: '100px',
			isChain: false,
			radius: {
				'top-left': '6px',
				'top-right': '6px',
				'bottom-right': '6px',
				'bottom-left': '6px',
			},
		},
	},

	// ------------------- BANNER 2 - Blue Arrow (notice2.svg) -------------------
	banner2: {
		text: 'Buy more and save upto [discounted_amount]',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background: '#0081C9',
		'border-color': '#0081C9',
		icon_color: '#ffffff',
		border: 0,
		height: '45px',
		isChain: false,
		radius: {
			'top-left': '0px',
			'top-right': '0px',
			'bottom-right': '0px',
			'bottom-left': '0px',
		},
		button: {
			enable: false,
			text: 'Shop Now',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#0081C9',
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

	// ------------------- BANNER 3 - Red Alert (notice3.svg) -------------------
	banner3: {
		text: 'Spend [remaining_amount] more to get [discounted_percentage] off your entire order',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background: '#FF4133',
		'border-color': '#FF4133',
		icon_color: '#ffffff',
		border: 0,
		height: '45px',
		isChain: false,
		radius: {
			'top-left': '0px',
			'top-right': '0px',
			'bottom-right': '0px',
			'bottom-left': '0px',
		},
		button: {
			enable: true,
			text: 'Order More',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#FF4133',
			background: '#ffffff',
			'border-color': '#ffffff',
			border: 0,
			height: '35px',
			width: '100px',
			isChain: false,
			radius: {
				'top-left': '16px',
				'top-right': '16px',
				'bottom-right': '16px',
				'bottom-left': '16px',
			},
		},
	},

	// ------------------- BANNER 4 - Neon Gradient (notice4.svg) -------------------
	banner4: {
		text: 'Add [remaining_amount] more to cart and get an extra [discounted_percentage] discount!',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 400,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background:
			'linear-gradient(90deg, #2AEBEB 0%, #6363FF 25%, #D040FB 50%, #FF46C8 75%, #FF9E9E 100%)',
		'border-color': 'transparent',
		icon_color: '#ffffff',
		border: 0,
		height: '45px',
		isChain: false,
		radius: {
			'top-left': '12px',
			'top-right': '12px',
			'bottom-right': '12px',
			'bottom-left': '12px',
		},
		button: {
			enable: true,
			text: 'Claim Now',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#6363FF',
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

	// ------------------- BANNER 5 - Orange Border (notice5.svg) -------------------
	banner5: {
		text: 'Add [remaining_amount] more and get an instant [discounted_amount] off your order!',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#FB7F00',
		background: '#ffffff',
		'border-color': '#FB7F00',
		icon_color: '#FB7F00',
		border: 2,
		height: '45px',
		isChain: false,
		radius: {
			'top-left': '8px',
			'top-right': '8px',
			'bottom-right': '8px',
			'bottom-left': '8px',
		},
		button: {
			enable: false,
			text: 'Apply',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#ffffff',
			background: '#FB7F00',
			'border-color': '#FB7F00',
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

	// ------------------- BANNER 6 - Teal Premium (notice6.svg) -------------------
	banner6: {
		text: '[discounted_percentage] OFF - Members Only',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background: '#186F65',
		'border-color': '#186F65',
		icon_color: '#FFB600',
		border: 0,
		height: '45px',
		isChain: false,
		radius: {
			'top-left': '4px',
			'top-right': '4px',
			'bottom-right': '4px',
			'bottom-left': '4px',
		},
		button: {
			enable: true,
			text: 'Keep Shopping',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#186F65',
			background: '#FFB600',
			'border-color': '#FFB600',
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

	// ------------------- BANNER 7 - Purple Modern (notice7.svg) -------------------
	banner7: {
		text: 'Hurry! [discounted_percentage] OFF ends soon!',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#ffffff',
		background: '#7C00FE',
		'border-color': '#7C00FE',
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
			text: 'Buy Now',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 700,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#7C00FE',
			background: '#ffffff',
			'border-color': '#ffffff',
			border: 0,
			height: '35px',
			width: '100px',
			isChain: false,
			radius: {
				'top-left': '20px',
				'top-right': '20px',
				'bottom-right': '20px',
				'bottom-left': '20px',
			},
		},
	},

	// ------------------- BANNER 8 - Blue Border (notice8.svg) -------------------
	banner8: {
		text: 'Flash Sale: [discounted_percentage] OFF!',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 600,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#007CBA',
		background: '#ffffff',
		'border-color': '#007CBA',
		icon_color: '#007CBA',
		border: 2,
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
			text: 'Shop',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#ffffff',
			background: '#007CBA',
			'border-color': '#007CBA',
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

	// ------------------- BANNER 9 - Minimal Light (notice9.svg) -------------------
	banner9: {
		text: 'Save [discounted_amount] today!',
		'font-family': '',
		'font-size': '14px',
		'font-weight': 500,
		'font-style': 'normal',
		'text-decoration': 'none',
		color: '#1A1D1F',
		background: '#F9FAFB',
		'border-color': '#E5E7EB',
		icon_color: '#0079FF',
		border: 1,
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
			text: 'View Details',
			url: '',
			'font-family': '',
			'font-size': '12px',
			'font-weight': 500,
			'font-style': 'normal',
			'text-decoration': 'none',
			color: '#ffffff',
			background: '#0079FF',
			'border-color': '#0079FF',
			border: 0,
			height: '35px',
			width: '100px',
			isChain: false,
			radius: {
				'top-left': '6px',
				'top-right': '6px',
				'bottom-right': '6px',
				'bottom-left': '6px',
			},
		},
	},
};

// Shipping-specific banner designs with free shipping text
export const shippingBannerDesign = {
	// ------------------- BANNER 1 - Gradient Rainbow -------------------
	banner1: {
		...cartBannerDesign.banner1,
		text: "You're almost there! Add [remaining_amount] more to unlock FREE SHIPPING",
		button: {
			...cartBannerDesign.banner1.button,
			enable: true,
			text: 'Order Now',
		},
	},

	// ------------------- BANNER 2 - Blue Arrow -------------------
	banner2: {
		...cartBannerDesign.banner2,
		text: "You're almost there! Spend [remaining_amount] more for FREE SHIPPING.",
		button: {
			...cartBannerDesign.banner2.button,
			enable: true,
			text: 'Buy More',
		},
	},

	// ------------------- BANNER 3 - Red Alert -------------------
	// banner3: {
	// 	...cartBannerDesign.banner3,
	// 	text: "You're [remaining_amount] away from FREE SHIPPING!",
	// },

	// ------------------- BANNER 4 - Neon Gradient -------------------
	// banner4: {
	// 	...cartBannerDesign.banner4,
	// 	text: 'Add [remaining_amount] more to unlock FREE SHIPPING!',
	// },

	// ------------------- BANNER 5 - Orange Border -------------------
	banner5: {
		...cartBannerDesign.banner5,
		text: '🛒 Fill your cart a little more!  Add $60 more — FREE SHIPPING awaits!',
		button: {
			...cartBannerDesign.banner5.button,
			enable: true,
			text: 'Shop Now',
		},
	},

	// ------------------- BANNER 6 - Teal Premium -------------------
	banner6: {
		...cartBannerDesign.banner6,
		text: 'Almost there! Add [remaining_quantity] more items for FREE SHIPPING!',
		button: {
			...cartBannerDesign.banner6.button,
			enable: true,
			text: 'Shop Now',
		},
	},

	// ------------------- BANNER 7 - Purple Modern -------------------
	// banner7: {
	// 	...cartBannerDesign.banner7,
	// 	text: 'Hurry! FREE SHIPPING when you spend [remaining_amount] more!',
	// },

	// ------------------- BANNER 8 - Blue Border -------------------
	// banner8: {
	// 	...cartBannerDesign.banner8,
	// 	text: 'FREE SHIPPING: Add [remaining_amount] more!',
	// },

	// ------------------- BANNER 9 - Minimal Light -------------------
	banner9: {
		...cartBannerDesign.banner9,
		text: '🚀 Free shipping is within reach! Spend [remaining_amount] more for FREE SHIPPING!',
		button: {
			...cartBannerDesign.banner9.button,
			enable: true,
			text: 'Buy More',
		},
	},
};
