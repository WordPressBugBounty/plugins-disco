import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampaignsReports from '../../pages/CampaignsReports';
import { createMockCampaignsList, renderWithProviders } from '../setup/helpers';

jest.mock('../../features/campaigns/campaignsApi', () => ({
	useGetCampaignsQuery: jest.fn(),
}));

const {
	useGetCampaignsQuery,
} = require('../../features/campaigns/campaignsApi');

const mockData = createMockCampaignsList(3);

describe('CampaignsReports', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	function setupLoaded(overrides = {}) {
		useGetCampaignsQuery.mockReturnValue({
			data: mockData,
			isLoading: false,
			isFetching: false,
			...overrides,
		});
	}

	function setupLoading() {
		useGetCampaignsQuery.mockReturnValue({
			data: undefined,
			isLoading: true,
			isFetching: true,
		});
	}

	describe('Rendering', () => {
		it('renders page heading and subtitle', () => {
			setupLoaded();
			renderWithProviders(<CampaignsReports />);

			expect(screen.getByText('Campaigns')).toBeInTheDocument();
			expect(
				screen.getByText('All discount campaigns')
			).toBeInTheDocument();
		});

		it('renders campaign names in the table', () => {
			setupLoaded();
			renderWithProviders(<CampaignsReports />);

			expect(screen.getByText('Campaign 1')).toBeInTheDocument();
			expect(screen.getByText('Campaign 2')).toBeInTheDocument();
			expect(screen.getByText('Campaign 3')).toBeInTheDocument();
		});

		it('renders table column headers', () => {
			setupLoaded();
			renderWithProviders(<CampaignsReports />);

			expect(screen.getByText('Name')).toBeInTheDocument();
			expect(screen.getByText('Intent')).toBeInTheDocument();
			expect(screen.getByText('Date Range')).toBeInTheDocument();
			expect(screen.getByText(/Orders/)).toBeInTheDocument();
			expect(screen.getByText(/Customers/)).toBeInTheDocument();
			expect(screen.getByText(/Revenue/)).toBeInTheDocument();
			expect(screen.getByText('Status')).toBeInTheDocument();
		});

		it('renders campaign links to detail page', () => {
			setupLoaded();
			renderWithProviders(<CampaignsReports />);

			const link = screen.getByText('Campaign 1').closest('a');
			expect(link).toHaveAttribute('href', '/campaigns-reports/1');
		});
	});

	describe('Loading states', () => {
		it('shows loading skeletons', () => {
			setupLoading();
			const { container } = renderWithProviders(<CampaignsReports />);

			const pulseElements = container.querySelectorAll(
				'.disco-animate-pulse'
			);
			expect(pulseElements.length).toBeGreaterThan(0);
			expect(screen.queryByText('Campaign 1')).not.toBeInTheDocument();
		});
	});

	describe('Empty states', () => {
		it('shows empty state when no campaigns', () => {
			useGetCampaignsQuery.mockReturnValue({
				data: { data: [], collection: { count: 0 } },
				isLoading: false,
				isFetching: false,
			});
			renderWithProviders(<CampaignsReports />);

			expect(
				screen.getByText('Campaigns Not Found!')
			).toBeInTheDocument();
		});
	});

	describe('User interactions', () => {
		it('passes search value to hook', async () => {
			setupLoaded();
			const user = userEvent.setup();
			renderWithProviders(<CampaignsReports />);

			const searchInput = screen.getByPlaceholderText(
				'Search campaigns...'
			);
			await user.type(searchInput, 'summer');

			// The hook should be called with search parameter
			const lastCall = useGetCampaignsQuery.mock.calls.at(-1)[0];
			expect(lastCall.search).toBe('summer');
		});

		it('handles sort toggle by clicking column header', () => {
			setupLoaded();
			renderWithProviders(<CampaignsReports />);

			// Click Revenue header (already sorted desc, should toggle to asc)
			fireEvent.click(screen.getByText(/Revenue/));
			const lastCall = useGetCampaignsQuery.mock.calls.at(-1)[0];
			expect(lastCall.order).toBe('asc');
		});

		it('changes sort key when clicking different column', () => {
			setupLoaded();
			renderWithProviders(<CampaignsReports />);

			fireEvent.click(screen.getByText(/Orders/));
			const lastCall = useGetCampaignsQuery.mock.calls.at(-1)[0];
			expect(lastCall.sort_by).toBe('orders');
			expect(lastCall.order).toBe('desc');
		});
	});

	describe('RTK Query integration', () => {
		it('passes date range params to the query hook', () => {
			setupLoaded();
			renderWithProviders(<CampaignsReports />);

			const firstCall = useGetCampaignsQuery.mock.calls[0][0];
			expect(firstCall).toHaveProperty('date_from');
			expect(firstCall).toHaveProperty('date_to');
			expect(firstCall.limit).toBe(20);
		});
	});
});
