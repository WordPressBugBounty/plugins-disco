const Card = ({ heading, children, headingButton }) => {
	return (
		<div className="disco-border disco-rounded-t-md disco-border-gray-200 disco-my-8 disco-bg-white disco-pt-2">
			<div
				className={`disco-px-4 disco-pb-2 ${
					children && 'disco-border-b disco-border-gray-200'
				} `}
			>
				<div className="disco-flex disco-justify-between disco-items-center">
					<div>
						<h2 className="disco-text-lg disco-font-medium">
							{heading}
						</h2>
					</div>
					{headingButton && headingButton}
				</div>
			</div>
			<div>{children}</div>
		</div>
	);
};
export default Card;
