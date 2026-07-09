import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import StatCard from '../../components/dashboard/StatCard';

describe('StatCard', () => {
	const defaultProps = {
		title: 'Net Sale',
		subtitle: '(Woo + Disco)',
		value: '$45,230.50',
		trend: '↑ +18.6% vs last period',
		icon: require('../../../../asset/img/icons/analytics/chart.svg')
			.default,
		variant: 'net',
		isLoading: false,
		isTrendUp: true,
	};

	it('renders title, subtitle, value, and trend', () => {
		render(<StatCard {...defaultProps} />);

		expect(screen.getByText('Net Sale')).toBeInTheDocument();
		expect(screen.getByText('(Woo + Disco)')).toBeInTheDocument();
		expect(screen.getByText('$45,230.50')).toBeInTheDocument();
		expect(screen.getByText('↑ +18.6% vs last period')).toBeInTheDocument();
	});

	it('renders the icon', () => {
		render(<StatCard {...defaultProps} />);
		expect(
			screen.getByRole('img', { alt: 'Net Sale' })
		).toBeInTheDocument();
	});

	it('does not render subtitle when not provided', () => {
		render(<StatCard {...defaultProps} subtitle={undefined} />);
		expect(screen.queryByText('(Woo + Disco)')).not.toBeInTheDocument();
	});

	it('does not render trend when not provided', () => {
		render(<StatCard {...defaultProps} trend={null} />);
		expect(screen.queryByText(/vs last period/)).not.toBeInTheDocument();
	});

	it('shows loading skeletons when isLoading is true', () => {
		const { container } = render(
			<StatCard {...defaultProps} isLoading={true} />
		);

		// Should show title but not value
		expect(screen.getByText('Net Sale')).toBeInTheDocument();
		expect(screen.queryByText('$45,230.50')).not.toBeInTheDocument();

		// Should have pulse animation elements
		const pulseElements = container.querySelectorAll(
			'.disco-animate-pulse'
		);
		expect(pulseElements.length).toBeGreaterThanOrEqual(2);
	});

	it('renders with different variants', () => {
		const { container } = render(
			<StatCard {...defaultProps} variant="campaigns" />
		);
		expect(container.firstChild).toHaveClass('disco-bg-[#f3efff]');
	});

	it('handles fallback value "--" correctly', () => {
		render(<StatCard {...defaultProps} value="--" />);
		expect(screen.getByText('--')).toBeInTheDocument();
	});
});
