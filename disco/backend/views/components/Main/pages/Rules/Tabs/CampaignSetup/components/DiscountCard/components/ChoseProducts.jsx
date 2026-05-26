import {ChevronDownIcon, InformationCircleIcon, XMarkIcon} from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct } from '../../../../../../../features/discount/discountSlice';
import SearchProduct from './SearchProduct';
import {useEffect, useRef, useState} from "react";

const ChoseProducts = () => {
	const { products: selectedProducts } = useSelector(
		(state) => state.discount
	);
	const dispatch = useDispatch();
	const handleRemoveProduct = (product) => {
		dispatch(removeProduct(product));
	};

	const [showDropdown, setShowDropdown] = useState(false);
	// Toggle dropdown visibility
	const handleToggleDropdown = () => {
		setShowDropdown((prev) => !prev);
	};

	const dropdownRef = useRef(null);

	// Handle clicks outside the dropdown
	useEffect(() => {
		const handler = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false); // Hide the dropdown when clicking outside
			}
		}

		// Add event listener when dropdown is shown
		if (showDropdown) {
			document.addEventListener('mousedown', handler);
		} else {
			document.removeEventListener('mousedown', handler);
		}

		// Clean up event listener on unmount
		return () => {
			document.removeEventListener('mousedown', handler);
		};
	}, [showDropdown]);

	return (
		<div>
			<div className="disco-flex disco-gap-4">
				<SearchProduct/>
				<div
					className="disco-border disco-flex disco-items-start disco-gap-2 disco-flex-wrap disco-bg-white disco-min-h-[80px] disco-w-full disco-rounded-lg disco-p-3"
				>
					{selectedProducts.length > 0 ? (
						<>
							{/* Show the first 7 products */}
							{selectedProducts.slice(0, 7).map((product) => (
								<div
									key={product.id}
									className="disco-bg-white disco-border disco-rounded-md disco-ps-2 disco-py-0.5 disco-flex disco-items-center disco-gap-2"
								>
									<img src={product.image} className="disco-h-5 disco-w-5"/>
									<span className="disco-text-base">{`${product.name} `}</span>
									<button
										className="disco-font-medium disco-select-none disco-pr-1"
										onClick={() => handleRemoveProduct(product)}
									>
										<XMarkIcon className="disco-h-4 disco-w-4"/>
									</button>
								</div>
							))}

							{/* Show 'See More' button if there are more than 7 products */}
							{selectedProducts.length > 7 && (
								<div className="disco-relative">
									<button
										className="disco-bg-white disco-text-base disco-border disco-border-primary disco-text-black disco-px-3 disco-py-0.5 disco-rounded-md disco-flex disco-items-center"
										onClick={handleToggleDropdown}
									>
										See More {selectedProducts.length - 7} Products
										<ChevronDownIcon className="disco-h-4 disco-w-4 disco-text-primary disco-ml-2"/>
									</button>

									{/* Dropdown Menu */}
									{showDropdown && (
										<div
											ref={dropdownRef}
											className="disco-absolute disco-z-10 disco-bg-white disco-border disco-shadow-lg disco-rounded-md disco-min-w-60 disco-max-w-100 disco-mt-2 disco-max-h-60 disco-overflow-y-auto disco-p-2">
											{selectedProducts.slice(7).map((product) => (
												<div
													key={product.id}
													className="disco-flex disco-items-center disco-gap-2 disco-p-1 disco-mb-1 disco-rounded-md hover:disco-bg-gray-100"
												>
													{/* Product Info */}
													<div className="disco-flex disco-flex-col disco-gap-1">
														<div className="disco-flex disco-justify-center disco-items-center disco-gap-1">
															<span
																className="disco-flex disco-gap-1 disco-items-center disco-text-red-600 disco-text-xs disco-cursor-pointer"
																onClick={() => handleRemoveProduct(product)}
															>
																<XMarkIcon className="disco-h-4 disco-w-4"/>
																<img src={product.image} className="disco-h-5 disco-w-5"/>
															</span>
															<span
																className="disco-text-base"> {`${product.name}`} </span>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							{/* Total Products Count */}
							<div className="disco-w-full disco-flex disco-gap-1 disco-mt-2 disco-text-sm disco-text-gray-700">
								<InformationCircleIcon className="disco-h-5 disco-w-5 disco-text-amber-400" />
								<p>{`Total ${selectedProducts.length} products have been selected.`}</p>
							</div>
						</>
					) : (
						<div>
							<p className="disco-text-gray-500">
								{__('Selected Product Will Appear Here.', 'disco')}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default ChoseProducts;
