import { __ } from '@wordpress/i18n';

import acfIcon from './images/acf.svg';
import aeliaIcon from './images/aelia.svg';
import curcyIcon from './images/curcy.svg';
import foxIcon from './images/fox.svg';
import wpmlIcon from './images/wpml.svg';

const getPlugins = () => [
	{
		id: 1,
		name: __('Advanced Custom Fields', 'disco'),
		category: __('Custom Data', 'disco'),
		description: __(
			"Use your ACF custom field values as discount conditions. Target discounts by membership tier, customer type, or any custom meta you've defined.",
			'disco'
		),
		pluginFile: 'advanced-custom-fields/acf.php',
		tags: [
			__('Condition Filters', 'disco'),
			__('Custom Meta', 'disco'),
			__('Auto-synced', 'disco'),
		],
		proRequired: true,
		learnMoreUrl:
			'https://discoplugin.com/docs/acf-advanced-custom-fields/',
		icon: acfIcon,
	},
	{
		id: 2,
		name: __('WPML Multi-Language', 'disco'),
		category: __('Multi-Language · Multi-Currency', 'disco'),
		description: __(
			'Disco discount rules apply correctly across all languages and currencies managed by WPML — no manual conversion or duplicate campaigns needed.',
			'disco'
		),
		pluginFile: 'sitepress-multilingual-cms/sitepress.php',
		tags: [
			__('Multi-Currency', 'disco'),
			__('Multi-Language', 'disco'),
			__('Auto-detected', 'disco'),
		],
		proRequired: true,
		learnMoreUrl:
			'https://discoplugin.com/docs/wpml-woocommerce-multilingual/',
		icon: wpmlIcon,
	},
	{
		id: 3,
		name: __('FOX Currency Switcher', 'disco'),
		category: __('Multi-Currency', 'disco'),
		description: __(
			'Sell in any currency and apply Disco discounts correctly in every currency your customers switch to — zero manual conversion required.',
			'disco'
		),
		pluginFile: 'woocommerce-currency-switcher/index.php',
		tags: [
			__('Currency Rules', 'disco'),
			__('Auto-conversion', 'disco'),
			__('Live Rates', 'disco'),
		],
		proRequired: true,
		learnMoreUrl:
			'https://discoplugin.com/docs/fox-currency-switcher-woocs/',
		icon: foxIcon,
	},
	{
		id: 4,
		name: __('CURCY – Multi Currency', 'disco'),
		category: __('Multi-Currency', 'disco'),
		description: __(
			'Disco Pro integrates with CURCY so your discount rules work seamlessly across multiple currencies — offering customers a smooth global shopping experience.',
			'disco'
		),
		pluginFile: 'woo-multi-currency/woo-multi-currency.php',
		tags: [
			__('Global Discounts', 'disco'),
			__('Currency Sync', 'disco'),
			__('Woo Native', 'disco'),
		],
		proRequired: true,
		learnMoreUrl:
			'https://discoplugin.com/docs/curcy-multi-currency-for-woocommerce/',
		icon: curcyIcon,
	},
	{
		id: 5,
		name: __('Aelia Currency Switcher', 'disco'),
		category: __('Multi-Currency', 'disco'),
		description: __(
			'Enterprise-grade multi-currency solution. Disco Pro works natively with Aelia — show prices and accept payments in different currencies while discount rules apply automatically.',
			'disco'
		),
		pluginFile:
			'aelia-currencyswitcher/aelia-woocommerce-currencyswitcher.php',
		tags: [
			__('Enterprise', 'disco'),
			__('Multi-Currency', 'disco'),
			__('Geo Pricing', 'disco'),
		],
		proRequired: true,
		learnMoreUrl: 'https://discoplugin.com/docs/aelia-currency-switcher/',
		icon: aeliaIcon,
	},
];

export default getPlugins;
