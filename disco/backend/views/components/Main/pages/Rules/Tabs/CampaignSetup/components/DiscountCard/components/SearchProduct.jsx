import {
	CheckIcon,
	MagnifyingGlassIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { __ } from '@wordpress/i18n';
import { updateProducts } from '../../../../../../../features/discount/discountSlice';
import { useGetProductsQuery } from '../../../../../../../features/search/searchApi';

const SearchProduct = () => {
	const searchRef = useRef();
	const dispatch = useDispatch();
	const dropdownRef = useRef();

	const [skip, setSkip] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [showSearchResult, setShowSearchResult] = useState(false);
	const { products: selectedProducts } = useSelector(
		(state) => state.discount
	);
	const {
		data: products,
		isError,
		isLoading,
		error,
	} = useGetProductsQuery(searchQuery, {
		skip,
	});

	// handle dropdown outside click
	useEffect(() => {
		const handler = (e) => {
			if (!dropdownRef.current.contains(e.target)) {
				setShowSearchResult(false);
				searchRef.current.value = '';
			}
		};
		document.addEventListener('mousedown', handler);
		return () => {
			document.removeEventListener('mousedown', handler);
		};
	}, []);

	// search field close button click handler
	const handleClose = () => {
		setShowSearchResult(false);
		setSkip(true);
		setSearchQuery('');
		searchRef.current.value = '';
	};

	// handle product select
	const handleSelect = (product) => {
		dispatch(updateProducts(product));
	};

	// debounce functionality start
	const debounceHandler = (fn, delay) => {
		let timeoutId;
		return (...args) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				fn(...args);
			}, delay);
		};
	};

	const doSearch = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		if (query.trim().length === 0) {
			setShowSearchResult(false);
			setSkip(true);
			return;
		}
		setSkip(false);
		setShowSearchResult(true);
	};
	const handleSearch = debounceHandler(doSearch, 500);
	// debounce functionality end

	// set content for different state
	let content = '';

	// product loading state content
	if (isLoading) {
		content = (
			<div className="disco-py-4">
				{__('Product Searching...', 'disco')}
			</div>
		);
	}

	// error state content
	if (isError) {
		content = <div className="disco-py-4">{error?.data?.message}</div>;
	}

	// successfully product fetching state
	if (showSearchResult && !isError && !isLoading) {
		content = products.map((product) => (
			<div
				onClick={(e) => {
					e.preventDefault();
					handleSelect(product);
				}}
				key={product.id}
				className="disco-flex disco-items-center disco-gap-4 disco-my-4"
			>
				<label
					className={`disco-text-sm disco-flex disco-items-center disco-gap-3 `}
					htmlFor={product.id}
				>
					<div
						className={`disco-shrink-0 disco-h-4 disco-w-4 disco-rounded disco-border disco-flex disco-justify-center disco-items-center ${
							selectedProducts.find(
								(_product) => _product.id === product.id
							)
								? 'disco-border-primary-dark'
								: 'disco-border-gray-500 '
						}`}
					>
						{selectedProducts.find(
							(_product) => _product.id === product.id
						) && <CheckIcon className="disco-text-primary-dark" />}
					</div>
					<img
						className="disco-shrink-0 disco-rounded disco-h-8 disco-w-8 disco-object-cover"
						src={product.image}
						alt={product.name}
					/>
					<span>{`${product.id} - ${product.name}`}</span>
				</label>
			</div>
		));
	}

	return (
		<div ref={dropdownRef} className="disco-relative">
			<div className="disco-relative">
				<input
					onFocus={(e) => {
						if (e.target.value.length > 0) {
							setShowSearchResult(true);
						}
					}}
					ref={searchRef}
					name="search_products"
					onChange={handleSearch}
					className="disco-w-80 !disco-rounded-md !disco-pe-1 !disco-ps-9 !disco-py-1 !disco-border-1 !disco-border-gray-200 !disco-shadow-none focus:!disco-border-primary  disco-text-base disco-outline-none"
					type="text"
					placeholder={__('Search Product', 'disco')}
				/>
				<div className="disco-absolute disco-top-0 disco-bottom-0 disco-left-3  disco-h-full disco-flex disco-items-center disco-justify-center">
					{searchQuery.length > 0 ? (
						<button
							onClick={handleClose}
							className="disco-h-5 disco-w-5 disco-text-gray-400"
						>
							<XMarkIcon />
						</button>
					) : (
						<MagnifyingGlassIcon className="disco-h-5 disco-w-5 disco-text-gray-400" />
					)}
				</div>
			</div>
			{showSearchResult && (
				<div className="disco-absolute disco-mt-2 disco-w-full disco-shadow-lg disco-z-50">
					<div className="disco-border disco-border-gray-200 disco-bg-white  disco-rounded-md disco-px-4 disco-max-h-96 disco-overflow-y-auto">
						{content}
					</div>
				</div>
			)}
		</div>
	);
};
export default SearchProduct;
