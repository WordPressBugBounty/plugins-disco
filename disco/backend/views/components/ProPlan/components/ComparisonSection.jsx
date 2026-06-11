import { Fragment } from 'react';
import comparisonData from '../data/comparisonData';
import Badge from './Badge';

function ComparisonSection() {
	return (
		<div className="disco-max-w-5xl disco-mx-auto disco-px-4 disco-py-12">
			<h2 className="disco-text-3xl disco-font-extrabold disco-text-center disco-text-gray-900 disco-mb-2">
				Free vs Pro — Full Comparison
			</h2>
			<p className="disco-text-center disco-text-gray-400 disco-text-sm disco-mb-8">
				See exactly what you unlock when you upgrade to Disco Pro.
			</p>

			<div className="disco-overflow-x-auto">
				<table className="disco-w-full disco-text-sm">
					<thead>
						<tr className="disco-bg-primary-light disco-border-b disco-border-gray-200">
							<th className="disco-text-left disco-py-3 disco-px-2 disco-font-semibold disco-text-black disco-uppercase disco-text-xs disco-w-1/2">
								Feature
							</th>
							<th className="disco-text-center disco-py-3 disco-px-2 disco-font-semibold disco-text-black disco-uppercase disco-text-xs disco-w-1/4">
								Free
							</th>
							<th className="disco-text-center disco-text-xs disco-py-3 disco-px-2 disco-w-1/4">
								<span className="disco-text-black disco-mr-1">
									{'🔒 Pro'}
								</span>
								<a
									href="https://discoplugin.com/?utm_source=pro_plan&utm_medium=text_button&utm_campaign=free-pro&utm_id=1#pricing"
									target="_blank"
									rel="noopener noreferrer"
									className="disco-font-medium disco-text-white disco-bg-primary disco-rounded-full disco-px-2 disco-py-1 hover:disco-text-white focus:disco-rounded-full"
								>
									Unlock All
								</a>
							</th>
						</tr>
					</thead>
					<tbody>
						{comparisonData.map((sec, si) => (
							<Fragment key={si}>
								<tr>
									<td
										colSpan={3}
										className="disco-py-3 disco-px-2 disco-bg-[#F8FAFC]"
									>
										<span className="disco-text-xs disco-font-bold disco-text-emerald-600 disco-uppercase disco-tracking-wider">
											{sec.title}
										</span>
									</td>
								</tr>
								{sec.rows.map((row, ri) => (
									<tr
										key={ri}
										className="disco-border-b disco-border-gray-100 hover:disco-bg-gray-50 disco-transition-colors"
									>
										<td className="disco-py-2.5 disco-px-2 disco-text-gray-700 disco-flex disco-items-center disco-gap-2">
											{row[0]}
											{row[3] && (
												<Badge
													color={
														row[3] === 'PRO'
															? 'blue'
															: row[3] === 'NEW'
																? 'orange'
																: 'green'
													}
												>
													{row[3]}
												</Badge>
											)}
										</td>
										<td className="disco-text-center disco-py-2.5 disco-text-primary">
											{row[1] ? (
												'✓'
											) : (
												<span className="disco-text-sm disco-bg-[#FEF3C7] disco-text-[#92400E] disco-font-bold disco-py-1 disco-px-2 disco-rounded-full">
													{'🔒 Pro'}
												</span>
											)}
										</td>
										<td className="disco-text-center disco-py-2.5 disco-text-primary">
											{'✓'}
										</td>
									</tr>
								))}
							</Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ComparisonSection;
