import { useEffect, useRef, useState } from 'react';
import searchIcon from '../../../../asset/img/icons/search.png';

export default function SearchInput({
	searchQuery,
	setSearchQuery,
	searchResults,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const wrapperRef = useRef(null);

	const popularTopics = [
		'How to install',
		'BOGO',
		'Bulk discounts',
		'Conditions',
		'Upgrade to Pro',
	];

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleChange = (e) => {
		setSearchQuery(e.target.value);
		setIsOpen(true);
	};

	const handleTopicClick = (topic) => {
		setSearchQuery(topic);
		setIsOpen(true);
	};

	const handleResultClick = () => {
		setIsOpen(false);
	};

	const handleClear = () => {
		setSearchQuery('');
		setIsOpen(false);
	};

	const showDropdown =
		isOpen && searchQuery.trim() && searchResults !== undefined;

	return (
		<>
			<div
				className="disco-w-full disco-h-11 disco-relative disco-my-5"
				ref={wrapperRef}
			>
				<input
					type="text"
					id="search"
					value={searchQuery}
					onChange={handleChange}
					onFocus={() => {
						setIsFocused(true);
						searchQuery.trim() && setIsOpen(true);
					}}
					onBlur={() => setIsFocused(false)}
					placeholder={`Search docs\u2026 e.g. "BOGO setup", "conditions", "multi-currency"`}
					className="disco-w-full disco-h-full !disco-rounded-2xl disco-py-3 !disco-px-10 disco-border-2 disco-text-sm !disco-placeholder:text-[rgba(0, 0, 0, 0.35)] !disco-bg-gray-100 focus:outline-none disco-transition-colors disco-duration-200"
					style={{
						boxShadow: 'none',
						borderColor: isFocused ? '#47CD89' : '#D1D5DB',
					}}
				/>
				<img
					src={searchIcon}
					className="disco-absolute disco-top-1/2 disco-left-3 disco-transform disco--translate-y-1/2 disco-w-4 disco-h-4"
					alt="Search icon"
				/>
				{searchQuery && (
					<button
						onClick={handleClear}
						className="disco-absolute disco-top-1/2 disco-right-3 disco-transform disco--translate-y-1/2 disco-text-gray-400 hover:disco-text-gray-600 disco-bg-transparent disco-border-none disco-cursor-pointer disco-p-0 disco-leading-none"
						aria-label="Clear search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="disco-w-4 disco-h-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}

				{/* Search results dropdown */}
				{showDropdown && (
					<div className="disco-absolute disco-top-full disco-left-0 disco-right-0 disco-mt-1 disco-bg-white disco-rounded-xl disco-border disco-border-gray-200 disco-shadow-lg disco-z-50 disco-max-h-72 disco-overflow-y-auto">
						{searchResults.length > 0 ? (
							<>
								<p className="disco-text-xs disco-text-gray-400 disco-font-semibold disco-px-4 disco-pt-3 disco-pb-1 disco-m-0">
									{searchResults.length} result
									{searchResults.length !== 1 ? 's' : ''}{' '}
									found
								</p>
								{searchResults.map((result, i) => (
									<a
										key={i}
										href={result.link}
										target="_blank"
										rel="noopener noreferrer"
										onClick={handleResultClick}
										className="disco-flex disco-items-center disco-gap-3 disco-px-4 disco-py-2.5 hover:disco-bg-gray-50 disco-transition-colors disco-duration-150 disco-border-b disco-border-gray-100 last:disco-border-b-0"
									>
										<svg
											className="disco-w-4 disco-h-4 disco-text-gray-300 disco-flex-shrink-0"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										<div className="disco-flex-1 disco-min-w-0">
											<p className="disco-text-sm disco-font-medium disco-text-gray-800 disco-m-0 disco-truncate">
												{result.title}
											</p>
											<p className="disco-text-xs disco-text-gray-400 disco-m-0 disco-truncate">
												{result.section}
												{result.excerpt
													? ` \u00b7 ${result.excerpt}\u2026`
													: ''}
											</p>
										</div>
										<svg
											className="disco-w-3.5 disco-h-3.5 disco-text-gray-300 disco-flex-shrink-0"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
									</a>
								))}
							</>
						) : (
							<div className="disco-px-4 disco-py-6 disco-text-center">
								<p className="disco-text-sm disco-text-gray-400 disco-m-0">
									No results found for{' '}
									<strong>{searchQuery}</strong>
								</p>
								<p className="disco-text-xs disco-text-gray-300 disco-mt-1 disco-m-0">
									Try a different keyword
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="disco-flex !disco-items-center disco-gap-2">
				<p className="disco-text-sm disco-text-gray-400 disco-font-bold disco-leading-7">
					Popular:{' '}
				</p>
				<div className="disco-flex disco-flex-wrap disco-gap-2">
					{popularTopics.map((topic, index) => (
						<span
							key={index}
							onClick={() => handleTopicClick(topic)}
							className="disco-text-xs disco-bg-gray-100 disco-rounded-full disco-px-3 disco-py-1 disco-border disco-border-gray-300 disco-cursor-pointer hover:disco-bg-gray-200 disco-transition-colors disco-duration-150"
						>
							{topic}
						</span>
					))}
				</div>
			</div>
		</>
	);
}
