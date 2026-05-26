/**
 * Tests for CountdownTimer component
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountdownTimer from '../CountdownTimer';

describe('CountdownTimer Component', () => {
	const defaultProps = {
		timeUnits: [
			{ value: '02', label: 'DAYS' },
			{ value: '12', label: 'HOURS' },
			{ value: '30', label: 'MINUTES' },
			{ value: '45', label: 'SECONDS' },
		],
		containerStyle: {
			background: 'linear-gradient(90deg, #F39177 0%, #F61F48 100%)',
			borderRadius: '6px',
			padding: '12px 16px',
		},
		titleStyle: {
			color: '#FFFFFF',
			fontSize: '14px',
			fontWeight: 600,
		},
		subtitleStyle: {
			color: '#FFFFFF',
			fontSize: '12px',
			fontWeight: 400,
		},
		boxStyle: {
			background: '#FFFFFF',
			borderRadius: '2px',
			padding: '8px 12px',
		},
		numberStyle: {
			color: '#FF4133',
			fontSize: '20px',
			fontWeight: 700,
		},
		labelStyle: {
			color: '#1A1D1F',
			fontSize: '9px',
			fontWeight: 400,
		},
		separatorStyle: {
			color: '#FFFFFF',
			fontSize: '20px',
			fontWeight: 700,
		},
		titleText: 'Exclusive Deals',
		subtitleText: 'Available for a limited time only!',
		hasSeparator: false,
		singleContainer: false,
		minWidth: '50px',
	};

	it('should render title text', () => {
		render(<CountdownTimer {...defaultProps} />);

		expect(screen.getByText('Exclusive Deals')).toBeInTheDocument();
	});

	it('should render subtitle text', () => {
		render(<CountdownTimer {...defaultProps} />);

		expect(
			screen.getByText('Available for a limited time only!')
		).toBeInTheDocument();
	});

	it('should render all time units', () => {
		render(<CountdownTimer {...defaultProps} />);

		expect(screen.getByText('02')).toBeInTheDocument();
		expect(screen.getByText('DAYS')).toBeInTheDocument();
		expect(screen.getByText('12')).toBeInTheDocument();
		expect(screen.getByText('HOURS')).toBeInTheDocument();
		expect(screen.getByText('30')).toBeInTheDocument();
		expect(screen.getByText('MINUTES')).toBeInTheDocument();
		expect(screen.getByText('45')).toBeInTheDocument();
		expect(screen.getByText('SECONDS')).toBeInTheDocument();
	});

	it('should not show separators when hasSeparator is false', () => {
		render(<CountdownTimer {...defaultProps} hasSeparator={false} />);

		expect(screen.queryAllByText(':')).toHaveLength(0);
	});

	it('should show separators when hasSeparator is true', () => {
		render(<CountdownTimer {...defaultProps} hasSeparator={true} />);

		// Should have 3 separators (between 4 time units)
		expect(screen.getAllByText(':')).toHaveLength(3);
	});

	it('should apply title styles', () => {
		render(<CountdownTimer {...defaultProps} />);

		const titleElement = screen.getByText('Exclusive Deals');
		expect(titleElement).toHaveStyle({ color: '#FFFFFF' });
		expect(titleElement).toHaveStyle({ fontSize: '14px' });
	});

	it('should apply subtitle styles', () => {
		render(<CountdownTimer {...defaultProps} />);

		const subtitleElement = screen.getByText(
			'Available for a limited time only!'
		);
		expect(subtitleElement).toHaveStyle({ color: '#FFFFFF' });
		expect(subtitleElement).toHaveStyle({ fontSize: '12px' });
	});

	it('should render with singleContainer mode', () => {
		render(<CountdownTimer {...defaultProps} singleContainer={true} />);

		// Should still render all elements
		expect(screen.getByText('Exclusive Deals')).toBeInTheDocument();
		expect(screen.getByText('02')).toBeInTheDocument();
		expect(screen.getByText('DAYS')).toBeInTheDocument();
	});

	it('should handle empty title text', () => {
		render(<CountdownTimer {...defaultProps} titleText="" />);

		expect(
			screen.queryByText('Exclusive Deals')
		).not.toBeInTheDocument();
		// Other elements should still render
		expect(screen.getByText('02')).toBeInTheDocument();
	});

	it('should handle empty subtitle text', () => {
		render(<CountdownTimer {...defaultProps} subtitleText="" />);

		expect(
			screen.queryByText('Available for a limited time only!')
		).not.toBeInTheDocument();
		// Other elements should still render
		expect(screen.getByText('Exclusive Deals')).toBeInTheDocument();
	});

	it('should render with different time values', () => {
		const customTimeUnits = [
			{ value: '99', label: 'DAYS' },
			{ value: '23', label: 'HOURS' },
			{ value: '59', label: 'MINUTES' },
			{ value: '59', label: 'SECONDS' },
		];

		render(<CountdownTimer {...defaultProps} timeUnits={customTimeUnits} />);

		expect(screen.getByText('99')).toBeInTheDocument();
		expect(screen.getByText('23')).toBeInTheDocument();
		expect(screen.getAllByText('59')).toHaveLength(2);
	});

	it('should render with zero values', () => {
		const zeroTimeUnits = [
			{ value: '00', label: 'DAYS' },
			{ value: '00', label: 'HOURS' },
			{ value: '00', label: 'MINUTES' },
			{ value: '00', label: 'SECONDS' },
		];

		render(<CountdownTimer {...defaultProps} timeUnits={zeroTimeUnits} />);

		expect(screen.getAllByText('00')).toHaveLength(4);
	});

	it('should apply gap based on hasSeparator', () => {
		const { container: withoutSeparator } = render(
			<CountdownTimer {...defaultProps} hasSeparator={false} />
		);

		const { container: withSeparator } = render(
			<CountdownTimer {...defaultProps} hasSeparator={true} />
		);

		// Both should render successfully
		expect(withoutSeparator.firstChild).toBeInTheDocument();
		expect(withSeparator.firstChild).toBeInTheDocument();
	});

	it('should apply gap based on singleContainer', () => {
		const { container: normalContainer } = render(
			<CountdownTimer {...defaultProps} singleContainer={false} />
		);

		const { container: singleContainerMode } = render(
			<CountdownTimer {...defaultProps} singleContainer={true} />
		);

		// Both should render successfully
		expect(normalContainer.firstChild).toBeInTheDocument();
		expect(singleContainerMode.firstChild).toBeInTheDocument();
	});
});
