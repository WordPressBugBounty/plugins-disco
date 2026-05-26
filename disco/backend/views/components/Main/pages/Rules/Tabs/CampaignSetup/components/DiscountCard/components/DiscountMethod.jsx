import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../../../components/Input';
import { useGetDiscountMethodsQuery } from '../../../../../../../features/discount/discountApi';
import { updateOption } from '../../../../../../../features/discount/discountSlice';

const DiscountMethod = () => {
	const { data: discountMethods, isLoading } = useGetDiscountMethodsQuery();

	const { discount_method, discount_coupon } = useSelector(
		(state) => state.discount
	);
	const dispatch = useDispatch();

	const handleMethodChange = (value) => {
		if (value === 'automated') {
			dispatch(updateOption({ option: 'discount_coupon', value: '' }));
		}
		dispatch(updateOption({ option: 'discount_method', value }));
	};

	const handleCouponGenerate = () => {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		let randomWord = '';

		for (let i = 0; i < 6; i++) {
			const randomIndex = Math.floor(Math.random() * alphabet.length);
			randomWord += alphabet[randomIndex];
		}
		dispatch(
			updateOption({ option: 'discount_coupon', value: randomWord })
		);
	};

	const handleCouponChange = (e) => {
		dispatch(
			updateOption({ option: 'discount_coupon', value: e.target.value })
		);
	};

	if (isLoading) {
		return (
			<div className="disco-py-[14px] disco-flex disco-items-center disco-gap-6">
				<div className="disco-flex disco-items-center ">
					<div className="disco-h-5 disco-w-5 disco-bg-gray-300 disco-rounded-full disco-animate-pulse"></div>
					<div className="disco-ml-2  disco-bg-gray-300 disco-rounded-full disco-animate-pulse">
						<label className="disco-opacity-0 disco-text-sm disco-text-gray-800 disco-font-medium">
							{__('Automated Discount', 'disco')}
						</label>
					</div>
				</div>
				<div className="disco-flex disco-items-center ">
					<div className="disco-h-5 disco-w-5 disco-bg-gray-300 disco-rounded-full disco-animate-pulse"></div>
					<div className="disco-ml-2  disco-bg-gray-300 disco-rounded-full disco-animate-pulse">
						<label className="disco-opacity-0 disco-text-sm disco-text-gray-800 disco-font-medium">
							{__('Automated Discount', 'disco')}
						</label>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="disco-flex disco-items-center disco-gap-6">
			{Object.keys(discountMethods?.values || {}).map(
				(discountMethod) => (
					<div
						key={discountMethod}
						className="disco-flex disco-items-center"
					>
						<input
							onChange={() => handleMethodChange(discountMethod)}
							checked={discountMethod === discount_method}
							id={discountMethod}
							name="discount-method"
							type="radio"
							className="disco-h-4 disco-w-4 disco-border-gray-300 disco-text-primary focus:disco-ring-primary"
						/>
						<label
							htmlFor={discountMethod}
							className={`disco-ml-1 disco-text-sm disco-text-gray-800 disco-font-medium disco-py-4 -disco-mt-[2.5px] ${
								discountMethod === discount_method
									? 'disco-text-black'
									: 'disco-text-gray-800'
							}`}
						>
							{discountMethods.values[discountMethod]}
						</label>
					</div>
				)
			)}
			{discount_method === 'coupon' && (
				<div className="disco-relative disco-h-full disco-flex disco-gap-3">
					<Input
						onChange={handleCouponChange}
						value={discount_coupon}
						placeholder="COUPON25"
						className="disco-text-sm"
					/>

					<button
						className="disco-absolute disco-top-px disco-right-px disco-bottom-px disco-rounded-e-md disco-flex disco-justify-center disco-items-center disco-aspect-square disco-group disco-bg-gray-200 disco-font-medium disco-text-base"
						onClick={handleCouponGenerate}
					>
						<ArrowPathIcon className="disco-text-gray-700 disco-h-4 disco-w-4" />
						<div className="disco-flex disco-opacity-0 group-hover:disco-opacity-100 -disco-top-7 disco-left-0  disco-absolute  disco-justify-center disco-text-white ">
							<span className=" disco-z-20 disco-text-xs disco-px-1 disco-pb-0.5 disco-rounded-sm disco-whitespace-nowrap disco-bg-[#9DB4FF]">
								{__('Auto Generate', 'disco')}
							</span>
							<span className="disco-z-10 -disco-bottom-1 disco-left-4 disco-absolute disco-h-2 disco-w-2 disco-bg-[#9DB4FF] disco-rotate-45"></span>
						</div>
					</button>
				</div>
			)}
		</div>
	);
};
export default DiscountMethod;
