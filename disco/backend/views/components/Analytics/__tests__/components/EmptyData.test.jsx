import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import EmptyData from '../../components/ui-blocks/EmptyData';

describe('EmptyData', () => {
	it('renders the not-found title', () => {
		render(<EmptyData title="Campaigns" />);

		expect(screen.getByText('Campaigns Not Found!')).toBeInTheDocument();
	});

	it('renders custom title and description', () => {
		render(
			<EmptyData
				title="No Products"
				description="There are no products to display."
			/>
		);

		expect(
			screen.getByText('No Products Not Found!')
		).toBeInTheDocument();
		expect(
			screen.getByText('There are no products to display.')
		).toBeInTheDocument();
	});
});
