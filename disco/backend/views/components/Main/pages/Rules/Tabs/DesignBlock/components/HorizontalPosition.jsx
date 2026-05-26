const HorizontalPosition = ({ title, selected, handleChange, options }) => {
	return (
		<div className="disco-flex disco-flex-col">
			<div className="disco-text-sm disco-font-semibold disco-mb-2">{title}</div>
			<div className="disco-flex disco-gap-3">
				{options.map((position) => (
					<button
						key={position}
						onClick={() => handleChange(position)}
						className={`disco-w-8 disco-h-8 disco-flex disco-p-0.5 disco-rounded-lg ${
							selected === position ? 'disco-border disco-border-primary disco-bg-green-100' : 'disco-border disco-border-gray-200'
						} ${
							position === 'middle' ? 'disco-justify-center' : position === 'right' ? 'disco-justify-end' : 'disco-items-start'
						}`}
					>
						<span
							className={`disco-w-1.5 disco-h-1.5 disco-rounded-full ${
								selected === position ? 'disco-bg-green-500' : 'disco-bg-gray-400'
							}`}
						></span>
					</button>
				))}
			</div>
		</div>
	);
}

export default HorizontalPosition;
