import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router';
import ScrollToTop from '../Main/components/ScrollTop';
import { store } from './app/store';
import AnalyticsLayout from './components/layout/AnalyticsLayout';
import CampaignDetails from './pages/CampaignDetails';
import CampaignReports from './pages/CampaignsReports';
import CustomerDetails from './pages/CustomerDetails';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Orders from './pages/Orders';
import Products from './pages/Products';

export default function App() {
	return (
		<Provider store={store}>
			<HashRouter basename="/">
				<ScrollToTop />
				<Routes>
					<Route path="/" element={<AnalyticsLayout />}>
						<Route index element={<Dashboard />} />
						<Route
							path="/campaigns-reports"
							element={<CampaignReports />}
						/>
						<Route
							path="/campaigns-reports/:campaignId"
							element={<CampaignDetails />}
						/>
						<Route path="/products" element={<Products />} />
						<Route
							path="/products/:productId"
							element={<Products />}
						/>
						<Route path="/orders" element={<Orders />} />
						<Route path="/customers" element={<Customers />} />
						<Route
							path="/customers/:customerId"
							element={<CustomerDetails />}
						/>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</HashRouter>
		</Provider>
	);
}
