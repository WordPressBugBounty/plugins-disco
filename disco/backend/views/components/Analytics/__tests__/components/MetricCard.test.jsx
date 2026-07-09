import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Wallet } from 'lucide-react';
import MetricCard from '../../components/campaigns/MetricCard';

describe('MetricCard', () => {
	const defaultProps = {
		icon: Wallet,
		iconBg: '#dcfce7',
		label: 'Revenue',
		value: '$12,500.00',
	};

	it('renders label and value', () => {
		render(<MetricCard {...defaultProps} />);

		expect(screen.getByText('Revenue')).toBeInTheDocument();
		expect(screen.getByText('$12,500.00')).toBeInTheDocument();
	});

	it('renders the icon with correct background', () => {
		const { container } = render(<MetricCard {...defaultProps} />);
		const iconWrapper = container.querySelector(
			'[style*="background-color"]'
		);
		expect(iconWrapper).toBeInTheDocument();
	});

	it('renders numeric value correctly', () => {
		render(<MetricCard {...defaultProps} value={45} />);
		expect(screen.getByText('45')).toBeInTheDocument();
	});

	it('renders zero value', () => {
		render(<MetricCard {...defaultProps} value={0} />);
		expect(screen.getByText('0')).toBeInTheDocument();
	});
});
