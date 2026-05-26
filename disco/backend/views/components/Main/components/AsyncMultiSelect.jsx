import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from 'react';

const AsyncMultiSelect = ({
	onChange,
	queryHook,
	selected = [],
	placeHolder,
	endpoint = '',
	widthClass = 'disco-w-96',
}) => {
	const searchRef = useRef();
	const dropdownRef = useRef();
	const debounceRef = useRef(null);

	const [skip, setSkip] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [selectedItems, setSelectedItems] = useState(selected);

	const { data, isError, isLoading, error } = queryHook(
		{ endpoint, searchQuery },
		{
			skip,
		}
	);

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

	useEffect(() => {
		onChange(selectedItems);
	}, [selectedItems]);

	// handle item select
	const handleSelect = (item) => {
		if (selectedItems.find((_item) => _item.id === item.id)) {
			setSelectedItems(
				selectedItems.filter((_item) => _item.id !== item.id)
			);
		} else {
			setSelectedItems((prevState) => [...prevState, item]);
		}
	};

	const handleRemoveItem = (id) => {
		setSelectedItems(selectedItems.filter((_item) => _item.id !== id));
	};

	const handleSearch = (e) => {
		const query = e.target.value;
		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setSearchQuery(query);
			if (query.trim().length === 0) {
				setShowSearchResult(false);
				setSkip(true);
				return;
			}
			setSkip(false);
			setShowSearchResult(true);
		}, 500);
	};

	// set content for different state
	let content = '';

	// item loading state content
	if (isLoading) {
		content = (
			<div className="disco-py-4">{__('Searching...', 'disco')}</div>
		);
	}

	// error state content
	if (isError) {
		content = <div className="disco-py-4">{error?.data?.message}</div>;
	}

	// successfully item fetching state
	if (showSearchResult && !isError && !isLoading) {
		content = data.map((item) => (
			<div
				key={item.id}
				className="disco-flex disco-items-center disco-gap-4 disco-my-4"
			>
				<input
					checked={selected.find((_item) => _item.id === item.id)}
					type="checkbox"
					name=""
					id={item.id}
					onChange={() => handleSelect(item)}
					className="!disco-hidden"
				/>

				<label
					className={`disco-text-sm disco-flex disco-items-center disco-gap-3 `}
					htmlFor={item.id}
				>
					<div
						className={`disco-shrink-0 disco-h-4 disco-w-4 disco-rounded disco-border disco-flex disco-justify-center disco-items-center ${
							selected.find((_item) => _item.id === item.id)
								? 'disco-border-primary-dark'
								: 'disco-border-gray-500 '
						}`}
					>
						{selected.find((_item) => _item.id === item.id) && (
							<CheckIcon className="disco-text-primary-dark" />
						)}
					</div>
					{item.image && (
						<img
							className="disco-shrink-0 disco-rounded disco-h-8 disco-w-8 disco-object-cover"
							src={item.image}
							alt={item.name}
						/>
					)}
					<span>{`${item.id} - ${item.name}`}</span>
				</label>
			</div>
		));
	}

	return (
		<div ref={dropdownRef} className={`disco-relative ${widthClass}`}>
			<div className="disco-relative disco-max-w-md disco-border disco-border-gray-200 disco-rounded-md">
				<div
					onClick={() => {
						searchRef.current.focus();
					}}
					className="disco-flex disco-gap-1.5 disco-flex-wrap disco-items-center !disco-rounded-md disco-px-2 disco-py-1.5 disco-text-sm disco-outline-none"
				>
					{selected.length > 0 &&
						selected.map((item) => (
							<div
								className="disco-text-xs disco-px-1.5 disco-py-1.5 disco-rounded disco-flex disco-items-center disco-bg-gray-200"
								key={item.id}
							>
								<span>{`${item.id} - ${item.name}`}</span>

								<XMarkIcon
									role="button"
									onClick={() => handleRemoveItem(item.id)}
									className="disco-ml-1 disco-h-3 disco-w-3 "
								/>
							</div>
						))}
					<input
						onFocus={(e) => {
							if (e.target.value.length > 0) {
								setShowSearchResult(true);
							}
						}}
						ref={searchRef}
						onChange={handleSearch}
						className="!disco-border-none !disco-p-0 !disco-min-h-[0px] !disco-shadow-none"
						type="text"
						placeholder={placeHolder}
					/>
				</div>
			</div>
			{showSearchResult && (
				<div
					className={`disco-absolute disco-mt-2 ${widthClass} disco-shadow-lg disco-z-50`}
				>
					<div className="disco-border disco-border-gray-200 disco-bg-white  disco-rounded-md disco-px-4 disco-max-h-96 disco-overflow-y-auto">
						{content}
					</div>
				</div>
			)}
		</div>
	);
};
export default AsyncMultiSelect;
