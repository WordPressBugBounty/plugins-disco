const FontStyleButtons = ({
	isBold = false,
	isItalic = false,
	isUnderline = false,
	onBoldToggle,
	onItalicToggle,
	onUnderlineToggle,
	disabled = false,
}) => {
	return (
		<div
			className={`disco-flex disco-bg-gray-50 disco-rounded disco-items-center disco-gap-1 disco-p-1 ${disabled ? 'disco-opacity-50' : ''}`}
		>
			<button
				type="button"
				onClick={onBoldToggle}
				disabled={disabled}
				className={`disco-px-2 disco-py-1 disco-rounded disco-font-bold disco-text-sm ${
					isBold
						? 'disco-bg-primary disco-text-white'
						: 'disco-bg-white disco-text-gray-700 hover:disco-bg-gray-100'
				} ${disabled ? 'disco-cursor-not-allowed' : ''}`}
			>
				B
			</button>
			<button
				type="button"
				onClick={onItalicToggle}
				disabled={disabled}
				className={`disco-px-2 disco-py-1 disco-rounded disco-italic disco-text-sm ${
					isItalic
						? 'disco-bg-primary disco-text-white'
						: 'disco-bg-white disco-text-gray-700 hover:disco-bg-gray-100'
				} ${disabled ? 'disco-cursor-not-allowed' : ''}`}
			>
				I
			</button>
			<button
				type="button"
				onClick={onUnderlineToggle}
				disabled={disabled}
				className={`disco-px-2 disco-py-1 disco-rounded disco-underline disco-text-sm ${
					isUnderline
						? 'disco-bg-primary disco-text-white'
						: 'disco-bg-white disco-text-gray-700 hover:disco-bg-gray-100'
				} ${disabled ? 'disco-cursor-not-allowed' : ''}`}
			>
				U
			</button>
		</div>
	);
};

export default FontStyleButtons;
