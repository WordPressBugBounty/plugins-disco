import { CurrencyDollarIcon } from '@heroicons/react/16/solid';
// import notice1 from '../../../../../../../../asset/img/badge-images/notice/notice1.svg';
import { __ } from '@wordpress/i18n';
import product3 from '../../../../../../../../asset/img/badge-images/product-placeholder/product3.svg';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import BannerViewSummary from './BannerViewSummary';

const CartCard = () => {
	return (
		<BadgeCardContainer className="disco-px-12">
			<div className="disco-bg-white disco-px-2 disco-py-2 disco-rounded-md">
				<h1 className="disco-text-[10px] disco-font-semibold">
					{__('Shopping Cart', 'disco')}
				</h1>
				<div className="disco-mt-3">
					<BannerViewSummary />
				</div>
				<div className="disco-flex disco-p-1 disco-bg-gray-50 disco-gap-2 disco-mt-0.5 disco-rounded">
					<div className="disco-bg-white disco-flex disco-justify-center disco-rounded disco-px-3 disco-py-2">
						<img
							src={product3}
							alt="productImage"
							className="disco-h-8"
						/>
					</div>
					<div className="disco-mt-1">
						<p className="disco-text-[9px] disco-flex disco-font-semibold">
							{__('Havit H655BT ANC Noise Cance...', 'disco')}
						</p>
						<div className="disco-text-[8px] disco-font-extralight">
							$28
						</div>
						<div className="disco-inline-flex disco-items-center disco-gap-0.5 disco-bg-red-400 disco-rounded disco-p-0.5 disco-text-white">
							<CurrencyDollarIcon className="disco-h-3 disco-w-3" />
							<div className="disco-text-[7px]">
								{__('SAVE $5.00', 'disco')}
							</div>
						</div>
					</div>
				</div>
				<div className="disco-flex disco-p-1 disco-bg-gray-50 disco-gap-2 disco-mt-1 disco-rounded">
					<div className="disco-bg-white disco-flex disco-justify-center disco-rounded disco-px-3 disco-py-2">
						<img
							src={product3}
							alt="productImage"
							className="disco-h-8"
						/>
					</div>
					<div className="disco-mt-1">
						<p className="disco-text-[9px] disco-flex disco-font-semibold">
							{__('Havit H655BT ANC Noise Cance...', 'disco')}
						</p>
						<div className="disco-text-[8px] disco-font-extralight">
							$28
						</div>
						<div className="disco-inline-flex disco-items-center disco-gap-0.5 disco-bg-red-400 disco-rounded disco-p-0.5 disco-text-white">
							<CurrencyDollarIcon className="disco-h-3 disco-w-3" />
							<div className="disco-text-[7px]">
								{__('SAVE $5.00', 'disco')}
							</div>
						</div>
					</div>
				</div>
				<div className="disco-flex disco-py-0.5 disco-justify-between">
					<span className="disco-text-[10px]">
						{__('Sub-Total', 'disco')}
					</span>
					<span className="disco-text-[10px]">$56</span>
				</div>
				<div className="disco-flex disco-py-0.5 disco-justify-between">
					<span className="disco-text-[10px]">
						{__('Saving', 'disco')}
					</span>
					<span className="disco-text-[10px]">$10</span>
				</div>
				<div className="disco-h-[1px] disco-my-0.5 disco-bg-gray-200"></div>
				<div className="disco-flex disco-py-0.5 disco-justify-between">
					<span className="disco-text-[10px] disco-font-semibold">
						{__('Total', 'disco')}
					</span>
					<span className="disco-text-[10px] disco-font-semibold">
						$46
					</span>
				</div>
				<div className="disco-text-green-600 disco-text-[8px]">
					{__('You saved $10 from your items', 'disco')}
				</div>
			</div>
		</BadgeCardContainer>
	);
};
export default CartCard;
