/**
 * Pre-made text highlight designs
 * Each design contains CSS properties for easy PHP HTML generation
 * Structure: container, title, subtitle, box_container, box, number, label, separator
 */

import comingSoon from '../../../asset/img/badge-images/badge/comingSoon.svg';
import textHighlight1 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight1.svg';
import textHighlight11 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight11.svg';
import textHighlight12 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight12.svg';
import textHighlight13 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight13.svg';
import textHighlight14 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight14.svg';
import textHighlight2 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight2.svg';
import textHighlight3 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight3.svg';
import textHighlight4 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight4.svg';
import textHighlight5 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight5.svg';
import textHighlight6 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight6.svg';
import textHighlight7 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight7.svg';
import textHighlight8 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight8.svg';
import textHighlight9 from '../../../asset/img/badge-images/badge/text-highlight/textHighlight9.svg';

export const TextHighlightImg = {
	editable: {
		design1: textHighlight7,
		design2: textHighlight13,
		design3: textHighlight12,
		design4: textHighlight11,
		design5: textHighlight14,
		design6: textHighlight9,
	},
	value_editable: {
		preview: {
			design1: textHighlight1,
			design2: textHighlight2,
			design3: textHighlight3,
			design4: textHighlight4,
			design5: textHighlight5,
			design6: textHighlight6,
			design7: textHighlight8,
		},
	},

	comingSoon,
};

const VALUE_EDITABLE_TEXT_HIGHLIGHT_IMG_DIR =
	DISCO.DISCO_BADGE_IMAGES_DIR +
	'/badge-images/badge/text-highlight/value-editable/';

// Default selected design ID
export const DEFAULT_TEXT_HIGHLIGHT_DESIGN = 'editable_design1';

const { editable, value_editable } = TextHighlightImg;

export const textHighlightDesign = {
	editable: [
		// DESIGN 1
		{
			id: 'editable_design1',
			name: 'Big savings',
			isDefault: true,
			hasSeparator: false,
			singleContainer: false,
			// Main container styles
			image: {
				url: editable.design1,
			},
			container: {
				width: '180px',
				height: '40px',
				display: 'flex',
				padding: '5px 20px',
				alignItems: 'center',
				justifyContent: 'center',
				'background-color': 'rgb(146, 81, 227)',
				'border-color': '#fff',
				'border-width': '0px',
				radius: {
					'top-left': 0,
					'top-right': 0,
					'bottom-right': 0,
					'bottom-left': 0,
				},
				'border-style': 'solid',
				clipPath:
					'polygon(100% 0%, 90% 50%, 100% 100%, 0% 100%, 10% 50%, 0% 0%)',
			},
			// Title styles
			title: {
				text: 'Big savings: [discounted_amount]',
				color: '#FFFFFF',
				'font-family': 'Manrope, sans-serif',
				'font-size': '14px',
				'font-weight': 600,
				'text-align': 'center',
			},
		},

		// DESIGN 2
		{
			id: 'editable_design2',
			name: 'Holiday Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			image: {
				url: editable.design2,
			},
			// Main container styles
			container: {
				width: '180px',
				height: '40px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px 15px',
				'background-color': 'rgba(240, 200, 8, 1)',
				'border-color': '#fff',
				'border-width': '0px',
				radius: {
					'top-left': '4px',
					'top-right': '4px',
					'bottom-right': '4px',
					'bottom-left': '4px',
				},
				'border-style': 'solid',
				'clip-path': 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
			},
			// Title styles
			title: {
				text: 'Holiday Offer',
				color: '#000000',
				'font-family': 'Manrope, sans-serif',
				'font-size': '14px',
				'font-weight': 700,
				'text-align': 'center',
			},
		},

		// DESIGN 3
		{
			id: 'editable_design3',
			name: 'Instant off',
			isDefault: false,
			hasSeparator: false,
			singleContainer: false,
			// Main container styles
			image: {
				url: editable.design3,
			},
			container: {
				width: '150px',
				height: '40px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px 15px',
				'background-color': '#000000',
				'border-color': '#fff',
				'border-width': '0px',
				radius: {
					'top-left': '50px',
					'top-right': '50px',
					'bottom-right': '50px',
					'bottom-left': '50px',
				},
				'border-style': 'solid',
			},
			// Title styles
			title: {
				text: 'Instant [discounted_amount] off',
				color: '#FFFFFF',
				'font-family': 'inherit',
				'font-size': '14px',
				'font-weight': 700,
				'text-align': 'center',
			},
		},

		// DESIGN 4
		{
			id: 'editable_design4',
			name: 'Limited Stock',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: editable.design4,
			},
			container: {
				width: '150px',
				height: '40px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px 15px',
				'background-color': 'rgba(255, 45, 83, 1)',
				'border-color': '#fff',
				'border-width': '0px',
				radius: {
					'top-left': '50px',
					'top-right': 0,
					'bottom-right': 0,
					'bottom-left': '50px',
				},
				'border-style': 'solid',
			},
			// Title styles
			title: {
				text: 'Limited Stock',
				color: '#FFFFFF',
				'font-family': 'inherit',
				'font-size': '14px',
				'font-weight': 600,
				'text-align': 'center',
			},
		},

		// Design 5
		{
			id: 'editable_design5',
			name: 'Limited Stock',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: editable.design5,
			},
			container: {
				width: '150px',
				height: '40px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px 15px',
				'background-color': '#812DFF',
				'border-color': '#fff',
				'border-width': '0px',
				radius: {
					'top-left': '0px',
					'top-right': '50px',
					'bottom-right': '50px',
					'bottom-left': '0px',
				},
				'border-style': 'solid',
			},
			// Title styles
			title: {
				text: 'Limited Stock',
				color: '#FFFFFF',
				'font-family': 'inherit',
				'font-size': '14px',
				'font-weight': 600,
				'text-align': 'center',
			},
		},

		// Design 6
		{
			id: 'editable_design6',
			name: 'Save Instantly',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: editable.design6,
			},
			container: {
				width: '200px',
				height: '40px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px 15px',
				'background-color': '',
				'border-color': '',
				'border-width': '0px',
				radius: {
					'top-left': '0px',
					'top-right': '0px',
					'bottom-right': '0px',
					'bottom-left': '0px',
				},
				'border-style': 'solid',
			},
			// Title styles
			title: {
				text: '💰 Save Instantly [discounted_percentage]',
				color: '#000',
				'font-family': '',
				'font-size': '14px',
				'font-weight': 400,
				'text-align': 'center',
			},
		},
	],

	// Only value Editable designs
	value_editable: [
		// DESIGN 1
		{
			id: 'value_editable_design1',
			name: 'Special Offer',
			isDefault: true,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: value_editable.preview.design1,
			},
			design: {
				url: VALUE_EDITABLE_TEXT_HIGHLIGHT_IMG_DIR + 'img1.svg',
			},
			container: {
				position: 'relative',
				width: '180px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '26px',
				top: '6px',
				'font-weight': 800,
				'font-size': '20px',
				'font-family': 'Impact, sans-serif',
			},
		},
		// DESIGN 2
		{
			id: 'value_editable_design2',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: value_editable.preview.design2,
			},
			design: {
				url: VALUE_EDITABLE_TEXT_HIGHLIGHT_IMG_DIR + 'img2.svg',
			},
			container: {
				position: 'relative',
				width: '180px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '10px',
				top: '8px',
				'font-weight': 600,
				'font-size': '14px',
				'font-family': 'Poppins, sans-serif',
				color: '#FFFFFF',
			},
		},

		// DESIGN 3
		{
			id: 'value_editable_design3',
			name: 'Biggest Sale',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: value_editable.preview.design3,
			},
			design: {
				url: VALUE_EDITABLE_TEXT_HIGHLIGHT_IMG_DIR + 'img3.svg',
			},
			container: {
				position: 'relative',
				width: '180px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '20px',
				top: '33px',
				'font-weight': 600,
				'font-size': '18px',
				'font-family': 'Poppins, sans-serif',
				color: '#000',
			},
		},

		// DESIGN 4
		{
			id: 'value_editable_design4',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: value_editable.preview.design4,
			},
			design: {
				url: VALUE_EDITABLE_TEXT_HIGHLIGHT_IMG_DIR + 'img4.svg',
			},
			container: {
				position: 'relative',
				width: '200px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '133px',
				top: '0',
				'font-weight': 500,
				'font-size': '16px',
				'font-family': 'Poppins, sans-serif',
				color: '#fff',
			},
		},

		// DESIGN 5
		{
			id: 'value_editable_design5',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: value_editable.preview.design5,
			},
			design: {
				url: VALUE_EDITABLE_TEXT_HIGHLIGHT_IMG_DIR + 'img5.svg',
			},
			container: {
				position: 'relative',
				width: '200px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '4px',
				top: '3px',
				'font-weight': 600,
				'font-size': '16px',
				'font-family': 'Impact, sans-serif',
				color: '#000',
			},
		},

		// DESIGN 6
		{
			id: 'value_editable_design6',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: value_editable.preview.design6, //Image use for items preview. It's not store in global state.
			},
			design: {
				url: VALUE_EDITABLE_TEXT_HIGHLIGHT_IMG_DIR + 'img6.svg', //This image url used for design real time preview. It's store in global state as well as database.
			},
			container: {
				position: 'relative',
				width: '180px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_amount]',
				position: 'absolute',
				left: '125px',
				top: '3px',
				'font-weight': 600,
				'font-size': '20px',
				'font-family': 'Impact, sans-serif',
				color: '#000',
			},
		},
	],
	image: {
		id: '',
		url: '',
		container: {
			'max-width': '150px',
			margin: '10px 0px',
		},
	},
};

export default textHighlightDesign;
