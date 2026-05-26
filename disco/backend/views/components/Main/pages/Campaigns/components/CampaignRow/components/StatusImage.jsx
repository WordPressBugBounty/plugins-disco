import statusImg from "../../../../../utilities/statusImg";
export default function StatusImage( { status }) {
	return (
		<div className="disco-relative disco-inline-block disco-group">
			<img src={statusImg[status]} width="24" height="24" className="disco-block"/>

			{/* Status Tooltip */}
			<div
				className="disco-absolute disco-invisible disco-bg-primary disco-text-white disco-text-regular disco-px-1.5 disco-py-1 disco-rounded-lg group-hover:disco-visible disco-bottom-full disco-left-1/2 disco-transform -disco-translate-x-1/2 disco-mb-2 after:disco-content-[''] after:disco-absolute after:disco-border-8 after:disco-border-transparent after:disco-border-t-primary after:disco-bottom-[-15px] after:disco-left-1/2 after:disco-transform after:disco--translate-x-1/2">
				{status}
			</div>
		</div>
	);
}
