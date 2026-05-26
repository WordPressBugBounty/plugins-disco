import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { store } from './app/store';
import ScrollToTop from './components/ScrollTop';
import Campaigns from './pages/Campaigns/Campaigns';
import Rules from './pages/Rules/Rules';
import Settings from './pages/Settings/Settings';
export default function CreateDiscount() {
	return (
		<>
			<Provider store={store}>
				<HashRouter basename="/">
					<ScrollToTop />
					<Routes>
						<Route path="/" element={<Campaigns />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/disco" element={<Rules />} />
					</Routes>
				</HashRouter>
				<ToastContainer style={{ zIndex: 99999 }} autoClose={1500} />
				<div
					className="hover:disco-bg-primary-dark disco-transition-colors disco-text-[11px] hidden disco-w-96 hover:disco-bg-primary/90 disco-text-gray-500
					disco-bg-red-100
					disco-border-gray-200"
				></div>
			</Provider>
		</>
	);
}
