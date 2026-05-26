import { StarIcon } from '@heroicons/react/16/solid';
import { useSelector } from 'react-redux';
import product2 from '../../../../../../../../asset/img/badge-images/product-placeholder/product2.svg';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import DiscountCardRow from './DiscountCardRow';
import { __ } from '@wordpress/i18n';

const DiscountCard = ({ discountType }) => {
	const { table } = useSelector((state) => state.discount.design_blocks);
	const BULK_ROWS = [
		{ title: '10% OFF', discount: '10%', range: '1-4' },
		{ title: '20% OFF', discount: '20%', range: '5-6' },
		{ title: '30% OFF', discount: '20%', range: '5-6' },
	];

	const BUNDLE_ROWS = [
		{ title: '10% OFF', discount: '10%', qty: '10', bg: '#fff' },
		{ title: '15% OFF', discount: '15%', qty: '15', bg: '#fafafa' },
		{ title: '20% OFF', discount: '20%', qty: '20', bg: '#fff' },
		{ title: '25% OFF', discount: '25%', qty: '25', bg: '#fafafa' },
	];

	return (
		<BadgeCardContainer className="disco-p-2">
			<div className="disco-flex disco-items-center disco-justify-center disco-w-full disco-h-full disco-py-4">
				{/* Outer card */}
				<div className="disco-bg-[#fafafa] disco-border-2 disco-border-white disco-rounded-[8px] disco-shadow-[0_0_18px_5px_rgba(238,238,238,0.4)] disco-p-3 disco-flex disco-gap-[9px] disco-items-start disco-overflow-hidden">
					{/* Product photo */}
					<div className="disco-bg-white disco-rounded-[7px] disco-flex disco-items-center disco-justify-center disco-shrink-0 disco-w-[72px] disco-h-[74px]">
						<img
							src={product2}
							alt="Product"
							className="disco-w-[60px] disco-h-[40px] disco-object-contain"
						/>
					</div>

					{/* Right content */}
					<div className="disco-flex disco-flex-col disco-gap-[7px]">
						{/* Product name */}
						<p className="disco-text-[10px] disco-font-medium disco-text-[rgba(0,0,0,0.87)] disco-whitespace-nowrap">
							{__('Women Winter Sweater', 'disco')}
						</p>

						{/* Rating row */}
						<div className="disco-flex disco-items-center disco-gap-[3px]">
							<span className="disco-text-[8px] disco-font-extrabold disco-text-[rgba(0,0,0,0.87)]">
								4.0
							</span>
							<div className="disco-flex disco-gap-[2px]">
								{[0, 1, 2, 3].map((i) => (
									<StarIcon
										key={i}
										className="disco-w-[8px] disco-h-[8px] disco-text-yellow-500"
									/>
								))}
								<StarIcon
									key="empty"
									className="disco-w-[8px] disco-h-[8px] disco-text-gray-300"
								/>
							</div>
							<span className="disco-text-[7px] disco-text-[rgba(0,0,0,0.3)] disco-underline">
								{__('935 reviews', 'disco')}
							</span>
						</div>

						{/* Price */}
						<div className="disco-flex disco-items-center disco-gap-2">
							<span className="disco-text-[12px] disco-font-bold disco-text-black">
								$165
							</span>
							<span className="disco-relative disco-text-[10px] disco-text-black">
								$285
								<span className="disco-absolute disco-bg-[#ff1d1d] disco-h-[1px] disco-left-0 disco-right-0 disco-top-1/2" />
							</span>
						</div>

						{/* Add to Cart button */}
						<div className="disco-flex disco-items-center disco-justify-center disco-border-[#3056d3] disco-border-[0.5px] disco-py-[3px] disco-text-[5px] disco-text-[#3056d3] disco-font-semibold disco-w-[91px] disco-cursor-default">
							{__('Add to Cart', 'disco')}
						</div>

						{/* Pricing table */}
						<table className="disco-overflow-hidden disco-rounded-[4px] disco-shadow-[0_0_22px_6px_rgba(201,201,201,0.4)] disco-w-[170px]">
							<thead>
								<tr
									className={` disco-flex disco-justify-around disco-items-center disco-bg-[#ff595e] disco-h-[17px]`}
									style={{
										background:
											table?.heading_customization
												?.background,
									}}
								>
									{Object.values(table?.heading).map(
										(heading, index) => (
											<th
												key={index}
												className=" disco-text-white disco-text-[6px] disco-font-semibold"
											>
												{heading}
											</th>
										)
									)}
								</tr>
							</thead>

							<tbody>
								{/* Rows */}
								{discountType === 'bulk'
									? BULK_ROWS.map((row, index) => (
											<DiscountCardRow
												key={index}
												row={row}
												type="bulk"
												buttonStyle={table?.button}
											/>
										))
									: BUNDLE_ROWS.map((row, index) => (
											<DiscountCardRow
												key={index}
												row={row}
												type="bundle"
												buttonStyle={table?.button}
											/>
										))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</BadgeCardContainer>
	);
};

export default DiscountCard;
