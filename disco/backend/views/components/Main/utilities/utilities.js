import { __ } from '@wordpress/i18n';
import moment from 'moment';
import { toast } from 'react-toastify';

export const getSelectedFilterData = (items, current) => {
	let value = {};
	items.forEach((group) => {
		if (group.options[current]) {
			value = group.options[current];
		}
	});

	return value;
};

export const dateTimeFormatter = (datetime) => {
	if (datetime) {
		return moment(datetime).format('Do MMM, YYYY h:mm A');
	} else {
		return '-';
	}
};

export const dateStringToTimestamp = (dateString) => {
	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		return false;
	}

	return date.getTime();
};

export const prepareCampaignForRequest = (campaign, prefix = '') => {
	const dataForRequest = { ...campaign };

	if (dataForRequest.id) {
		delete dataForRequest.id;
	}
	if (dataForRequest.created_by) {
		delete dataForRequest.created_by;
	}
	if (dataForRequest.created_date) {
		delete dataForRequest.created_date;
	}
	if (dataForRequest.modified_by) {
		delete dataForRequest.modified_by;
	}
	if (dataForRequest.modified_date) {
		delete dataForRequest.modified_date;
	}
	if (dataForRequest._links) {
		delete dataForRequest._links;
	}
	if (dataForRequest.name) {
		dataForRequest.name = dataForRequest.name + ' - ' + prefix;
	}
	if (dataForRequest.priority) {
		dataForRequest.priority = '1';
	}

	return dataForRequest;
};

export const buildQueryUrl = (base, query) => {
	const separator = DISCO.is_pretty_url ? '?' : '&';
	return `${base}${separator}${query}`;
};

export const scrollToEmptyField = (fieldName, errorMessage) => {
	const fields = document.getElementsByName(fieldName);
	// Check if multiple fields are present
	if (fields.length > 1) {
		// Loop through all the fields and scroll to the first empty one
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];
			if (field && field.value.trim().length === 0) {
				// Scroll and focus on the first empty field
				field.scrollIntoView({ behavior: 'smooth', block: 'center' });
				field.focus();
				toast.error(errorMessage);
				return true; // Error found
			}
		}
	} else if (fields.length === 1) {
		// Handle single field case
		const field = fields[0];
		if (field && field.value.trim().length === 0) {
			field.scrollIntoView({ behavior: 'smooth', block: 'center' });
			field.focus();
			toast.error(errorMessage);
			return true; // Error found
		}
	}

	return false; // No error found
};

export const cleanFilters = (data) => {
	return data
		.map((group) => {
			const cleanedBaseFilters = (group.base_filters || []).filter(
				(filter) => {
					return (
						filter.compare !== undefined && filter.compare !== ''
					);
				}
			);

			if (cleanedBaseFilters.length === 0) {
				return null; // Mark this group for removal
			}

			return {
				...group,
				base_filters: cleanedBaseFilters,
			};
		})
		.filter((group) => group !== null); // Remove groups that are null
};

// utils/validateRule.js

export function validateRule(rule, prevRule = {}, index = 0) {
	const errors = {};

	const min = Number(rule.min);
	const max = rule.max !== '' ? Number(rule.max) : null;
	const prevMin = Number(prevRule.min);
	const prevMax = prevRule.max !== '' ? Number(prevRule.max) : null;

	// Min must be greater than 0
	if (!rule.min || min <= 0) {
		errors.min = 'Minimum must be greater than 0';
	}

	if (rule.recursive === 'no' && max !== null && min > max) {
		errors.max = 'Maximum must be greater than Minimum';
	}

	if (index > 0) {
		if (rule.recursive === 'no') {
			if (prevRule.recursive === 'no') {
				if (prevMax !== null ? min <= prevMax : min <= prevMin) {
					errors.min = 'Minimum must be greater than previous rule';
				}
			} else if (min <= prevMin) {
				errors.min = 'Minimum must be greater than previous rule';
			}
		} else if (rule.recursive === 'yes' && min <= prevMin) {
			errors.min = 'Minimum must be greater than previous rule';
		}
	}

	// Only show error toast for the first error (optional)
	if (Object.keys(errors).length > 0) {
		toast.error(Object.values(errors)[0]);
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
		message: Object.values(errors)[0] || '',
	};
}

// NEW: validate all rules at once
export function validateAllRules(rules) {
	for (let i = 0; i < rules.length; i++) {
		const current = rules[i];
		const previous = rules[i - 1] || {};
		const result = validateRule(current, previous, i);

		if (!result.isValid) {
			return {
				isValid: false,
				index: i,
				field: Object.keys(result.errors)[0],
				message: result.message,
			};
		}
	}

	return { isValid: true };
}

//Validate conditions, check the values is empty or not.
export function validateConditions(conditions) {
	if (!conditions || conditions.length === 0) {
		return true;
	}

	for (const group of conditions) {
		const filters = group.base_filters || [];
		for (const filter of filters) {
			if (!filter.compare_with) {
				toast.error(
					__(
						'Please select a condition type or remove the empty condition.',
						'disco'
					)
				);
				return false;
			}

			const value = filter.compare;

			if (value === undefined || value === null || value === '') {
				toast.error(
					__(
						'Please fill in the condition value or remove the empty condition.',
						'disco'
					)
				);
				return false;
			}

			if (Array.isArray(value)) {
				const isEmpty =
					value.length === 0 ||
					value.every(
						(v) => v === '' || v === undefined || v === null
					);
				if (isEmpty) {
					toast.error(
						__(
							'Please fill in the condition value or remove the empty condition.',
							'disco'
						)
					);
					return false;
				}
			}
		}
	}

	return true;
}

export function validateEmptyField(discount) {
	const { products, discount_intent, discount_rules } = discount;
	if (products.length === 0) {
		if (
			scrollToEmptyField(
				'search_products',
				__('Please select few products!', 'disco')
			)
		)
			return false;
	}

	//Field validation for name
	if (
		scrollToEmptyField(
			'campaign_name',
			__('Campaign Name is Required', 'disco')
		)
	)
		return false;

	//Field validation for Minimum quantity
	if (
		discount_intent === 'Bulk' ||
		discount_intent === 'Bundle' ||
		discount_intent === 'BOGO'
	) {
		if (
			scrollToEmptyField(
				'min',
				__('Minimum Quantity is Required', 'disco')
			)
		)
			return false;
	}

	if (
		discount_intent === 'BOGO' &&
		scrollToEmptyField(
			'get_quantity',
			__('Get quantity is Required', 'disco')
		)
	)
		return false;

	if (
		discount_intent === 'BOGO' ||
		discount_intent === 'Bulk' ||
		(discount_intent === 'Bundle' && discount_rules.length > 0)
	) {
		const result = validateAllRules(discount_rules);

		if (!result.isValid) {
			return false;
		}
	}

	//Field validation for discount_value
	if (
		discount_intent !== 'Shipping' &&
		scrollToEmptyField(
			'discount_value',
			__('Discount Value is Required', 'disco')
		)
	)
		return false;

	// Conditions validation
	if (!validateConditions(discount.conditions)) {
		return false;
	}

	return true;
}

export function discountRulesToTableData(discount_rules) {
	const data = discount_rules.map((rule) => {
		const range = rule.max ? `${rule.min}-${rule.max}` : rule.min;
		return {
			title: rule.discount_label,
			discount: rule.discount_value,
			range,
			buy_now: 'Add To Cart',
		};
	});
	return data;
}

/**
 * To truncate text and add an ellipsis
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 30) {
	if (str.length > maxLength) {
		return str.slice(0, maxLength) + '...';
	}
	return str;
}
