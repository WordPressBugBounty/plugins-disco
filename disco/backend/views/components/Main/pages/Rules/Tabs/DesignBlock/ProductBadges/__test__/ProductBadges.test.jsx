import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBadge } from '../../../../../../features/discount/discountSlice';
import ProductBadgeEdit from '../ProductBadgeEdit';

// ─── Mocks ──────────────────────────────────────────────────────

jest.mock('react-redux', () => ({
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
	useStore: jest.fn(() => ({
		getState: jest.fn(),
		dispatch: jest.fn(),
		subscribe: jest.fn(),
	})),
}));

jest.mock('../../../../../../features/discount/discountSlice', () => ({
	updateBadge: jest.fn((payload) => ({
		type: 'discount/updateBadge',
		payload,
	})),
}));

jest.mock('../../components/BadgeHeader', () => {
	return function MockBadgeHeader({ title, description }) {
		return (
			<div
				data-testid="badge-header"
				data-title={title}
				data-description={description}
			>
				{title}
			</div>
		);
	};
});

jest.mock('../components/BadgeItems', () => {
	return function MockBadgeItems({ selectedBadge, setSelectedBadge }) {
		return (
			<div data-testid="badge-items" data-selected={selectedBadge}>
				<button
					data-testid="badge-items-select-editable"
					onClick={() => setSelectedBadge('editable')}
				>
					Editable
				</button>
				<button
					data-testid="badge-items-select-value-editable"
					onClick={() => setSelectedBadge('value_editable')}
				>
					Value Editable
				</button>
			</div>
		);
	};
});

jest.mock('../../components/BadgeFontProperties', () => {
	const { forwardRef } = require('react');
	return forwardRef(function MockBadgeFontProperties(
		{ label, onChange, value, data },
		ref
	) {
		return (
			<div data-testid="badge-font-properties" data-label={label}>
				<textarea
					data-testid="badge-font-textarea"
					onChange={onChange}
					value={value}
					ref={ref}
				/>
				{data?.map((d, i) => (
					<span key={i} data-testid={`font-prop-data-${i}`}>
						{d.label}: {d.value}
					</span>
				))}
			</div>
		);
	});
});

jest.mock('../../components/BadgeTextWithDynamicProperties', () => {
	const { forwardRef } = require('react');
	return forwardRef(function MockBadgeTextWithDynamicProperties(
		{ onChange, value },
		ref
	) {
		return (
			<div data-testid="badge-text-dynamic">
				<textarea
					data-testid="badge-text-dynamic-textarea"
					onChange={onChange}
					value={value}
					ref={ref}
				/>
			</div>
		);
	});
});

jest.mock('../components/ProductBadgeStyleBox', () => {
	return function MockProductBadgeStyleBox() {
		return <div data-testid="product-badge-style-box">StyleBox</div>;
	};
});

jest.mock('../../components/AxisBox', () => {
	return function MockAxisBox() {
		return <div data-testid="axis-box">AxisBox</div>;
	};
});

jest.mock('../../components/ColorPikerBox', () => {
	return function MockColorPikerBox({
		fontColor,
		backgroundColor,
		borderColor,
		handleFontColor,
		handleBackgroundColor,
		handleBorderColor,
		bgColorDisabled,
		borderColorDisabled,
	}) {
		return (
			<div
				data-testid="color-picker-box"
				data-font-color={fontColor || ''}
				data-bg-color={backgroundColor}
				data-border-color={borderColor || ''}
				data-bg-disabled={String(bgColorDisabled)}
				data-border-disabled={String(borderColorDisabled)}
			>
				<button
					data-testid="color-picker-font"
					onClick={() => handleFontColor('#ff0000')}
				>
					Font Color
				</button>
				<button
					data-testid="color-picker-bg"
					onClick={() => handleBackgroundColor('#00ff00')}
				>
					BG Color
				</button>
				<button
					data-testid="color-picker-border"
					onClick={() => handleBorderColor('#0000ff')}
				>
					Border Color
				</button>
			</div>
		);
	};
});

jest.mock('../components/ProductBadgeCardView', () => {
	return function MockProductBadgeCardView({ setSelectedBadge }) {
		return (
			<div data-testid="product-badge-card-view">
				<button
					data-testid="card-view-change-badge"
					onClick={() => setSelectedBadge('custom')}
				>
					Change Badge
				</button>
			</div>
		);
	};
});

// ─── Helpers ────────────────────────────────────────────────────

const DEFAULT_BADGE = {
	enable: true,
	badge_type: 'editable',
	title: {
		text: 'Sale!',
		color: '#111111',
	},
	container: {
		background: '#ffffff',
		'border-color': '#cccccc',
	},
};

const buildState = (badgeOverrides = {}) => ({
	discount: {
		design_blocks: {
			badge: { ...DEFAULT_BADGE, ...badgeOverrides },
		},
	},
});

/**
 * useSelector is called twice in the component:
 *   1st call → inside useState initialiser (badge_type)
 *   2nd call → badge object
 *
 * We wire both to the same state tree.
 */
const setupSelector = (badgeOverrides = {}) => {
	const state = buildState(badgeOverrides);
	useSelector.mockImplementation((fn) => fn(state));
};

describe('ProductBadgeEdit', () => {
	let mockDispatch;

	beforeEach(() => {
		jest.clearAllMocks();
		mockDispatch = jest.fn();
		useDispatch.mockReturnValue(mockDispatch);
		setupSelector();
	});

	// ─── Rendering ──────────────────────────────────────────────

	describe('rendering', () => {
		it('renders the root wrapper with expected classes', () => {
			const { container } = render(<ProductBadgeEdit />);
			const root = container.firstChild;
			expect(root).toHaveClass('disco-bg-gray-50');
			expect(root).toHaveClass('disco-mr-4');
			expect(root).toHaveClass('disco-rounded-lg');
			expect(root).toHaveClass('disco-pb-4');
		});

		it('renders BadgeHeader with correct title and description', () => {
			render(<ProductBadgeEdit />);
			const header = screen.getByTestId('badge-header');
			expect(header).toHaveAttribute('data-title', 'Product Badge');
			expect(header).toHaveAttribute(
				'data-description',
				'Customize your promotional message on product.'
			);
		});

		it('renders BadgeItems with the initial selectedBadge from state', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('badge-items')).toHaveAttribute(
				'data-selected',
				'editable'
			);
		});

		it('renders BadgeFontProperties with correct label', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('badge-font-properties')).toHaveAttribute(
				'data-label',
				'Enter your text here'
			);
		});

		it('renders BadgeFontProperties textarea with badge title text', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('badge-font-textarea')).toHaveValue(
				'Sale!'
			);
		});

		it('renders BadgeTextWithDynamicProperties textarea with badge title text', () => {
			render(<ProductBadgeEdit />);
			expect(
				screen.getByTestId('badge-text-dynamic-textarea')
			).toHaveValue('Sale!');
		});

		it('renders ProductBadgeStyleBox', () => {
			render(<ProductBadgeEdit />);
			expect(
				screen.getByTestId('product-badge-style-box')
			).toBeInTheDocument();
		});

		it('renders AxisBox', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('axis-box')).toBeInTheDocument();
		});

		it('renders ColorPikerBox', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('color-picker-box')).toBeInTheDocument();
		});

		it('renders ProductBadgeCardView', () => {
			render(<ProductBadgeEdit />);
			expect(
				screen.getByTestId('product-badge-card-view')
			).toBeInTheDocument();
		});

		it('passes dynamic data array to BadgeFontProperties', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('font-prop-data-0')).toHaveTextContent(
				'Discount Type: Percentage'
			);
			expect(screen.getByTestId('font-prop-data-1')).toHaveTextContent(
				'discounted_amount: $10'
			);
		});
	});

	// ─── Initial State Variants ─────────────────────────────────

	describe('initial state variants', () => {
		it('defaults selectedBadge to "editable" when badge_type is undefined', () => {
			setupSelector({ badge_type: undefined });
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('badge-items')).toHaveAttribute(
				'data-selected',
				'editable'
			);
		});

		it('sets selectedBadge from state when badge_type is "value_editable"', () => {
			setupSelector({ badge_type: 'value_editable' });
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('badge-items')).toHaveAttribute(
				'data-selected',
				'value_editable'
			);
		});

		it('renders empty text when badge.title.text is undefined', () => {
			setupSelector({ title: {} });
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('badge-font-textarea')).toHaveValue('');
		});

		it('renders default background "#fff" when container.background is missing', () => {
			setupSelector({ container: {} });
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('color-picker-box')).toHaveAttribute(
				'data-bg-color',
				'#fff'
			);
		});
	});

	// ─── ColorPikerBox Props ────────────────────────────────────

	describe('ColorPikerBox props', () => {
		it('passes fontColor from badge.title.color', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('color-picker-box')).toHaveAttribute(
				'data-font-color',
				'#111111'
			);
		});

		it('passes backgroundColor from badge.container.background', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('color-picker-box')).toHaveAttribute(
				'data-bg-color',
				'#ffffff'
			);
		});

		it('passes borderColor from badge.container["border-color"]', () => {
			render(<ProductBadgeEdit />);
			expect(screen.getByTestId('color-picker-box')).toHaveAttribute(
				'data-border-color',
				'#cccccc'
			);
		});

		it('disables bgColor and borderColor when selectedBadge is "value_editable"', () => {
			setupSelector({ badge_type: 'value_editable' });
			render(<ProductBadgeEdit />);
			const picker = screen.getByTestId('color-picker-box');
			expect(picker).toHaveAttribute('data-bg-disabled', 'true');
			expect(picker).toHaveAttribute('data-border-disabled', 'true');
		});

		it('enables bgColor and borderColor when selectedBadge is "editable"', () => {
			setupSelector({ badge_type: 'editable' });
			render(<ProductBadgeEdit />);
			const picker = screen.getByTestId('color-picker-box');
			expect(picker).toHaveAttribute('data-bg-disabled', 'false');
			expect(picker).toHaveAttribute('data-border-disabled', 'false');
		});
	});

	// ─── Title Text Change (handleBadgeTitle) ───────────────────

	describe('handleBadgeTitle – text change', () => {
		it('dispatches updateBadge when BadgeFontProperties textarea changes', () => {
			render(<ProductBadgeEdit />);
			const textarea = screen.getByTestId('badge-font-textarea');
			fireEvent.change(textarea, { target: { value: 'New Title' } });

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'title',
				value: { ...DEFAULT_BADGE.title, text: 'New Title' },
			});
			expect(mockDispatch).toHaveBeenCalledTimes(1);
		});

		it('dispatches updateBadge when BadgeTextWithDynamicProperties textarea changes', () => {
			render(<ProductBadgeEdit />);
			const textarea = screen.getByTestId('badge-text-dynamic-textarea');
			fireEvent.change(textarea, { target: { value: 'Dynamic Text' } });

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'title',
				value: { ...DEFAULT_BADGE.title, text: 'Dynamic Text' },
			});
			expect(mockDispatch).toHaveBeenCalledTimes(1);
		});

		it('preserves existing title properties when changing text', () => {
			setupSelector({
				title: { text: 'Old', color: '#abcdef', 'font-size': '16px' },
			});
			render(<ProductBadgeEdit />);
			fireEvent.change(screen.getByTestId('badge-font-textarea'), {
				target: { value: 'Updated' },
			});

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'title',
				value: {
					text: 'Updated',
					color: '#abcdef',
					'font-size': '16px',
				},
			});
		});
	});

	// ─── Color Changes (handleBadgeTitle & handleContainerChange) ─

	describe('color changes', () => {
		it('dispatches updateBadge for font color via handleBadgeTitle', () => {
			render(<ProductBadgeEdit />);
			fireEvent.click(screen.getByTestId('color-picker-font'));

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'title',
				value: { ...DEFAULT_BADGE.title, color: '#ff0000' },
			});
		});

		it('dispatches updateBadge for background via handleContainerChange', () => {
			render(<ProductBadgeEdit />);
			fireEvent.click(screen.getByTestId('color-picker-bg'));

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'container',
				value: { ...DEFAULT_BADGE.container, background: '#00ff00' },
			});
		});

		it('dispatches updateBadge for border-color via handleContainerChange', () => {
			render(<ProductBadgeEdit />);
			fireEvent.click(screen.getByTestId('color-picker-border'));

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'container',
				value: {
					...DEFAULT_BADGE.container,
					'border-color': '#0000ff',
				},
			});
		});

		it('preserves existing container properties when changing background', () => {
			setupSelector({
				container: {
					background: '#ffffff',
					'border-color': '#cccccc',
					opacity: '0.5',
				},
			});
			render(<ProductBadgeEdit />);
			fireEvent.click(screen.getByTestId('color-picker-bg'));

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'container',
				value: {
					background: '#00ff00',
					'border-color': '#cccccc',
					opacity: '0.5',
				},
			});
		});
	});

	// ─── Selected Badge Switching ───────────────────────────────

	describe('selectedBadge switching', () => {
		it('allows ProductBadgeCardView to change selectedBadge', () => {
			render(<ProductBadgeEdit />);
			fireEvent.click(screen.getByTestId('card-view-change-badge'));
			expect(screen.getByTestId('badge-items')).toHaveAttribute(
				'data-selected',
				'custom'
			);
		});
	});

	// ─── Edge Cases ─────────────────────────────────────────────

	describe('edge cases', () => {
		it('handles badge being undefined without crashing', () => {
			useSelector.mockImplementation((fn) =>
				fn({
					discount: {
						design_blocks: {
							badge: undefined,
						},
					},
				})
			);
			// The component uses badge?.title?.text with optional chaining so it
			// should not throw. The useState initialiser also uses || 'editable'.
			expect(() => render(<ProductBadgeEdit />)).not.toThrow();
		});

		it('handles rapid consecutive text changes', () => {
			render(<ProductBadgeEdit />);
			const textarea = screen.getByTestId('badge-font-textarea');

			fireEvent.change(textarea, { target: { value: 'A' } });
			fireEvent.change(textarea, { target: { value: 'AB' } });
			fireEvent.change(textarea, { target: { value: 'ABC' } });

			expect(mockDispatch).toHaveBeenCalledTimes(3);
			expect(updateBadge).toHaveBeenLastCalledWith({
				name: 'title',
				value: { ...DEFAULT_BADGE.title, text: 'ABC' },
			});
		});

		it('handles empty string for title text', () => {
			render(<ProductBadgeEdit />);
			fireEvent.change(screen.getByTestId('badge-font-textarea'), {
				target: { value: '' },
			});

			expect(updateBadge).toHaveBeenCalledWith({
				name: 'title',
				value: { ...DEFAULT_BADGE.title, text: '' },
			});
		});

		it('dispatches all three color changes independently', () => {
			render(<ProductBadgeEdit />);

			fireEvent.click(screen.getByTestId('color-picker-font'));
			fireEvent.click(screen.getByTestId('color-picker-bg'));
			fireEvent.click(screen.getByTestId('color-picker-border'));

			expect(mockDispatch).toHaveBeenCalledTimes(3);

			// Verify each was dispatched with the correct name
			const calls = updateBadge.mock.calls;
			expect(calls[0][0].name).toBe('title');
			expect(calls[1][0].name).toBe('container');
			expect(calls[2][0].name).toBe('container');
		});
	});
});
