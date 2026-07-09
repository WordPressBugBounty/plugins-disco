import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import CustomerNotFound from '../../components/customers/CustomerNotFound';
import { renderWithProviders } from '../setup/helpers';

describe('CustomerNotFound', () => {
	it('renders the not found heading', () => {
		renderWithProviders(<CustomerNotFound />);

		expect(screen.getByText('Customer not found')).toBeInTheDocument();
	});

	it('renders the description message', () => {
		renderWithProviders(<CustomerNotFound />);

		expect(
			screen.getByText(
				"This customer doesn't exist or has no campaign order history."
			)
		).toBeInTheDocument();
	});

	it('renders a link back to customers list', () => {
		renderWithProviders(<CustomerNotFound />);

		const link = screen.getByText('Back to Customers');
		expect(link).toBeInTheDocument();
		expect(link.closest('a')).toHaveAttribute('href', '/customers');
	});
});
