import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import BadgeHeader from '../components/BadgeHeader';
import ButtonCustomization from './components/ButtonCustomization';
import CellCustomization from './components/CellCustomization';
import DiscountView from './components/DiscountView';
import HeadingCustomization from './components/HeadingCustomization';
import TableItems from './components/TableItems';
import TablePosition from './components/TablePosition';
import TableTabControl from './components/TableTabControl';

const BulkBundleDiscountEdit = () => {
	const { discount_intent } = useSelector((state) => state.discount);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	return (
		<div className="disco-bg-gray-50 disco-mr-4 disco-rounded-lg disco-pb-4">
			<div className="disco-px-5 disco-py-1">
				<BadgeHeader
					title={__(`${discount_intent} Table`, 'disco')}
					description={__(
						'Customize your design table on product page.',
						'disco'
					)}
				/>
				<div className="disco-max-h-[calc(100vh-225px)] disco-flex disco-gap-8 disco-pt-2 disco-mt-2 disco-justify-between">
					<div className="disco-w-1/2 disco-max-h-full disco-overflow-y-auto disco-no-scrollbar disco-overscroll-contain">
						<TableItems />
						<HeadingCustomization />
						<CellCustomization />
						<ButtonCustomization />
						<TablePosition />
						<TableTabControl />
					</div>
					<div className="disco-w-1/2">
						<DiscountView />
					</div>
				</div>
			</div>
		</div>
	);
};

export default BulkBundleDiscountEdit;
