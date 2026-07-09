import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useGetCampaignQuery } from '@/features/campaigns/campaignsApi';
import { useGetCustomerQuery } from '@/features/customers/customersApi';
import { NavLink, useParams } from 'react-router';

const DETAIL_ROUTES = [
	{
		match: '/campaigns-reports/',
		parent: { label: 'Campaigns Report', path: '/campaigns-reports' },
		current: 'Campaign Details',
		type: 'campaign',
	},
	{
		match: '/customers/',
		parent: { label: 'Customers', path: '/customers' },
		current: 'Customer Details',
		type: 'customer',
	},
];

const linkClass =
	'disco-no-underline hover:disco-text-primary focus:disco-text-primary';

const AnalyticsBreadcrumb = ({ pathname, NAV_ITEMS }) => {
	const detail = DETAIL_ROUTES.find((r) => pathname.startsWith(r.match));
	const { campaignId, customerId } = useParams();

	const { data: customerData } = useGetCustomerQuery(
		{ id: customerId },
		{ skip: detail?.type !== 'customer' || !customerId }
	);
	const { data: campaignData } = useGetCampaignQuery(
		{ id: campaignId },
		{ skip: detail?.type !== 'campaign' || !campaignId }
	);

	if (pathname === '/') return null;

	const dynamicLabel =
		detail?.type === 'customer'
			? customerData?.data?.name
			: detail?.type === 'campaign'
				? campaignData?.campaign_name
				: null;
	const currentLabel = detail ? dynamicLabel : null;

	return (
		<Breadcrumb>
			<BreadcrumbList className="disco-px-3 disco-py-2 disco-bg-[#f9fafb]">
				<BreadcrumbItem>
					<BreadcrumbLink
						render={<NavLink to="/" end className={linkClass} />}
					>
						Dashboard
					</BreadcrumbLink>
				</BreadcrumbItem>

				{detail ? (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								render={
									<NavLink
										to={detail.parent.path}
										className={linkClass}
									/>
								}
							>
								{detail.parent.label}
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{currentLabel}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				) : (
					<>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>
								{
									NAV_ITEMS.find(
										(item) => item.path === pathname
									)?.label
								}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default AnalyticsBreadcrumb;
