import { useEffect, useState } from 'react';
import initialData from '../../data/docsData';
import { getDocsLength } from '../../utils/fetchDocs';
import DocCount from './DocCount';
import SearchInput from './SearchInput';

export default function HelpCenter({
	searchQuery,
	setSearchQuery,
	searchResults,
}) {
	const [articlesCount, setArticlesCount] = useState('...');

	useEffect(() => {
		getDocsLength().then((count) => setArticlesCount(count));
	}, []);

	const docs = [
		{
			label: 'Articles',
			count: articlesCount,
		},
		{
			label: 'Categories',
			count: initialData.length,
		},
		{
			label: 'Support',
			count: '24h',
		},
	];

	return (
		<div className="disco-bg-primary-light disco-rounded-2xl disco-border disco-border-primary disco-p-7">
			<div className="disco-flex disco-justify-between">
				<div>
					<h4 className="disco-text-sm disco-text-primary disco-font-bold">
						• Help Center
					</h4>
					<h2 className="disco-text-3xl disco-font-extrabold disco-pb-3">
						How can we{' '}
						<span className="disco-text-primary">help</span> you?
					</h2>
					<p className="disco-text-sm disco-font-light ">
						Everything you need to set up, optimize and grow with
						Disco — <br />
						guides, tutorials and references.
					</p>
				</div>
				<div className="disco-flex disco-items-start disco-gap-4">
					{docs.map((doc, index) => (
						<DocCount
							key={index}
							label={doc.label}
							count={doc.count}
						/>
					))}
				</div>
			</div>
			{/* Search  */}
			<SearchInput
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				searchResults={searchResults}
			/>
		</div>
	);
}
