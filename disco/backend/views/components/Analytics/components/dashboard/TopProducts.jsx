import { Card } from '@/components/ui/card';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetProductsQuery } from '@/features/products/productsApi';
import useIsPro from '@/lib/useIsPro';
import { cn, fmt, truncate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import EmptyData from '../ui-blocks/EmptyData';
import ProLockOverlay from '../ui-blocks/ProLockOverlay';

const TopProducts = ({ className }) => {
	const isPro = useIsPro();
	const dateParams = useSelector(selectDateRangeParams);
	const { data: res, isLoading } = useGetProductsQuery({
		...dateParams,
		limit: 5,
		sort_by: 'revenue',
		order: 'desc',
	});
	const products = res?.data ?? [];

	if (!isLoading && products.length === 0) {
		return <EmptyData title={'Top products not found!'} />;
	}

	return (
		<Card
			className={cn(
				'disco-relative disco-ring-0 disco-border-2 disco-border-[#e5e7eb] disco-rounded-[10px] disco-p-4 disco-gap-0',
				className
			)}
		>
			{!isPro && !isLoading && (
				<ProLockOverlay
					label={__('Upgrade to See All', 'disco')}
					position="disco-inset-x-0 disco-bottom-0 disco-h-[50%]"
					rounded="disco-rounded-b-[10px]"
				/>
			)}
			<div className="disco-flex disco-items-center disco-justify-between">
				<h3 className="disco-text-base disco-font-semibold disco-text-[#1f2937]">
					{__('Top products by revenue', 'disco')}
				</h3>
				<Link
					to="/products"
					className="disco-text-xs disco-font-medium disco-text-primary hover:disco-underline hover:disco-text-primary"
				>
					{__('View all', 'disco')} →
				</Link>
			</div>

			{isLoading ? (
				<div className="disco-space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="disco-h-8 disco-animate-pulse disco-rounded disco-bg-[#f3f4f6]"
						/>
					))}
				</div>
			) : (
				<ul>
					{products.map(({ id, name, total_revenue, image }) => {
						return (
							<li
								key={id}
								className="disco-py-2 disco-border-b disco-border-[#f3f4f6] last:disco-border-0"
							>
								<div className="disco-flex disco-items-center disco-justify-between disco-mb-1">
									<div className="disco-flex disco-items-center disco-gap-2">
										{image ? (
											<img
												src={image}
												alt={name}
												className="disco-size-5 disco-rounded-lg "
											/>
										) : (
											<span className="disco-size-7 disco-flex disco-items-center disco-justify-center disco-rounded-lg disco-bg-[#f3f4f6] disco-text-sm disco-shrink-0">
												{name?.charAt(0) ?? '?'}
											</span>
										)}
										<span className="disco-text-xs disco-font-medium disco-text-[#1f2937]">
											{truncate(name, 40)}
										</span>
									</div>

									<span className="disco-text-xs disco-font-semibold disco-text-[#111827]">
										{fmt(total_revenue)}
									</span>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</Card>
	);
};

export default TopProducts;
