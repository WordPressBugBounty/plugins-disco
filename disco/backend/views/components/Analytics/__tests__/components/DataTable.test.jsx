import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import DataTable from '../../components/ui-blocks/DataTable';

const COLUMNS = [
	{ key: 'name', label: 'Name' },
	{ key: 'revenue', label: 'Revenue', sortable: true },
	{ key: 'orders', label: 'Orders', sortable: true },
];

const mockData = [
	{ id: 1, name: 'Item A', revenue: '$100', orders: 10 },
	{ id: 2, name: 'Item B', revenue: '$200', orders: 20 },
	{ id: 3, name: 'Item C', revenue: '$300', orders: 30 },
];

const renderRow = (item) => (
	<tr key={item.id}>
		<td>{item.name}</td>
		<td>{item.revenue}</td>
		<td>{item.orders}</td>
	</tr>
);

const defaultProps = {
	columns: COLUMNS,
	data: mockData,
	renderRow,
	title: 'Test Table',
	total: 3,
	search: '',
	onSearchChange: jest.fn(),
	sortKey: 'revenue',
	sortDir: 'desc',
	onSort: jest.fn(),
	page: 1,
	totalPages: 1,
	onPageChange: jest.fn(),
	isLoading: false,
};

describe('DataTable', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders table with title and total count', () => {
		render(<DataTable {...defaultProps} />);

		expect(screen.getByText('Test Table')).toBeInTheDocument();
		expect(screen.getByText('(3)')).toBeInTheDocument();
	});

	it('renders all data rows', () => {
		render(<DataTable {...defaultProps} />);

		expect(screen.getByText('Item A')).toBeInTheDocument();
		expect(screen.getByText('Item B')).toBeInTheDocument();
		expect(screen.getByText('Item C')).toBeInTheDocument();
	});

	it('renders column headers', () => {
		render(<DataTable {...defaultProps} />);

		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText(/Revenue/)).toBeInTheDocument();
		expect(screen.getByText(/Orders/)).toBeInTheDocument();
	});

	it('renders search input with placeholder', () => {
		render(
			<DataTable {...defaultProps} searchPlaceholder="Search items..." />
		);

		expect(
			screen.getByPlaceholderText('Search items...')
		).toBeInTheDocument();
	});

	it('calls onSearchChange when typing in search', async () => {
		const user = userEvent.setup();
		render(<DataTable {...defaultProps} />);

		const searchInput = screen.getByPlaceholderText('Search...');
		await user.type(searchInput, 'test');

		expect(defaultProps.onSearchChange).toHaveBeenCalled();
	});

	it('calls onSort when clicking sortable column header', () => {
		render(<DataTable {...defaultProps} />);

		// Click on Revenue header (sortable)
		fireEvent.click(screen.getByText(/Revenue/));
		expect(defaultProps.onSort).toHaveBeenCalledWith('revenue');
	});

	it('does not call onSort when clicking non-sortable column', () => {
		render(<DataTable {...defaultProps} />);

		fireEvent.click(screen.getByText('Name'));
		expect(defaultProps.onSort).not.toHaveBeenCalled();
	});

	it('shows sort direction indicator on active sort column', () => {
		render(
			<DataTable {...defaultProps} sortKey="revenue" sortDir="desc" />
		);

		// The active sort column should show ↓
		expect(screen.getByText('↓')).toBeInTheDocument();
	});

	it('shows ↑ for ascending sort', () => {
		render(<DataTable {...defaultProps} sortKey="revenue" sortDir="asc" />);

		expect(screen.getByText('↑')).toBeInTheDocument();
	});

	it('shows loading skeletons when isLoading is true', () => {
		const { container } = render(
			<DataTable {...defaultProps} isLoading={true} />
		);

		// Should not render data rows
		expect(screen.queryByText('Item A')).not.toBeInTheDocument();

		// Should render skeleton rows
		const pulseElements = container.querySelectorAll(
			'.disco-animate-pulse'
		);
		expect(pulseElements.length).toBe(5); // 5 skeleton rows
	});

	it('renders EmptyData when data is empty and not loading', () => {
		render(
			<MemoryRouter>
				<DataTable {...defaultProps} data={[]} />
			</MemoryRouter>
		);

		expect(screen.getByText('Table Not Found!')).toBeInTheDocument();
	});

	it('renders pagination footer', () => {
		render(<DataTable {...defaultProps} page={1} totalPages={3} />);

		expect(screen.getByText('Showing 1 of 3')).toBeInTheDocument();
	});
});
