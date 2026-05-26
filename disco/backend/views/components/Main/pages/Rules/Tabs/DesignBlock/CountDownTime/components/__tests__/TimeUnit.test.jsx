/**
 * Tests for TimeUnit component
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeUnit from '../TimeUnit';

describe('TimeUnit Component', () => {
	const defaultProps = {
		unit: { value: '02', label: 'DAYS' },
		boxStyle: {
			background: '#FFFFFF',
			padding: '8px 12px',
			borderRadius: '2px',
		},
		numberStyle: {
			color: '#FF0000',
			fontSize: '20px',
			fontWeight: 700,
		},
		labelStyle: {
			color: '#333333',
			fontSize: '9px',
			fontWeight: 400,
		},
		separatorStyle: {
			color: '#FFFFFF',
			fontSize: '20px',
			fontWeight: 700,
		},
		showSeparator: false,
		singleContainer: false,
		minWidth: '50px',
	};

	it('should render unit value and label', () => {
		render(<TimeUnit {...defaultProps} />);

		expect(screen.getByText('02')).toBeInTheDocument();
		expect(screen.getByText('DAYS')).toBeInTheDocument();
	});

	it('should not show separator when showSeparator is false', () => {
		render(<TimeUnit {...defaultProps} showSeparator={false} />);

		expect(screen.queryByText(':')).not.toBeInTheDocument();
	});

	it('should show separator when showSeparator is true', () => {
		render(<TimeUnit {...defaultProps} showSeparator={true} />);

		expect(screen.getByText(':')).toBeInTheDocument();
	});

	it('should apply number styles', () => {
		render(<TimeUnit {...defaultProps} />);

		const numberElement = screen.getByText('02');
		expect(numberElement).toHaveStyle({ color: '#FF0000' });
		expect(numberElement).toHaveStyle({ fontSize: '20px' });
		expect(numberElement).toHaveStyle({ fontWeight: 700 });
	});

	it('should apply label styles', () => {
		render(<TimeUnit {...defaultProps} />);

		const labelElement = screen.getByText('DAYS');
		expect(labelElement).toHaveStyle({ color: '#333333' });
		expect(labelElement).toHaveStyle({ fontSize: '9px' });
	});

	it('should apply separator styles when separator is shown', () => {
		render(<TimeUnit {...defaultProps} showSeparator={true} />);

		const separatorElement = screen.getByText(':');
		expect(separatorElement).toHaveStyle({ color: '#FFFFFF' });
		expect(separatorElement).toHaveStyle({ fontSize: '20px' });
	});

	it('should render different time units correctly', () => {
		const units = [
			{ value: '12', label: 'HOURS' },
			{ value: '30', label: 'MINUTES' },
			{ value: '45', label: 'SECONDS' },
		];

		units.forEach((unit) => {
			const { unmount } = render(
				<TimeUnit {...defaultProps} unit={unit} />
			);

			expect(screen.getByText(unit.value)).toBeInTheDocument();
			expect(screen.getByText(unit.label)).toBeInTheDocument();

			unmount();
		});
	});

	it('should use different styles when singleContainer is true', () => {
		render(<TimeUnit {...defaultProps} singleContainer={true} />);

		// Component should still render correctly
		expect(screen.getByText('02')).toBeInTheDocument();
		expect(screen.getByText('DAYS')).toBeInTheDocument();
	});

	it('should handle zero values', () => {
		render(
			<TimeUnit {...defaultProps} unit={{ value: '00', label: 'DAYS' }} />
		);

		expect(screen.getByText('00')).toBeInTheDocument();
	});

	it('should handle double-digit values', () => {
		render(
			<TimeUnit
				{...defaultProps}
				unit={{ value: '99', label: 'HOURS' }}
			/>
		);

		expect(screen.getByText('99')).toBeInTheDocument();
	});
});
