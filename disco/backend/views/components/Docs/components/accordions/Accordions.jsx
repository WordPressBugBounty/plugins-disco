import { useState } from 'react';

export default function DiscoAccordion({ docsData = [] }) {
	const [open, setOpen] = useState();

	const toggle = (i) => setOpen(open === i ? -1 : i);

	return (
		<div className="disco-w-full disco-font-sans">
			<div className="disco-flex disco-flex-col disco-gap-2">
				{docsData.map((sec, i) => (
					<div
						key={i}
						className={`disco-rounded-xl disco-border disco-overflow-hidden disco-bg-white ${sec.color}`}
					>
						<button
							onClick={() => toggle(i)}
							className="disco-w-full disco-flex disco-items-center disco-gap-3 disco-p-4 disco-cursor-pointer disco-bg-transparent disco-border-none disco-text-left"
						>
							<span className="disco-text-2xl disco-w-10 disco-h-10 disco-flex disco-items-center disco-justify-center disco-bg-white disco-rounded-lg disco-shadow-sm">
								<img src={sec.icon?.default} alt={'icon'} />
							</span>
							<div className="disco-flex-1">
								<p className="disco-font-semibold disco-text-gray-800 disco-text-base disco-m-0">
									{sec.title}
								</p>
								<p className="disco-text-sm disco-text-gray-500 disco-m-0">
									{sec.desc}
								</p>
							</div>
							<span className="disco-bg-green-100 disco-text-green-700 disco-text-sm disco-font-semibold disco-rounded-full disco-px-2.5 disco-py-0.5">
								{sec.items.length || 0}
							</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="disco-w-5 disco-h-5 disco-text-gray-400 disco-transition-transform disco-duration-300"
								style={{
									transform:
										open === i
											? 'rotate(180deg)'
											: 'rotate(0deg)',
								}}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
								/>
							</svg>
						</button>

						{/* Animated panel */}
						<div
							style={{
								maxHeight: open === i ? '2000px' : '0',
								transition: `all 0.4s ease-in-out`,
								overflow: 'hidden',
								'transition-duration': '300ms',
							}}
						>
							{sec.items.length > 0 ? (
								<div className="disco-border-t disco-border-gray-200 disco-bg-white disco-bg-opacity-60">
									{sec.items.map((item, j) => (
										<a
											key={j}
											href={item?.link}
											target="_blank"
											rel="noopener noreferrer"
											className="disco-flex disco-items-center disco-gap-3 disco-px-6 disco-py-3 disco-border-b disco-border-gray-100 last:disco-border-b-0 disco-bg-white disco-cursor-pointer focus:disco-shadow-none hover:disco-bg-gray-50 hover:disco-text-primary disco-transition-colors disco-duration-200"
										>
											<svg
												className="disco-w-5 disco-h-5 disco-text-gray-300 disco-flex-shrink-0"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											<div className="disco-flex-1">
												<p className="disco-text-base disco-font-medium disco-m-0">
													{item.title?.rendered ||
														item.title}
												</p>
											</div>
										</a>
									))}
								</div>
							) : (
								<div className="disco-border-t disco-border-gray-200 disco-bg-white disco-bg-opacity-60 disco-p-4 disco-text-center disco-text-sm disco-text-gray-400">
									No articles yet
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
