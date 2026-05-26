import { StarIcon } from '@heroicons/react/16/solid';
import { useSelector } from 'react-redux';
import product2 from '../../../../../../../../asset/img/badge-images/product-placeholder/product2.svg';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import CountDownImg from '../../../../../../utilities/count-down';
import { __ } from '@wordpress/i18n';

const CountdownTimeCard = () => {
	const { countdown } = useSelector((state) => state.discount.design_blocks);

	return (
		<BadgeCardContainer className="disco-p-4">
			<div className="disco-flex disco-items-start disco-gap-3 disco-bg-gray-50 disco-border disco-border-white disco-rounded-md disco-p-4">
				<div className="disco-flex disco-flex-shrink-0 disco-bg-white disco-justify-center disco-items-center disco-rounded-md disco-p-2">
					<img src={product2} alt="img" className="disco-h-18" />
				</div>
				<div>
					<p className="disco-text-[14px] disco-font-medium disco-text-black">
						{__('Man Half T-Shirt', 'disco')}
					</p>
					<div className="disco-mt-0.5 disco-flex disco-justify-between disco-items-center">
						<div className="disco-flex disco-gap-2 disco-items-center">
							<span className="disco-text-[14px] disco-font-bold">
								$165
							</span>
							<span className="disco-text-sm disco-line-through disco-decoration-red-500">
								$285
							</span>
						</div>
					</div>
					<div className="disco-flex disco-gap-1 disco-items-center disco-mt-0.5">
						<div className="disco-font-bold disco-text-xs">4.0</div>
						<div className="disco-flex">
							{[...Array(5)].map((_, index) => (
								<StarIcon
									key={index}
									className={`disco-w-3 disco-h-3 ${
										index < 4
											? 'disco-text-yellow-500'
											: 'disco-text-gray-300'
									}`}
								/>
							))}
						</div>
						<div className="disco-text-gray-500 disco-text-nowrap disco-underline disco-text-[10px]">
							{__('935 reviews', 'disco')}
						</div>
					</div>
					<button className="disco-text-orange-400 disco-text-[10px] disco-border disco-border-orange-400 disco-w-full disco-p-0.5 disco-mt-2">
						{__('Add to Cart', 'disco')}
					</button>
					<div className="disco-mt-2">
						<img
							src={
								countdown?.image?.url || CountDownImg.countDown4
							}
							alt="countdown"
							className="disco-h-20"
						/>
					</div>
				</div>
			</div>
		</BadgeCardContainer>
	);
};

export default CountdownTimeCard;
