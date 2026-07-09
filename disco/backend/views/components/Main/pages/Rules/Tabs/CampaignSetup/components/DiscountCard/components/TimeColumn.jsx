import { useEffect, useRef } from 'react';

const TimeColumn = ({ items, selected, onSelect, formatItem }) => {
	const containerRef = useRef(null);
	const selectedRef = useRef(null);

	useEffect(() => {
		if (selectedRef.current && containerRef.current) {
			selectedRef.current.scrollIntoView?.({
				block: 'center',
				behavior: 'instant',
			});
		}
	}, [selected]);

	return (
		<div
			ref={containerRef}
			className="disco-flex disco-flex-col disco-gap-0.5 disco-overflow-y-auto disco-px-1 disco-h-52 disco-no-scrollbar disco-overscroll-contain"
		>
			{items.map((item) => {
				const isSelected = item === selected;
				return (
					<button
						key={item}
						ref={isSelected ? selectedRef : null}
						onClick={() => onSelect(item)}
						className={`disco-flex disco-h-7 disco-min-h-7 disco-w-10 disco-cursor-pointer disco-items-center disco-justify-center disco-rounded-md disco-text-xs disco-font-medium disco-transition-colors ${
							isSelected
								? 'disco-text-white disco-bg-primary'
								: 'disco-text-gray-600 hover:disco-bg-gray-100'
						}`}
					>
						{formatItem ? formatItem(item) : item}
					</button>
				);
			})}
		</div>
	);
};

export default TimeColumn;
