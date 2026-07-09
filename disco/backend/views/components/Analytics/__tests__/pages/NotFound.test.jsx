import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import NotFound from '../../pages/NotFound';
import { renderWithProviders } from '../setup/helpers';

describe('NotFound', () => {
	it('renders the not found heading', () => {
		renderWithProviders(<NotFound />);

		expect(screen.getByText('Page not found')).toBeInTheDocument();
	});

	it('renders the description message', () => {
		renderWithProviders(<NotFound />);

		expect(
			screen.getByText(
				"The page you're looking for doesn't exist or has been moved."
			)
		).toBeInTheDocument();
	});

	it('renders a link back to the dashboard', () => {
		renderWithProviders(<NotFound />);

		const link = screen.getByText('Back to Dashboard');
		expect(link).toBeInTheDocument();
		expect(link.closest('a')).toHaveAttribute('href', '/');
	});
});
