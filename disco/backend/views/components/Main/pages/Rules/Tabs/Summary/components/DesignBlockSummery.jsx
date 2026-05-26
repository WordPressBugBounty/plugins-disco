import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../components/Button';
import { setTab } from '../../../../../features/discount/discountSlice';
import DiscountCard from '../../DesignBlock/BulkBundleDiscountPage/components/DiscountCard';
import CartCard from '../../DesignBlock/CartPage/components/CartCard';
import CountdownTimeCard from '../../DesignBlock/CountDownTime/components/CountdownTimeCard';
import ProductBadgeCard from '../../DesignBlock/ProductBadges/components/ProductBadgeCard';
import TextHighlightCard from '../../DesignBlock/TextHighlight/components/TextHighlightCard';
import { __ } from '@wordpress/i18n';

const DesignBlockSummery = ({ className }) => {
	const { design_blocks } = useSelector((state) => state.discount);
	const dispatch = useDispatch();

	const handleNavigation = () => {
		dispatch(setTab(1));
	};

	const ComponentMap = {
		badge: ProductBadgeCard,
		countdown: CountdownTimeCard,
		text_highlight: TextHighlightCard,
		cart: CartCard,
		table: DiscountCard,
	};

	if (!design_blocks) return null;

	const cardKeys = Object.keys(design_blocks);
	const enabledComponents = cardKeys.filter((key) => {
		const isEnabled = design_blocks[key]?.enable;
		const ComponentToRender = ComponentMap[key];
		return isEnabled && ComponentToRender;
	});

	return (
		<div className={`${className}`}>
			<div className="disco-flex disco-gap-6">
				<p className="disco-text-xl disco-font-semibold">
					{__('Design Block', 'disco')}
				</p>
				<Button
					type="transparent"
					onClick={handleNavigation}
					className="!disco-px-3 !disco-py-1 !disco-font-light disco-text-sm disco-border disco-border-gray-300 disco-rounded-lg"
					icon={
						<PencilSquareIcon className="disco-h-4 disco-w-4 disco-text-primary" />
					}
				>
					{__('Edit Now', 'disco')}
				</Button>
			</div>

			<div className="disco-p-4 disco-grid disco-grid-cols-3 disco-mt-4 disco-gap-4 disco-border disco-rounded-xl">
				{enabledComponents.length > 0 ? (
					enabledComponents.map((key) => {
						const ComponentToRender = ComponentMap[key];
						return <ComponentToRender key={key} />;
					})
				) : (
					<div className="disco-col-span-3 disco-text-center disco-text-gray-500">
						<h1 className="disco-text-gray-500 disco-text-base">
							{__('No Design Block Enabled!', 'disco')}
						</h1>
					</div>
				)}
			</div>
		</div>
	);
};

export default DesignBlockSummery;
