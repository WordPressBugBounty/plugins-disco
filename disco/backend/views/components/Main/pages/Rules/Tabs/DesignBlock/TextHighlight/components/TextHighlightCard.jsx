import { StarIcon } from '@heroicons/react/16/solid';
import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';
import textHighlight from '../../../../../../../../asset/img/badge-images/badge/textHighlight.svg';
import product2 from '../../../../../../../../asset/img/badge-images/product-placeholder/product2.svg';
import BadgeCardContainer from '../../components/BadgeCardContainer';

const TextHighlightCard = ({}) => {
	const { image } = useSelector(
		(state) => state.discount.design_blocks.text_highlight
	);

	return (
		<BadgeCardContainer className="disco-py-12 disco-px-3">
			<div className="disco-flex disco-gap-3 disco-bg-gray-50 disco-border disco-border-white disco-rounded-md disco-px-3 disco-py-6">
				<div className="disco-bg-white disco-flex disco-justify-center disco-items-center disco-rounded-md disco-px-6">
					<img src={product2} alt="img" className="disco-h-20" />
				</div>
				<div>
					<p className="disco-text-base disco-font-medium disco-text-black">
						{__('Full Shirt for Men', 'disco')}
					</p>
					<div className="disco-mt-0.5 disco-flex disco-justify-between disco-items-center">
						<div className="disco-flex disco-gap-2 disco-items-center">
							<span className="disco-text-sm disco-font-bold">
								$165
							</span>
							<span className="disco-text-xs disco-line-through disco-decoration-red-500">
								$285
							</span>
						</div>
					</div>
					<img
						src={image?.url || textHighlight}
						alt="textHighlight"
						className="disco-h-8 disco-mt-0.5 disco-max-w-20 disco-w-full"
					/>
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
						<div className="disco-text-gray-500 disco-underline disco-text-[10px]">
							{__('935 reviews', 'disco')}
						</div>
					</div>
					<button className="disco-text-orange-400 disco-text-[10px] disco-border disco-border-orange-400 disco-w-full disco-p-0.5 disco-mt-1">
						{__('Add to Cart', 'disco')}
					</button>
				</div>
			</div>
		</BadgeCardContainer>
	);
};

export default TextHighlightCard;
