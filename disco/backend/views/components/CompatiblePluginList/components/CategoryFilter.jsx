import { CATEGORIES } from '../data/plugins';

function CategoryFilter({ activeCategory, onCategoryChange }) {
	return (
		<div className="disco-flex disco-flex-wrap disco-gap-2 disco-justify-center disco-px-4 disco-pb-6">
			{CATEGORIES.map((category) => (
				<button
					key={category}
					onClick={() => onCategoryChange(category)}
					className={`disco-px-4 disco-py-1.5 disco-rounded-full disco-text-sm disco-font-medium disco-transition-colors disco-duration-150 disco-border ${
						activeCategory === category
							? 'disco-bg-[#10C88A] disco-text-white disco-border-[#10C88A]'
							: 'disco-bg-white disco-text-[#4B5563] disco-border-gray-200 hover:disco-border-[#10C88A] hover:disco-text-[#10C88A]'
					}`}
				>
					{category}
				</button>
			))}
		</div>
	);
}

export default CategoryFilter;
