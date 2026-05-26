/**
 * Tests for CountdownRenderer component
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountdownRenderer from '../CountdownRenderer';

describe('CountdownRenderer Component', () => {
	const mockDesign = {
		id: 'design4',
		name: 'Multi Gradient',
		isDefault: true,
		hasSeparator: false,
		singleContainer: false,
		container: {
			background: 'linear-gradient(90deg, #F39177 0%, #F61F48 100%)',
			'border-radius': '6px',
			padding: '12px 16px',
			'max-width': '370px',
			border: 0,
			'border-color': 'rgba(0, 0, 0, 0)',
		},
		title: {
			text: 'Exclusive Deals',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '14px',
			'font-weight': 600,
		},
		subtitle: {
			text: 'Available for a limited time only!',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '12px',
			'font-weight': 400,
		},
		box_container: {
			display: 'flex',
			'flex-wrap': 'wrap',
			'justify-content': 'center',
			'align-items': 'center',
			gap: '6px',
			'margin-top': '8px',
		},
		box: {
			background: '#FFFFFF',
			'border-radius': '2px',
			padding: '8px 12px',
			'min-width': '60px',
		},
		number: {
			color: '#FF4133',
			'font-family': 'inherit',
			'font-size': '20px',
			'font-weight': 700,
		},
		label: {
			color: '#1A1D1F',
			'font-family': 'inherit',
			'font-size': '9px',
			'font-weight': 400,
		},
		separator: {
			color: '#FFFFFF',
			'font-size': '20px',
			'font-weight': 700,
		},
	};

	it('should return null when design is null', () => {
		const { container } = render(<CountdownRenderer design={null} />);
		expect(container.firstChild).toBeNull();
	});

	it('should return null when design is undefined', () => {
		const { container } = render(<CountdownRenderer design={undefined} />);
		expect(container.firstChild).toBeNull();
	});

	it('should render title text from design', () => {
		render(<CountdownRenderer design={mockDesign} />);
		expect(screen.getByText('Exclusive Deals')).toBeInTheDocument();
	});

	it('should render subtitle text from design', () => {
		render(<CountdownRenderer design={mockDesign} />);
		expect(
			screen.getByText('Available for a limited time only!')
		).toBeInTheDocument();
	});

	it('should render default time values', () => {
		render(<CountdownRenderer design={mockDesign} />);

		expect(screen.getByText('02')).toBeInTheDocument();
		expect(screen.getByText('88')).toBeInTheDocument();
		expect(screen.getByText('55')).toBeInTheDocument();
		expect(screen.getByText('05')).toBeInTheDocument();
	});

	it('should render all time unit labels', () => {
		render(<CountdownRenderer design={mockDesign} />);

		expect(screen.getByText('DAYS')).toBeInTheDocument();
		expect(screen.getByText('HOURS')).toBeInTheDocument();
		expect(screen.getByText('MINUTES')).toBeInTheDocument();
		expect(screen.getByText('SECONDS')).toBeInTheDocument();
	});

	it('should render custom time values when provided', () => {
		render(
			<CountdownRenderer
				design={mockDesign}
				days="10"
				hours="20"
				minutes="30"
				seconds="40"
			/>
		);

		expect(screen.getByText('10')).toBeInTheDocument();
		expect(screen.getByText('20')).toBeInTheDocument();
		expect(screen.getByText('30')).toBeInTheDocument();
		expect(screen.getByText('40')).toBeInTheDocument();
	});

	it('should not render separators when hasSeparator is false', () => {
		render(<CountdownRenderer design={mockDesign} />);
		expect(screen.queryAllByText(':')).toHaveLength(0);
	});

	it('should render separators when hasSeparator is true', () => {
		const designWithSeparator = {
			...mockDesign,
			hasSeparator: true,
		};
		render(<CountdownRenderer design={designWithSeparator} />);
		expect(screen.getAllByText(':')).toHaveLength(3);
	});

	it('should apply title color from design', () => {
		render(<CountdownRenderer design={mockDesign} />);
		const titleElement = screen.getByText('Exclusive Deals');
		expect(titleElement).toHaveStyle({ color: '#FFFFFF' });
	});

	it('should apply number color from design', () => {
		render(<CountdownRenderer design={mockDesign} />);
		const numberElements = screen.getAllByText(/^\d{2}$/);
		numberElements.forEach((el) => {
			expect(el).toHaveStyle({ color: '#FF4133' });
		});
	});

	it('should apply label color from design', () => {
		render(<CountdownRenderer design={mockDesign} />);
		const daysLabel = screen.getByText('DAYS');
		expect(daysLabel).toHaveStyle({ color: '#1A1D1F' });
	});

	it('should render with singleContainer design', () => {
		const singleContainerDesign = {
			...mockDesign,
			singleContainer: true,
		};
		render(<CountdownRenderer design={singleContainerDesign} />);

		// Should still render all elements
		expect(screen.getByText('Exclusive Deals')).toBeInTheDocument();
		expect(screen.getByText('DAYS')).toBeInTheDocument();
	});

	it('should handle design with both hasSeparator and singleContainer', () => {
		const combinedDesign = {
			...mockDesign,
			hasSeparator: true,
			singleContainer: true,
		};
		render(<CountdownRenderer design={combinedDesign} />);

		expect(screen.getByText('Exclusive Deals')).toBeInTheDocument();
		expect(screen.getAllByText(':')).toHaveLength(3);
	});
});
