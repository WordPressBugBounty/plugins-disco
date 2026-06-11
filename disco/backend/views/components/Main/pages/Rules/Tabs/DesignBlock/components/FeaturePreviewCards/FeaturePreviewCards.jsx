import { __ } from '@wordpress/i18n';
import DiscountCard from '../../BulkBundleDiscountPage/components/DiscountCard';
import CartCard from '../../CartPage/components/CartCard';
import CountdownTimeCard from '../../CountDownTime/components/CountdownTimeCard';
import ProductBadgeCard from '../../ProductBadges/components/ProductBadgeCard';
import TextHighlightCard from '../../TextHighlight/components/TextHighlightCard';

const ProBadge = () => {
	const handleOnClick = () => {
		window.open(
			'https://discoplugin.com/?utm_source=display_cart&utm_medium=text_button&utm_campaign=free-pro&utm_id=1#pricing',
			'_blank',
			'noopener,noreferrer'
		);
	};

	return (
		<span
			onClick={handleOnClick}
			className="disco-inline-flex disco-items-center disco-justify-center disco-rounded-full disco-font-extrabold disco-cursor-pointer disco-bg-amber-100 disco-text-amber-800 disco-text-[10px] disco-h-[18px] disco-px-[9px] disco-whitespace-nowrap"
		>
			🔒 Pro
		</span>
	);
};

const FEATURE_CARDS = [
	{
		id: 'product-badge',
		title: __('Product Badge', 'disco'),
		description: __(
			'Eye-catching ribbon on product images. Customers notice discounts before they even read the price.',
			'disco'
		),
		preview: <ProductBadgeCard />,
		url: 'https://discoplugin.com/docs/display-product-badge-in-woocommerce/',
	},
	{
		id: 'text-highlight',
		title: __('Text Highlight', 'disco'),
		description: __(
			'Bold price styling with custom badges below product titles. Makes your discount impossible to miss.',
			'disco'
		),
		preview: <TextHighlightCard />,
		url: 'https://discoplugin.com/docs/display-text-highlight/',
	},
	{
		id: 'cart-page',
		title: __('Cart Page', 'disco'),
		description: __(
			'Progress bar + savings summary in the cart. Pushes customers to add one more item to qualify for the discount.',
			'disco'
		),
		preview: <CartCard />,
		url: 'https://discoplugin.com/docs/display-cart-notice/',
	},
	{
		id: 'countdown-time',
		title: __('Countdown Time', 'disco'),
		description: __(
			'Live ticking timer on product pages. Nothing converts fence-sitters faster than a clock running out.',
			'disco'
		),
		preview: <CountdownTimeCard />,
		url: 'https://discoplugin.com/docs/display-countdown-timer/',
	},
	{
		id: 'bulk-discount',
		title: __('Bulk Discount', 'disco'),
		description: __(
			'Tiered pricing table on the product page. Shows customers exactly how much they save by buying more.',
			'disco'
		),
		preview: <DiscountCard discountType="bulk" />,
		url: 'https://discoplugin.com/docs/display-woocommerce-bulk-discount-table/',
	},
	{
		id: 'bundle-discount',
		title: __('Bundle Discount', 'disco'),
		description: __(
			'Bundle pricing table for quantity-based deals. Perfect for wholesale or bulk-buy campaigns.',
			'disco'
		),
		preview: <DiscountCard discountType="bundle" />,
		url: 'https://discoplugin.com/docs/display-bundle-discount-table-in-woocommerce/',
	},
];

const FeaturePreviewCards = () => (
	<div className="disco-grid disco-gap-4 disco-w-full disco-grid-cols-1 sm:disco-grid-cols-2 xl:disco-grid-cols-3">
		{FEATURE_CARDS.map((card) => (
			<div
				key={card.id}
				className="disco-bg-white disco-flex disco-flex-col disco-p-4 disco-border disco-border-[#f6f7f9] disco-gap-5 disco-rounded-[12px] disco-justify-between"
			>
				{/* Preview area */}
				<div className="disco-bg-[#fafafa] disco-rounded-[8px] disco-overflow-hidden disco-w-full disco-min-h-[280px]">
					{card.preview}
				</div>

				{/* Content */}
				<div className="disco-flex disco-flex-col disco-gap-3">
					{/* Title row */}
					<div className="disco-flex disco-items-center disco-justify-between">
						<div className="disco-flex disco-items-center disco-gap-2">
							<span className=" disco-text-lg disco-font-bold disco-text-[#1a1d1f]">
								{card.title}
							</span>
						</div>
						<ProBadge />
					</div>

					{/* Description */}
					<p
						className="disco-text-[#64748b] disco-font-normal disco-m-0"
						style={{ fontSize: 14, lineHeight: '20px' }}
					>
						{card.description}
					</p>
				</div>

				{/* CTA button */}
				<a
					href={card.url}
					target="_blank"
					rel="noopener noreferrer"
					className="disco-flex disco-items-center disco-justify-center disco-gap-2 disco-w-full disco-no-underline disco-font-extrabold disco-text-[#fafafa] disco-rounded-[8px] focus:!disco-rounded-[8px] hover:disco-text-white hover:disco-scale-105 disco-transition-all disco-duration-300 disco-h-[40px] disco-border disco-border-[#0dc98b] disco-shadow-[2px_2px_0_rgba(88,98,118,0.32)] disco-text-[16px] focus:!disco-shadow-none focus:!disco-outline-none focus:!disco-border-none disco-bg-primary"
				>
					{__('How it works →', 'disco')}
				</a>
			</div>
		))}
	</div>
);

export default FeaturePreviewCards;
