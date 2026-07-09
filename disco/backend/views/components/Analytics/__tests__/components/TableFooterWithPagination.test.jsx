import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import TableFooterWithPagination from '../../components/ui-blocks/TableFooterWithPagination';

describe('TableFooterWithPagination', () => {
	const onPageChange = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('shows "Showing X of Y" text', () => {
		render(
			<TableFooterWithPagination
				page={2}
				totalPages={5}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByText('Showing 2 of 5')).toBeInTheDocument();
	});

	it('does not show page buttons when totalPages is 1', () => {
		render(
			<TableFooterWithPagination
				page={1}
				totalPages={1}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByText('Showing 1 of 1')).toBeInTheDocument();
		// No page number buttons
		expect(screen.queryByText('2')).not.toBeInTheDocument();
	});

	it('renders page number buttons for multiple pages', () => {
		render(
			<TableFooterWithPagination
				page={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('marks the current page as active', () => {
		render(
			<TableFooterWithPagination
				page={2}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page');
	});

	it('renders an ellipsis when there are many pages', () => {
		render(
			<TableFooterWithPagination
				page={1}
				totalPages={20}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByText('More pages')).toBeInTheDocument();
		expect(screen.getByText('20')).toBeInTheDocument();
	});

	it('calls onPageChange when clicking a page number', () => {
		render(
			<TableFooterWithPagination
				page={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		fireEvent.click(screen.getByText('2'));
		expect(onPageChange).toHaveBeenCalledWith(2);
	});

	it('navigates to the next page via the next button', () => {
		render(
			<TableFooterWithPagination
				page={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		const nextButton = screen.getByLabelText('Go to next page');
		expect(nextButton).toBeEnabled();
		fireEvent.click(nextButton);
		expect(onPageChange).toHaveBeenCalledWith(2);
	});

	it('navigates to the previous page via the previous button', () => {
		render(
			<TableFooterWithPagination
				page={2}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		const prevButton = screen.getByLabelText('Go to previous page');
		expect(prevButton).toBeEnabled();
		fireEvent.click(prevButton);
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it('disables the previous button on the first page', () => {
		render(
			<TableFooterWithPagination
				page={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
	});

	it('disables the next button on the last page', () => {
		render(
			<TableFooterWithPagination
				page={3}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByLabelText('Go to next page')).toBeDisabled();
	});
});
