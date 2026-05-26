export default function DocCount({ label, count }) {
	return (
		<div className="disco-text-sm disco-border disco-border-primary disco-rounded-full disco-py-2 disco-px-4 disco-flex disco-justify-center disco-items-center disco-gap-1 disco-bg-[#AFEFCA]">
			<h3 className="disco-font-bold disco-text-[#16A34A]">{count}</h3>
			<p className="disco-font-medium disco-text-[#35483D]">{label}</p>
		</div>
	);
}
