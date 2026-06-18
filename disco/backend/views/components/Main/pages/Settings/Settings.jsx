import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import ComponentContainer from '../../components/ComponentContainer';
import LoadingSpinner from '../../components/LoadingSpinner';
import SingleSelect from '../../components/SingleSelect';
import {
	useGetSettingsQuery,
	useUpdateSettingsMutation,
} from '../../features/settings/settingsApi';
import SettingsTitle from './components/SettingsTitle';
import SingleSelectRadio from './components/SingleSelectRadio';
const Settings = () => {
	const { data, isLoading } = useGetSettingsQuery();
	const [
		updateSettings,
		{ isLoading: updateLoading, isSuccess: updateSuccess },
	] = useUpdateSettingsMutation();
	const [settings, setSettings] = useState({});

	useEffect(() => {
		if (data) {
			setSettings(data);
		}
	}, [data]);

	useEffect(() => {
		if (updateSuccess) {
			toast.success('Settings Updated');
		}
	}, [updateSuccess]);

	const handleSettingChange = (key, value) => {
		setSettings((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	const handleSettingSave = () => {
		updateSettings(settings);
	};

	const items = {
		product_price_type: {
			regular_price: 'Regular Price',
			price: 'Sale Price',
		},
		min_max_discount_amount: {
			min: 'Minimum',
			max: 'Maximum',
		},
		discount_priority_type: {
			both: 'Both coupons and campaigns',
			disco_campaign: 'Only Disco campaigns',
		},
		on_sale_badge: {
			show_all: 'Show on sale badge',
			do_not_show: 'Do not show on sale badge',
			// show_for_campaigns: 'Show on sale badge only for campaigns',
			// show_for_wc: 'Show on sale badge only for WooCommerce',
		},
		show_strike_through: {
			shop_page: true,
			product_pages: true,
			category_page: true,
			cart_page: true,
		},
	};

	if (isLoading) {
		return (
			<div className="disco-h-96 disco-w-full disco-flex disco-justify-center disco-items-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="disco-mt-2.5 disco-mr-4 disco-ml-0.5 disco-flex disco-gap-4">
			<div className="disco-flex-grow disco-border disco-bg-gray-50 disco-white disco-rounded-xl disco-p-5">
				<div className="disco-border disco-border-t-0 disco-border-x-0 disco-border-b-white disco-mb-3">
					<ComponentContainer
						heading={__('Settings', 'disco')}
						className="!disco-mt-0"
					/>
				</div>
				<div className="disco-bg-white disco-p-4 disco-border disco-border-white disco-rounded-xl">
					<SettingsTitle
						title={__('Product Price Type', 'disco')}
						subtitle={__(
							'Choose product price type by which discount will be calculate.',
							'disco'
						)}
						className="disco-mb-2"
						url="https://discoplugin.com/docs/product-price-type/"
					>
						<SingleSelectRadio
							options={items.product_price_type}
							handleChange={(e) =>
								handleSettingChange('product_price_type', e)
							}
							selected={settings.product_price_type}
						/>
					</SettingsTitle>

					<SettingsTitle
						title={__('Minimum Maximum Discount Amount', 'disco')}
						subtitle={__(
							"Choose discount's amount to define the maximum and minimum discounts.",
							'disco'
						)}
						className="disco-mb-2"
						url="https://discoplugin.com/docs/minimum-maximum-discount-amount/"
					>
						<SingleSelectRadio
							options={items.min_max_discount_amount}
							handleChange={(e) =>
								handleSettingChange(
									'min_max_discount_amount',
									e
								)
							}
							selected={settings.min_max_discount_amount}
						/>
					</SettingsTitle>
					<SettingsTitle
						title={__('Coupons & Campaigns Behavior', 'disco')}
						subtitle={__(
							'Decide how WooCommerce coupons and Disco campaigns should work together.',
							'disco'
						)}
						className="disco-mb-2"
						url="https://discoplugin.com/docs/coupons-campaigns-behavior/"
					>
						<SingleSelect
							className="disco-bg-white disco-test-select-class"
							buttonClass="disco-min-w-[320px]"
							placeholder={__('Select Value', 'disco')}
							items={items?.discount_priority_type}
							selected={settings?.discount_priority_type ?? ''}
							onchange={(e) => {
								handleSettingChange(
									'discount_priority_type',
									e
								);
							}}
						/>
					</SettingsTitle>
					<SettingsTitle
						title={__('WooCommerce On-Sale Badge', 'disco')}
						subtitle={__(
							'Decide how WooCommerce on sale badge shows for any discount rules.',
							'disco'
						)}
						className="disco-mb-2"
						url="https://discoplugin.com/docs/woocommerce-on-sale-badge/"
					>
						<SingleSelect
							className="disco-bg-white disco-test-select-class"
							buttonClass="disco-min-w-[320px]"
							placeholder={__('Select Value', 'disco')}
							items={items?.on_sale_badge}
							selected={settings?.on_sale_badge ?? ''}
							onchange={(e) => {
								handleSettingChange('on_sale_badge', e);
							}}
						/>
					</SettingsTitle>
					<SettingsTitle
						title={__('Strikeout Price', 'disco')}
						subtitle={__(
							'Choose where the strike-through price appears across your store.',
							'disco'
						)}
						className="disco-mb-2 "
						url="https://discoplugin.com/docs/strikeout-price-settings/"
					>
						<div className="disco-flex disco-items-center disco-gap-8">
							{Object.keys(items.show_strike_through).map(
								(key) => (
									<CheckBox
										checked={
											settings.show_strike_through?.[
												key
											] ?? false
										}
										onChange={(checked) => {
											handleSettingChange(
												'show_strike_through',
												{
													...settings.show_strike_through,
													[key]: checked,
												}
											);
										}}
										label={key
											?.replace(/_/g, ' ')
											?.replace(/\b\w/g, (char) =>
												char.toUpperCase()
											)}
										key={key}
									/>
								)
							)}
						</div>
					</SettingsTitle>
				</div>
				<div className="disco-mt-8 disco-flex disco-justify-end disco-gap-4">
					<Link to="/">
						<Button type="transparent">
							{__('Back', 'disco')}
						</Button>
					</Link>
					<Button
						disabled={updateLoading}
						onClick={handleSettingSave}
					>
						<span>{__('Save', 'disco')}</span>
						{updateLoading && <LoadingSpinner size={4} />}
					</Button>
				</div>
			</div>
		</div>
	);
};
export default Settings;
