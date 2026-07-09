import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink, Outlet, useLocation } from 'react-router';

import AnalyticsBreadcrumb from './AnalyticsBreadcrumb';
import DateRangeFilter from './DateRangeFilter';

const NAV_ITEMS = [
	{ label: 'Dashboard', path: '/', end: true },
	{ label: 'Campaigns Report', path: '/campaigns-reports' },
	{ label: 'Products', path: '/products' },
	{ label: 'Orders', path: '/orders' },
	{ label: 'Customers', path: '/customers' },
];

const DETAIL_PREFIXES = {
	'/campaigns-reports': '/campaigns-reports/',
	'/customers': '/customers/',
};

const AnalyticsLayout = () => {
	const { pathname } = useLocation();

	return (
		<div className="disco-min-h-[calc(100vh-42px)] disco-bg-white">
			<div
				className={cn(
					'disco-sticky disco-top-8 disco-z-50 disco-flex disco-items-center disco-justify-between disco-border-b disco-border-[#e5e7eb] disco-bg-white disco-px-3 disco-py-[13px]'
				)}
			>
				<nav className="disco-flex disco-items-center disco-gap-1">
					{NAV_ITEMS.map(({ label, path, end }) => (
						<NavLink
							key={path}
							to={path}
							end={end}
							className={({ isActive }) =>
								cn(
									buttonVariants({
										variant: 'ghost',
										size: 'sm',
									}),
									'disco-h-7 !disco-rounded-md disco-px-3 disco-text-sm disco-font-medium disco-font-sans disco-no-underline ',
									isActive ||
										(DETAIL_PREFIXES[path] &&
											pathname.startsWith(
												DETAIL_PREFIXES[path]
											))
										? 'disco-bg-[#0dc98b] disco-text-white hover:disco-bg-[#0dc98b] hover:disco-text-white'
										: 'disco-text-gray-600 focus:!disco-text-gray-600 hover:disco-bg-transparent hover:disco-text-gray-600 focus:disco-outline-none visited:disco-outline-none'
								)
							}
						>
							{label}
						</NavLink>
					))}
				</nav>

				<DateRangeFilter />
			</div>

			<AnalyticsBreadcrumb pathname={pathname} NAV_ITEMS={NAV_ITEMS} />

			<Outlet />
		</div>
	);
};

export default AnalyticsLayout;
