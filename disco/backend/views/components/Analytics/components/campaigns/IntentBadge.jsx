const INTENT_STYLES = {
	Product: { bg: '#f0fdf4', text: '#15803d' },
	Shipping: { bg: '#eff6ff', text: '#1d4ed8' },
	Bulk: { bg: '#f5f3ff', text: '#6d28d9' },
	BOGO: { bg: '#fff7ed', text: '#c2410c' },
	Bundle: { bg: '#fdf4ff', text: '#86198f' },
	Cart: { bg: '#fff1f2', text: '#be123c' },
};

const IntentBadge = ({ intent }) => {
	const style = INTENT_STYLES[intent] ?? { bg: '#f3f4f6', text: '#6b7280' };
	return (
		<span
			className="disco-inline-flex disco-items-center disco-px-2 disco-py-0.5 disco-rounded disco-text-[10px] disco-font-semibold disco-tracking-wide disco-uppercase"
			style={{ backgroundColor: style.bg, color: style.text }}
		>
			{intent}
		</span>
	);
};

export default IntentBadge;
