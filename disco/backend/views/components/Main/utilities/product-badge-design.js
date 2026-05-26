/**
 * Pre-made text highlight designs
 * Each design contains CSS properties for easy PHP HTML generation
 * Structure: container, title, subtitle, box_container, box, number, label, separator
 */

import badge1 from '../../../asset/img/badge-images/badge/product-badge/editable/badge1.svg';
import badge11 from '../../../asset/img/badge-images/badge/product-badge/editable/badge11.svg';
import badge12 from '../../../asset/img/badge-images/badge/product-badge/editable/badge12.svg';
import badge13 from '../../../asset/img/badge-images/badge/product-badge/editable/badge13.svg';
import badge14 from '../../../asset/img/badge-images/badge/product-badge/editable/badge14.svg';
import badge15 from '../../../asset/img/badge-images/badge/product-badge/editable/badge15.svg';
import badge16 from '../../../asset/img/badge-images/badge/product-badge/editable/badge16.svg';
import badge19 from '../../../asset/img/badge-images/badge/product-badge/editable/badge19.svg';
import badge2 from '../../../asset/img/badge-images/badge/product-badge/editable/badge2.svg';
import badge20 from '../../../asset/img/badge-images/badge/product-badge/editable/badge20.svg';
import badge3 from '../../../asset/img/badge-images/badge/product-badge/editable/badge3.svg';
import badge4 from '../../../asset/img/badge-images/badge/product-badge/editable/badge4.svg';
import badge5 from '../../../asset/img/badge-images/badge/product-badge/editable/badge5.svg';
import badge6 from '../../../asset/img/badge-images/badge/product-badge/editable/badge6.svg';
import badge8 from '../../../asset/img/badge-images/badge/product-badge/editable/badge8.svg';
import badge9 from '../../../asset/img/badge-images/badge/product-badge/editable/badge9.svg';

import valueEditable1 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable1.svg';
import valueEditable10 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable10.svg';
import valueEditable11 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable11.svg';
import valueEditable12 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable12.png';
import valueEditable2 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable2.svg';
import valueEditable3 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable3.svg';
import valueEditable4 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable4.svg';
import valueEditable5 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable5.svg';
import valueEditable6 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable6.svg';
import valueEditable7 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable7.svg';
import valueEditable8 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable8.svg';
import valueEditable9 from '../../../asset/img/badge-images/badge/product-badge/value-editable/valueEditable9.svg';


// Default selected design ID
export const DEFAULT_PRODUCT_BADGE_DESIGN = 'editable_design1';

const VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR =
	DISCO.DISCO_BADGE_IMAGES_DIR + '/badge-images/badge/product-badge/designs/';

export const productBadgeDesign = {
	editable: [
		// DESIGN 1
		{
			id: 'editable_design1',
			name: '10% OFF',
			isDefault: true,
			hasSeparator: false,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge1,
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				height: '30px',
				padding: '5px 10px',
				background: 'rgb(7, 200, 131)',
				'clip-path':
					'polygon(0% 0%, 100% 0%, 85% 49%, 100% 100%, 0% 100%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: '#FFFFFF',
				'font-family': 'Manrope, sans-serif',
				'font-size': '14px',
				'font-weight': 700,
			},
		},

		// DESIGN 2
		{
			id: 'editable_design2',
			name: 'Savings',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			image: {
				url: badge2,
			},
			// Main container styles
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '140px',
				height: '30px',
				padding: '5px 20px',
				background: 'rgba(255, 45, 83, 1)',
				'clip-path':
					'polygon(0% 0%, 100% 0%, 85% 49%, 100% 100%, 0% 100%, 15% 50%)',
			},
			// Title styles
			title: {
				text: 'Savings [discounted_amount]',
				color: '#FFFFFF',
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
				url: badge3,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '50px',
				height: '50px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px 20px',
				background:
					'linear-gradient(180deg, #A777FF 0%, #8A4CFC 54%, #722BF7 100%)',
				'clip-path':
					'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: '#FFFFFF',
				'font-family': 'Georgia, sans-serif',
				'font-size': '14px',
				'line-height': '14px',
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
				url: badge4,
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '70px',
				height: '85px',
				display: 'flex',
				'justify-content': 'center',
				padding: '5px',
				background: 'rgba(255, 112, 11, 1)',
				mask: 'conic-gradient(from -37.5deg at bottom,#0000,#000 1deg 74deg,#0000 75deg) 50%/17.35px 100%',
			},
			// Title styles
			title: {
				text: 'Save Now [discounted_percentage]',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '18px',
				'line-height': '20px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 5 clip-path: polygon(0 0, 100% 0%, 100% 75%, 50% 100%, 0 75%);
		{
			id: 'editable_design5',
			name: 'Flash Sale',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge5,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '70px',
				height: '60px',
				display: 'flex',
				'justify-content': 'center',
				padding: '5px',
				radius: {
					'top-left': '10px',
					'top-right': '10px',
					'bottom-right': '10px',
					'bottom-left': '10px',
				},
				background: 'linear-gradient(180deg, #0061FF 0%, #60EFFF 100%)',
				'clip-path': 'polygon(0 0, 100% 0%, 100% 75%, 50% 100%, 0 75%)',
			},
			// Title styles
			title: {
				text: 'Flash Sale',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '18px',
				'line-height': '20px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 6
		{
			id: 'editable_design6',
			name: '15% OFF',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge6,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '60px',
				height: '60px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '60px',
					'top-right': '60px',
					'bottom-right': '0px',
					'bottom-left': '60px',
				},
				background: '#000',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: 'rgba(255, 208, 0, 1)',
				'font-family': '',
				'font-size': '18px',
				'line-height': '20px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 8
		{
			id: 'editable_design8',
			name: '25% OFF',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge8,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '60px',
				height: '60px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '10px',
					'top-right': '10px',
					'bottom-right': '10px',
					'bottom-left': '10px',
				},
				background:
					'linear-gradient(93.56deg, #0091FF 0%, #12A1FF 100%)',
				border: '2px solid',
				'border-image-source':
					'linear-gradient(259.16deg, #51B9FF 4.79%, #0860F8 108.32%)',
				'clip-path':
					'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '18px',
				'line-height': '20px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 9
		{
			id: 'editable_design9',
			name: '25% OFF',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge9,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '60px',
				height: '60px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '10px',
					'top-right': '10px',
					'bottom-right': '10px',
					'bottom-left': '10px',
				},
				background: 'rgba(255, 64, 38, 1)',
				border: '2px solid',
				'border-image-source':
					'linear-gradient(259.16deg, #51B9FF 4.79%, #0860F8 108.32%)',
				'clip-path':
					'polygon(50% 0%, 70% 25%, 100% 30%, 80% 55%, 85% 100%, 50% 85%, 15% 100%, 20% 55%, 0% 30%, 30% 25%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 11
		{
			id: 'editable_design11',
			name: 'Sale',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge11,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '60px',
				height: '60px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '10px',
					'top-right': '10px',
					'bottom-right': '10px',
					'bottom-left': '10px',
				},
				background: 'rgba(0, 204, 255, 1)',
				border: '2px solid',
				'border-image-source':
					'linear-gradient(259.16deg, #51B9FF 4.79%, #0860F8 108.32%)',
				'clip-path': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
			},
			// Title styles
			title: {
				text: 'SALE',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},
		// Design 12
		{
			id: 'editable_design12',
			name: 'Save 15%',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge12,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '70px',
				height: '70px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '0px',
					'top-right': '0px',
					'bottom-right': '0px',
					'bottom-left': '0px',
				},
				background: 'rgba(243, 104, 224, 1)',
				'clip-path':
					'polygon(100% 50%,91.77% 54.39%,98.91% 60.4%,89.94% 62.98%,95.68% 70.34%,86.37% 71%,90.45% 79.39%,81.21% 78.1%,83.46% 87.16%,74.69% 83.98%,75% 93.3%,67.08% 88.37%,65.45% 97.55%,58.73% 91.08%,55.23% 99.73%,50% 92%,44.77% 99.73%,41.27% 91.08%,34.55% 97.55%,32.92% 88.37%,25% 93.3%,25.31% 83.98%,16.54% 87.16%,18.79% 78.1%,9.55% 79.39%,13.63% 71%,4.32% 70.34%,10.06% 62.98%,1.09% 60.4%,8.23% 54.39%,0% 50%,8.23% 45.61%,1.09% 39.6%,10.06% 37.02%,4.32% 29.66%,13.63% 29%,9.55% 20.61%,18.79% 21.9%,16.54% 12.84%,25.31% 16.02%,25% 6.7%,32.92% 11.63%,34.55% 2.45%,41.27% 8.92%,44.77% 0.27%,50% 8%,55.23% 0.27%,58.73% 8.92%,65.45% 2.45%,67.08% 11.63%,75% 6.7%,74.69% 16.02%,83.46% 12.84%,81.21% 21.9%,90.45% 20.61%,86.37% 29%,95.68% 29.66%,89.94% 37.02%,98.91% 39.6%,91.77% 45.61%)',
			},
			// Title styles
			title: {
				text: 'SAVE [discounted_percentage]',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 13
		{
			id: 'editable_design13',
			name: 'BOGO Deal',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge13,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '150px',
				height: '40px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '30px',
					'top-right': '0px',
					'bottom-right': '0px',
					'bottom-left': '30px',
				},
				background: 'rgba(17, 61, 122, 1)',
				'clip-path':
					'polygon(100% 0%, 90% 50%, 100% 100%, 0% 100%, 0% 50%, 0% 0%)',
			},
			// Title styles
			title: {
				text: '★ BOGO DEAL',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 14
		{
			id: 'editable_design14',
			name: '20% OFF',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge14,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				height: '30px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '0px',
					'top-right': '0px',
					'bottom-right': '0px',
					'bottom-left': '0px',
				},
				background: 'rgba(255, 45, 83, 1)',
				'clip-path': 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 15
		{
			id: 'editable_design15',
			name: '20% Discount',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge15,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '170px',
				height: '30px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '0px',
					'top-right': '50px',
					'bottom-right': '50px',
					'bottom-left': '0px',
				},
				background: 'rgba(255, 128, 0, 1)',
				'clip-path':
					'polygon(10% 0%, 100% 1%, 100% 100%, 10% 100%, 0% 50%)',
			},
			// Title styles
			title: {
				text: '• [discounted_percentage] Discount',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 16
		{
			id: 'editable_design16',
			name: 'Sale',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge16,
			},

			container: {
				position: 'absolute',
				right: '0px',
				top: '0px',
				width: '70px',
				height: '70px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '0px',
					'top-right': '0px',
					'bottom-right': '0px',
					'bottom-left': '0px',
				},
				background: 'rgba(43, 79, 255, 1)',
				'clip-path': 'polygon(100% 0%, 0% 0%, 100% 100%)',
			},
			// Title styles
			title: {
				text: 'Sale',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				transform: 'rotate(45deg)',
				'margin-top': '-25px',
				'margin-right': '-25px',
			},
		},

		// Design 19
		{
			id: 'editable_design19',
			name: '20% OFF',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge19,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				height: '30px',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '5px',
				radius: {
					'top-left': '30px',
					'top-right': '30px',
					'bottom-right': '30px',
					'bottom-left': '30px',
				},
				background:
					'linear-gradient(90deg, #F39177 0%, #F61F48 35.5%, #A758EE 69%, #86C5FE 100%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] OFF',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
				'text-align': 'center',
				'text-transform': 'uppercase',
			},
		},

		// Design 20
		{
			id: 'editable_design20',
			name: '20% OFF',
			isDefault: false,
			hasSeparator: true,
			singleContainer: false,
			// Main container styles
			image: {
				url: badge20,
			},

			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: 'auto',
				height: 'auto',
				display: 'flex',
				'justify-content': 'center',
				'align-items': 'center',
				padding: '15px 20px',
				radius: {
					'top-left': '100%',
					'top-right': '100%',
					'bottom-right': '100%',
					'bottom-left': '100%',
				},
				background:
					'linear-gradient(180deg, #0094FF -2.47%, #1930FF 100%)',
			},
			// Title styles
			title: {
				text: '[discounted_percentage] Discount',
				color: '#FFFFFF',
				'font-family': '',
				'font-size': '14px',
				'line-height': '14px',
				'font-weight': '800',
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
				url: valueEditable1,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge1.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '16%',
				top: '64%',
				'font-weight': 600,
				'font-size': '16px',
				'font-family': '',
				transform: 'rotate(-7deg)',
				color: '#000',
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
				url: valueEditable2,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge2.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '65%',
				top: '5%',
				'font-weight': 600,
				'font-size': '13px',
				'font-family': '',
				transform: 'rotate(-10deg)',
				color: '#FFFFFF',
				'letter-spacing': '-1px',
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
				url: valueEditable3,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge3.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '21%',
				top: '82%',
				'font-weight': 600,
				'font-size': '13px',
				'font-family': '',
				color: '#fff',
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
				url: valueEditable4,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge4.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '21%',
				top: '56%',
				'font-weight': 600,
				'font-size': '12px',
				'font-family': '',
				color: 'rgba(55, 1, 97, 1)',
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
				url: valueEditable5,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge5.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '25%',
				top: '82%',
				'font-weight': 400,
				'font-size': '12px',
				'font-family': '',
				color: '#fff',
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
				url: valueEditable6,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge6.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '50%',
				top: '20%',
				'font-weight': 800,
				'font-size': '20px',
				'font-family': "'cosmicSansMs', Sans Sarif",
				color: 'rgba(247, 148, 29, 1)',
			},
		},
		// DESIGN 7
		{
			id: 'value_editable_design7',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: valueEditable7,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge7.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '46%',
				top: '63%',
				'font-weight': 500,
				'font-size': '7px',
				'font-family': '',
				'letter-spacing': '-1px',
				color: 'rgba(253, 39, 49, 1)',
			},
		},
		// DESIGN 8
		{
			id: 'value_editable_design8',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: valueEditable8,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge8.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '20%',
				top: '72%',
				'font-weight': 500,
				'font-size': '14px',
				'font-family': '',
				color: '#fff',
			},
		},
		// DESIGN 9
		{
			id: 'value_editable_design9',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: valueEditable9,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge9.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '26%',
				top: '75%',
				'font-weight': 500,
				'font-size': '12px',
				'font-family': 'cosmicSansMs, sans-serif',
				color: '#fff',
				transform: 'rotate(-7deg)',
			},
		},
		// DESIGN 10
		{
			id: 'value_editable_design10',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: valueEditable10,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge10.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '25%',
				top: '61%',
				'font-weight': 500,
				'font-size': '14px',
				'font-family': '',
				color: '#fff',
				'letter-spacing': '-1px',
			},
		},
		// DESIGN 11
		{
			id: 'value_editable_design11',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: valueEditable11,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge11.svg',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '27%',
				top: '69%',
				'font-weight': 500,
				'font-size': '10px',
				'font-family': '',
				color: '#fff',
			},
		},
		// DESIGN 12
		{
			id: 'value_editable_design12',
			name: 'Special Offer',
			isDefault: false,
			hasSeparator: false,
			singleContainer: true,
			// Main container styles
			image: {
				url: valueEditable12,
			},
			design: {
				url: VALUE_EDITABLE_PRODUCT_BADGE_IMG_DIR + 'badge12.png',
			},
			container: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				width: '100px',
				'min-height': '30px',
				margin: '10px 0px',
			},
			// Title styles
			title: {
				text: '[discounted_percentage]',
				position: 'absolute',
				left: '39%',
				top: '58%',
				'font-weight': 500,
				'font-size': '10px',
				'font-family': '',
				color: 'rgba(239, 38, 53, 1)',
				transform: 'rotate(-5deg)',
				'letter-spacing': '-1px',
			},
		},
	],
	image: {
		id: '',
		url: '',
		container: {
			position: 'absolute',
			left: '0px',
			top: '0px',
			'max-width': '100px',
			'max-height': '100px',
		},
	},
};

export default productBadgeDesign;
