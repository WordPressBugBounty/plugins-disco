import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

const PRICING_URL =
	'https://discoplugin.com/?utm_source=analytics&utm_medium=Analytics-Free&utm_id=free-to-pro';

/**
 * A blurred "Pro only" overlay shown over locked analytics content for non-Pro
 * users. Renders an optional lock icon + title, an optional description and an
 * upgrade CTA button.
 *
 * @param {Object}  props
 * @param {string}  props.label         CTA button label (e.g. "Unlock").
 * @param {string}  [props.title]       Optional title shown next to the lock icon.
 * @param {string}  [props.description] Optional supporting text below the title.
 * @param {boolean} [props.showIcon]    Whether to render the lock icon.
 * @param {'default'|'lg'} [props.size] Visual scale of the title and button.
 * @param {string}  [props.position]    Tailwind positioning classes for the overlay.
 * @param {string}  [props.rounded]     Tailwind rounding classes for the overlay.
 * @param {string}  [props.className]
 * @param {Object}  [props.style]       Inline styles (e.g. a computed `top`).
 * @param {string}  [props.titleClassName] Overrides the default title styling.
 */
const ProLockOverlay = ({
	label,
	title,
	description,
	showIcon = false,
	size = 'default',
	position = 'disco-inset-0',
	rounded = 'disco-rounded-[10px]',
	className,
	style,
	titleClassName,
}) => {
	const isLg = size === 'lg';

	return (
		<div
			style={style}
			className={cn(
				'disco-absolute disco-z-10 disco-flex disco-flex-col disco-items-center disco-justify-center disco-gap-3 disco-bg-white/80 disco-px-6 disco-text-center disco-backdrop-blur-[2px]',
				position,
				rounded,
				className
			)}
		>
			{(showIcon || title || description) && (
				<div className="disco-flex disco-flex-col disco-items-center disco-gap-1.5">
					{(showIcon || title) && (
						<div className="disco-flex disco-items-center disco-gap-2">
							{showIcon && (
								<Lock
									className="disco-size-[18px] disco-text-[#1f2937]"
									strokeWidth={2.5}
								/>
							)}
							{title && (
								<p
									className={cn(
										'disco-text-[#1f2937]',
										titleClassName ??
											(isLg
												? 'disco-text-2xl disco-font-bold disco-tracking-tight'
												: 'disco-text-base disco-font-medium')
									)}
								>
									{title}
								</p>
							)}
						</div>
					)}
					{description && (
						<p className="disco-max-w-md disco-text-sm disco-text-[#6b7280]">
							{description}
						</p>
					)}
				</div>
			)}
			<Button
				onClick={() => window.open(PRICING_URL, '_blank')}
				className={cn(
					'disco-rounded disco-bg-primary disco-font-semibold disco-text-white disco-shadow-[3px_4px_2px_rgba(0,0,0,0.07)] hover:disco-bg-primary-dark',
					isLg && 'disco-h-auto disco-px-6 disco-py-3 disco-text-base'
				)}
			>
				{label}
			</Button>
		</div>
	);
};

export default ProLockOverlay;
