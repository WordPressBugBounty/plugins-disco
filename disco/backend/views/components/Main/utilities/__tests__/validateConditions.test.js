import { toast } from 'react-toastify';
import { validateConditions } from '../utilities';

jest.mock('react-toastify', () => ({
	toast: {
		error: jest.fn(),
	},
}));

describe('validateConditions', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return true when conditions is null', () => {
		expect(validateConditions(null)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should return true when conditions is undefined', () => {
		expect(validateConditions(undefined)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should return true when conditions is empty array', () => {
		expect(validateConditions([])).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should return true when all conditions have valid string values', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'customer_email',
						condition: 'equals',
						compare: 'test@example.com',
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should return true when condition has valid array value', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'cart_total',
						condition: 'between',
						compare: ['100', '500'],
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should return false and show toast when compare_with is empty', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: '',
						condition: '',
						compare: '',
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
		expect(toast.error).toHaveBeenCalledWith(
			'Please select a condition type or remove the empty condition.'
		);
	});

	it('should return false and show toast when compare value is empty string', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'customer_email',
						condition: 'equals',
						compare: '',
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
		expect(toast.error).toHaveBeenCalledWith(
			'Please fill in the condition value or remove the empty condition.'
		);
	});

	it('should return false and show toast when compare value is undefined', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'customer_email',
						condition: 'equals',
						compare: undefined,
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
		expect(toast.error).toHaveBeenCalledWith(
			'Please fill in the condition value or remove the empty condition.'
		);
	});

	it('should return false and show toast when compare value is null', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'customer_email',
						condition: 'equals',
						compare: null,
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
		expect(toast.error).toHaveBeenCalledWith(
			'Please fill in the condition value or remove the empty condition.'
		);
	});

	it('should return false and show toast when compare is an empty array', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'product_category',
						condition: 'in_list',
						compare: [],
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
		expect(toast.error).toHaveBeenCalledWith(
			'Please fill in the condition value or remove the empty condition.'
		);
	});

	it('should return false and show toast when compare is array of empty strings', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'cart_total',
						condition: 'between',
						compare: ['', ''],
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
		expect(toast.error).toHaveBeenCalledWith(
			'Please fill in the condition value or remove the empty condition.'
		);
	});

	it('should return false and show toast when compare is array of null values', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'cart_total',
						condition: 'between',
						compare: [null, null],
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
	});

	it('should return true when compare array has at least one valid value', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'cart_total',
						condition: 'between',
						compare: ['100', ''],
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should validate multiple groups and fail on first invalid', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'customer_email',
						condition: 'equals',
						compare: 'test@example.com',
						operator: 'and',
					},
				],
			},
			{
				id: '2',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f2',
						compare_with: 'cart_total',
						condition: 'equals',
						compare: '',
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
	});

	it('should validate multiple filters within a group', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'customer_email',
						condition: 'equals',
						compare: 'test@example.com',
						operator: 'and',
					},
					{
						id: 'f2',
						compare_with: 'cart_total',
						condition: 'equals',
						compare: '',
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(false);
		expect(toast.error).toHaveBeenCalledTimes(1);
	});

	it('should return true when group has no base_filters', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
			},
		];

		expect(validateConditions(conditions)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should return true when multiple groups all have valid values', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'customer_email',
						condition: 'equals',
						compare: 'test@example.com',
						operator: 'and',
					},
				],
			},
			{
				id: '2',
				base_operator: 'or',
				base_filters: [
					{
						id: 'f2',
						compare_with: 'cart_total',
						condition: 'greater_than',
						compare: '50',
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});

	it('should return true when compare is array with valid selections', () => {
		const conditions = [
			{
				id: '1',
				base_operator: 'and',
				base_filters: [
					{
						id: 'f1',
						compare_with: 'product_category',
						condition: 'in_list',
						compare: ['cat1', 'cat2'],
						operator: 'and',
					},
				],
			},
		];

		expect(validateConditions(conditions)).toBe(true);
		expect(toast.error).not.toHaveBeenCalled();
	});
});
