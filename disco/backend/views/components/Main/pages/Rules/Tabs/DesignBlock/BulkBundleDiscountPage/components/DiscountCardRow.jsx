import { __ } from '@wordpress/i18n';

const DiscountCardRow = ({ row, type, buttonStyle }) => {
	const isBulk = type === 'bulk';

	return (
		<tr
			className="disco:flex disco:items-center disco:h-4 disco:border-t-[0.25px] disco:border-[#f1f3f8]"
			style={{ background: row.bg }}
		>
			<td className="disco:flex disco:items-center disco:justify-center disco:shrink-0 disco:h-full disco:border-r-[0.25px] disco:border-[#f1f3f8] disco:w-10">
				<span className="disco:text-[5.5px] disco:text-[#596066]">
					{row.title}
				</span>
			</td>
			<td className="disco:flex disco:items-center disco:justify-center disco:shrink-0 disco:h-full disco:border-r-[0.25px] disco:border-[#f1f3f8] disco:w-10">
				<span className="disco:text-[5.5px] disco:text-[#596066]">
					{row.discount}
				</span>
			</td>
			<td className="disco:flex disco:items-center disco:justify-center disco:shrink-0 disco:h-full disco:border-r-[0.25px] disco:border-[#f1f3f8] disco:w-10">
				<span className="disco:text-[5.5px] disco:text-[#596066]">
					{isBulk ? row.range : row.qty}
				</span>
			</td>
			<td className="disco:flex disco:items-center disco:justify-center disco:shrink-0 disco:h-full disco:w-12.5 disco:overflow-hidden disco:py-0.5!">
				<span
					className={`disco:text-white disco:rounded-xs disco:px-0.75 disco:max-h-3.25 disco:text-[5px] disco:leading-3.25 ${
						isBulk ? 'disco:bg-[#9461ff]' : 'disco:bg-[#ff595e]'
					}`}
					style={{
						background: buttonStyle?.background,
						color: buttonStyle?.text_color,
					}}
				>
					{__('Add To Cart', 'disco')}
				</span>
			</td>
		</tr>
	);
};

export default DiscountCardRow;
