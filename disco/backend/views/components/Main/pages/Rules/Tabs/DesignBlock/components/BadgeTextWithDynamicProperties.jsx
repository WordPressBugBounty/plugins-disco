import { InformationCircleIcon } from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDynamicVariables } from '../../../../../utilities/cart-banner-design';

const BadgeTextWithDynamicProperties = forwardRef(
	({ value, onChange }, ref) => {
		const [showPicker, setShowPicker] = useState(false);
		const emojiPickerRef = useRef(null);
		const { discount_intent, discount_rules, conditions } = useSelector(
			(state) => state.discount
		);

		const handleEmojiClick = (emojiObject) => {
			if (ref?.current) {
				const textarea = ref.current;
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;
				const newValue =
					value.substring(0, start) +
					emojiObject.emoji +
					value.substring(end);
				onChange({ target: { value: newValue } });

				setTimeout(() => {
					textarea.focus();
					const newPos = start + emojiObject.emoji.length;
					textarea.setSelectionRange(newPos, newPos);
				}, 0);
			} else {
				onChange({ target: { value: value + emojiObject.emoji } });
			}
		};

		const handleTogglePicker = () => {
			setShowPicker(!showPicker);
		};

		useEffect(() => {
			const handleClickOutside = (event) => {
				if (
					emojiPickerRef.current &&
					!emojiPickerRef.current.contains(event.target)
				) {
					setShowPicker(false);
				}
			};

			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, []);

		const dynamicVariables = useMemo(
			() =>
				getDynamicVariables(
					discount_intent,
					discount_rules,
					conditions
				),
			[discount_rules, conditions]
		);

		return (
			<div className="disco-rounded-lg disco-mt-2 disco-relative">
				<div className="disco-absolute disco-right-2 disco-top-1">
					<button
						type="button"
						onClick={handleTogglePicker}
						className="disco-text-lg"
					>
						😊
					</button>
					{showPicker && (
						<div
							ref={emojiPickerRef}
							className="disco-absolute disco-z-10 disco-top-8 disco-right-0 disco-bg-white disco-shadow-lg disco-rounded-lg"
						>
							<EmojiPicker
								onEmojiClick={handleEmojiClick}
								skinTonesDisabled={true}
							/>
						</div>
					)}
				</div>

				<textarea
					ref={ref}
					value={value}
					onChange={onChange}
					rows={2}
					className="disco-w-full disco-px-3 disco-py-2 disco-pr-10 disco-text-gray-700 disco-bg-white disco-border disco-border-primary disco-rounded-lg focus:disco-outline-none focus:disco-ring-0 focus:disco-ring-primary focus:disco-border-primary"
				/>

				{/* Information Section */}
				<div className="disco-mt-1 disco-space-y-1 disco-text-sm">
					{dynamicVariables.map((item, index) => (
						<div
							key={index}
							className="disco-flex disco-items-center disco-space-x-2"
						>
							<span className="disco-text-red-500">
								<InformationCircleIcon className="disco-w-4 disco-h-4" />
							</span>
							<p>
								<span className="disco-font-base disco-font-thin">
									{'[' + item.label + ']'}
								</span>{' '}
								→{' '}
								<span className="disco-italic disco-font-semibold">
									{item.example}
								</span>
							</p>
						</div>
					))}
				</div>
			</div>
		);
	}
);

BadgeTextWithDynamicProperties.displayName = 'BadgeTextWithDynamicProperties';

export default BadgeTextWithDynamicProperties;
