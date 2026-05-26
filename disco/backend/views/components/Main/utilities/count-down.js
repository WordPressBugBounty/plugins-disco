import countDown1 from '../../../asset/img/badge-images/countdown/countDown1.svg';
import countDown2 from '../../../asset/img/badge-images/countdown/countDown2.svg';
import countDown3 from '../../../asset/img/badge-images/countdown/countDown3.svg';
import countDown4 from '../../../asset/img/badge-images/countdown/countDown4.svg';

const CountDownImg = {
	countDown1,
	countDown2,
	countDown3,
	countDown4,
};

/**
 * Pre-made countdown timer designs
 * Each design contains CSS properties for easy PHP HTML generation
 * Structure: container, title, subtitle, box_container, box, number, label, separator
 */

// Default selected design ID
export const DEFAULT_COUNTDOWN_DESIGN = 'design4';

export const countdownDesigns = {
	// ------------------- DESIGN 4 - Multi Gradient (Default) -------------------
	design4: {
		id: 'design4',
		name: 'Multi Gradient',
		isDefault: true,
		hasSeparator: false,
		singleContainer: false,
		// Main container styles
		container: {
			background:
				'linear-gradient(90deg, #F39177 0%, #F61F48 35.5%, #A758EE 69%, #86C5FE 100%)',
			'border-radius': '6px',
			padding: '12px 16px',
			'max-width': '370px',
			border: 0,
			'border-color': 'FFFFFF',
		},
		// Title styles
		title: {
			text: 'Exclusive Deals',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '14px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '0',
		},
		// Subtitle styles
		subtitle: {
			text: 'Available for a limited time only!',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '12px',
			'font-weight': 400,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '4px 0 0 0',
		},
		// Box container (wrapper for all time boxes)
		box_container: {
			display: 'flex',
			'flex-wrap': 'wrap',
			'justify-content': 'center',
			'align-items': 'center',
			gap: '6px',
			'margin-top': '8px',
		},
		// Individual time box styles
		box: {
			background: '#FFFFFF',
			'border-radius': '2px',
			padding: '8px 12px',
			'min-width': '60px',
			display: 'flex',
			'flex-direction': 'column',
			'align-items': 'center',
			'justify-content': 'center',
			flex: '1 1 auto',
		},
		// Number styles (countdown digits)
		number: {
			color: '#FF4133',
			'font-family': 'inherit',
			'font-size': '20px',
			'font-weight': 700,
			'line-height': '1.2',
		},
		// Label styles (DAYS, HOURS, etc.)
		label: {
			color: '#1A1D1F',
			'font-family': 'inherit',
			'font-size': '9px',
			'font-weight': 400,
			'margin-top': '2px',
			'text-transform': 'uppercase',
		},
		// Separator styles (colon between boxes)
		separator: {
			color: '#FFFFFF',
			'font-size': '20px',
			'font-weight': 700,
			padding: '0 2px',
			display: 'flex',
			'align-items': 'center',
		},

		// preview image
		image: {
			url: CountDownImg.countDown4,
		},
	},

	// ------------------- DESIGN 1 - Dark Blue -------------------
	design1: {
		id: 'design1',
		name: 'Dark Blue',
		isDefault: false,
		hasSeparator: false,
		singleContainer: true,
		// Main container styles
		container: {
			background: '#FF5501',
			'border-radius': '6px',
			padding: '12px 16px',
			'max-width': '370px',
			border: 0,
			'border-color': 'FF5501',
		},
		// Title styles
		title: {
			text: 'Exclusive Deals',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '14px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '0',
		},
		// Subtitle styles
		subtitle: {
			text: 'Limited time only!',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '12px',
			'font-weight': 400,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '4px 0 0 0',
		},
		// Box container (single white container for all counters)
		box_container: {
			display: 'flex',
			'flex-wrap': 'wrap',
			'justify-content': 'center',
			'align-items': 'center',
			gap: '4px',
			'margin-top': '8px',
			background: '#FFFFFF',
			'border-radius': '4px',
			padding: '8px',
		},
		// Individual time box styles (no background since container has it)
		box: {
			background: '#FFFFFF',
			'border-radius': '0',
			padding: '4px 8px',
			'min-width': '60px',
			display: 'flex',
			'flex-direction': 'column',
			'align-items': 'center',
			'justify-content': 'center',
			flex: '1 1 auto',
		},
		// Number styles
		number: {
			color: '#1A1D1F',
			'font-family': 'inherit',
			'font-size': '20px',
			'font-weight': 700,
			'line-height': '1.2',
		},
		// Label styles
		label: {
			color: '#1A1D1F',
			'font-family': 'inherit',
			'font-size': '9px',
			'font-weight': 400,
			'margin-top': '2px',
			'text-transform': 'uppercase',
		},
		// Separator styles
		separator: {
			color: '#FFFFFF',
			'font-size': '20px',
			'font-weight': 700,
			padding: '0 2px',
			display: 'flex',
			'align-items': 'center',
		},

		// preview image
		image: {
			url: CountDownImg.countDown3,
		},
	},

	// ------------------- DESIGN 2 - Purple Gradient with Border -------------------
	design2: {
		id: 'design2',
		name: 'Dark',
		isDefault: false,
		hasSeparator: false,
		singleContainer: false,
		// Main container styles
		container: {
			background: '#0F2846',
			'border-radius': '6px',
			padding: '12px 16px',
			'max-width': '370px',
			border: 1,
			'border-color': '#0F2846',
		},
		// Title styles
		title: {
			text: 'Premium Collection',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '14px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '0',
		},
		// Subtitle styles
		subtitle: {
			text: 'For a limited time only!',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '12px',
			'font-weight': 400,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '4px 0 0 0',
		},
		// Box container
		box_container: {
			display: 'flex',
			'flex-wrap': 'wrap',
			'justify-content': 'center',
			'align-items': 'center',
			gap: '6px',
			'margin-top': '8px',
		},
		// Individual time box styles
		box: {
			background: '#0091FF',
			'border-radius': '2px',
			padding: '8px 12px',
			'min-width': '60px',
			display: 'flex',
			'flex-direction': 'column',
			'align-items': 'center',
			'justify-content': 'center',
			flex: '1 1 auto',
		},
		// Number styles
		number: {
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '20px',
			'font-weight': 700,
			'line-height': '1.2',
		},
		// Label styles
		label: {
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '9px',
			'font-weight': 400,
			'margin-top': '2px',
			'text-transform': 'uppercase',
		},
		// Separator styles
		separator: {
			color: '#FFFFFF',
			'font-size': '20px',
			'font-weight': 700,
			padding: '0 2px',
			display: 'flex',
			'align-items': 'center',
		},

		// preview image
		image: {
			url: CountDownImg.countDown1,
		},
	},

	// ------------------- DESIGN 3 - Orange with Colon Separators -------------------
	design3: {
		id: 'design3',
		name: 'Orange',
		isDefault: false,
		hasSeparator: true,
		singleContainer: false,
		// Main container styles
		container: {
			background: '#BD51FE',
			'border-radius': '6px',
			padding: '12px 16px',
			'max-width': '370px',
			border: 0,
			'border-color': 'BD51FE',
		},
		// Title styles
		title: {
			text: 'Elite Selection',
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '14px',
			'font-weight': 600,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '0',
		},
		// Subtitle styles
		subtitle: {
			text: "Catch it before it's gone!",
			color: '#FFFFFF',
			'font-family': 'inherit',
			'font-size': '12px',
			'font-weight': 400,
			'font-style': 'normal',
			'text-align': 'center',
			margin: '4px 0 0 0',
		},
		// Box container
		box_container: {
			display: 'flex',
			'flex-wrap': 'wrap',
			'justify-content': 'center',
			'align-items': 'center',
			gap: '0',
			'margin-top': '8px',
		},
		// Individual time box styles
		box: {
			background: '#FFFFFF',
			'border-radius': '2px',
			padding: '8px 12px',
			'min-width': '60px',
			display: 'flex',
			'flex-direction': 'column',
			'align-items': 'center',
			'justify-content': 'center',
			flex: '1 1 auto',
		},
		// Number styles
		number: {
			color: '#BD51FE',
			'font-family': 'inherit',
			'font-size': '20px',
			'font-weight': 700,
			'line-height': '1.2',
		},
		// Label styles
		label: {
			color: '#BD51FE',
			'font-family': 'inherit',
			'font-size': '9px',
			'font-weight': 400,
			'margin-top': '2px',
			'text-transform': 'uppercase',
		},
		// Separator styles (visible colons)
		separator: {
			color: '#FFFFFF',
			'font-size': '20px',
			'font-weight': 700,
			padding: '0 4px',
			display: 'flex',
			'align-items': 'center',
		},

		// preview image
		image: {
			url: CountDownImg.countDown2,
		},
	},
};

export default CountDownImg;
