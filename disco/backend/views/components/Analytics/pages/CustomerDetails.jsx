import CustomerHeader from '@/components/customers/CustomerHeader';
import CustomerMetrics from '@/components/customers/CustomerMetrics';
import CustomerNotFound from '@/components/customers/CustomerNotFound';
import CustomerOrdersTable from '@/components/customers/CustomerOrdersTable';
import { useGetCustomerQuery } from '@/features/customers/customersApi';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

const CustomerDetails = () => {
	const { customerId } = useParams();
	const dateParams = useSelector(selectDateRangeParams);
	const { data, isLoading } = useGetCustomerQuery({
		id: customerId,
		...dateParams,
	});

	const customer = data?.data ?? null;

	if (!isLoading && !customer) {
		return <CustomerNotFound />;
	}

	return (
		<div className="disco-min-h-screen disco-bg-[#f9fafb] disco-p-6 disco-space-y-3">
			{isLoading ? (
				<div className="disco-space-y-3">
					<div className="disco-h-16 disco-animate-pulse disco-rounded-xl disco-bg-white disco-border disco-border-[#e5e7eb]" />
					<div className="disco-flex disco-gap-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="disco-flex-1 disco-h-20 disco-animate-pulse disco-rounded-xl disco-bg-white disco-border disco-border-[#e5e7eb]"
							/>
						))}
					</div>
				</div>
			) : customer ? (
				<>
					<CustomerHeader customer={customer} />
					<CustomerMetrics
						totalSpent={customer.total_spent}
						orders={customer.orders}
						campaignsCount={(customer.campaigns ?? []).length}
					/>
				</>
			) : null}

			<CustomerOrdersTable customerId={customerId} />
		</div>
	);
};

export default CustomerDetails;
