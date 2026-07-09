import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../../components/campaigns/StatusBadge';

describe('StatusBadge', () => {
	it('renders "active" status', () => {
		render(<StatusBadge status="active" />);
		expect(screen.getByText('active')).toBeInTheDocument();
	});

	it('renders "expired" status', () => {
		render(<StatusBadge status="expired" />);
		expect(screen.getByText('expired')).toBeInTheDocument();
	});

	it('renders "deleted" status', () => {
		render(<StatusBadge status="deleted" />);
		expect(screen.getByText('deleted')).toBeInTheDocument();
	});

	it('renders unknown status with fallback style', () => {
		const { container } = render(<StatusBadge status="paused" />);
		expect(screen.getByText('paused')).toBeInTheDocument();
		// Dot should exist with fallback color
		const dot = container.querySelector('[style*="background-color"]');
		expect(dot).toBeInTheDocument();
	});
});
