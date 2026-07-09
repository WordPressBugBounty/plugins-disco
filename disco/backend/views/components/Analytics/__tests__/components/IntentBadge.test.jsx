import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import IntentBadge from '../../components/campaigns/IntentBadge';

describe('IntentBadge', () => {
	it.each(['Product', 'Shipping', 'Bulk', 'BOGO', 'Bundle', 'Cart'])(
		'renders %s intent with correct styles',
		(intent) => {
			render(<IntentBadge intent={intent} />);
			const badge = screen.getByText(intent);
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveStyle({ backgroundColor: expect.any(String) });
		}
	);

	it('renders unknown intent with fallback styles', () => {
		render(<IntentBadge intent="Unknown" />);
		const badge = screen.getByText('Unknown');
		expect(badge).toHaveStyle({
			backgroundColor: '#f3f4f6',
			color: '#6b7280',
		});
	});
});
