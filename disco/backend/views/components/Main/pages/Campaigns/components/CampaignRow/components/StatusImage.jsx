import statusImg from "../../../../../utilities/statusImg";
export default function StatusImage( { status }) {
	return (
		<div className="disco:relative disco:inline-block disco:group">
			<img src={statusImg[status]} width="24" height="24" className="disco:block"/>

			{/* Status Tooltip */}
			<div
				className="disco:absolute disco:invisible disco:bg-primary disco:text-white disco:text-regular disco:px-1.5 disco:py-1 disco:rounded-lg disco:group-hover:visible disco:bottom-full disco:left-1/2 disco:transform disco:-translate-x-1/2 disco:mb-2 disco:after:content-[''] disco:after:absolute disco:after:border-8 disco:after:border-transparent disco:after:border-t-primary disco:after:bottom-[-15px] disco:after:left-1/2 disco:after:transform disco:after:-translate-x-1/2">
				{status}
			</div>
		</div>
	);
}
