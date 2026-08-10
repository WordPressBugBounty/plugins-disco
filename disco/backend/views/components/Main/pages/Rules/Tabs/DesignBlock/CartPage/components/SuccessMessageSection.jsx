import { __ } from '@wordpress/i18n';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import Status from '../../components/Status';
import BannerFontProperties from './BannerFontProperties';
import BannerTextInput from './BannerTextInput';

/**
 * Success message shown in the cart notice once the customer has actually
 * claimed the discount (e.g. "Congratulations! You claimed 20% discount").
 * Until then the regular banner text (the current offer) is displayed.
 */
const SuccessMessageSection = () => {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const banner = cart?.banner || {};
	const success = banner?.success || {};
	const textareaRef = useRef(null);

	const isEnabled = success?.enable !== false;

	const handleSuccessChange = (key, value) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: { ...banner, success: { ...success, [key]: value } },
			})
		);
	};

	return (
		<div className="disco-mt-3">
			<div className="disco-flex disco-justify-between disco-items-center disco-mb-1">
				<h1 className="disco-text-sm disco-font-semibold">
					{__('Success Message', 'disco')}
				</h1>
				<Status
					status={isEnabled}
					handleStatus={() =>
						handleSuccessChange('enable', !isEnabled)
					}
					dataTestid="cart-notice-success-status"
				/>
			</div>
			<p className="disco-text-xs disco-font-thin disco-mb-1">
				{__(
					'Shown instead of the banner text once the customer has claimed the discount. When turned off, the banner is hidden after the discount is applied.',
					'disco'
				)}
			</p>
			<BannerFontProperties field="success" textareaRef={textareaRef} />
			<BannerTextInput
				ref={textareaRef}
				onlyDiscountVariables
				onChange={(e) => handleSuccessChange('text', e.target.value)}
				value={success?.text || ''}
			/>
		</div>
	);
};

export default SuccessMessageSection;
