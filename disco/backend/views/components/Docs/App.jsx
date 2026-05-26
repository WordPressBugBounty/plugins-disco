import { useEffect, useState } from 'react';
import DiscoAccordion from './components/accordions/Accordions';
import HelpCenter from './components/help-center/HelpCenter';
import DiscoResources from './components/resources/AdditionalResources';
import DiscoSidebar from './components/sidebar/Sidebar';
import DiscoSupportSection from './components/support/SupportSection';
import initialData from './data/docsData';
import getDocs from './utils/fetchDocs';

export default function App() {
	const [docsData, setDocsData] = useState(initialData);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const fetchDocs = async () => {
			try {
				const data = await getDocs();
				const updatedDocs = initialData.map((section) => {
					const matchingDocs = data.filter(
						(doc) => doc.doc_category[0] === section.doc_category_id
					);
					return { ...section, items: matchingDocs };
				});
				setDocsData(updatedDocs);
			} catch (err) {
				console.error('Failed to fetch docs:', err);
			}
		};
		fetchDocs();
	}, []);

	const query = searchQuery.trim().toLowerCase();

	const stripHtml = (html) =>
		html
			? html
					.replace(/<[^>]*>/g, ' ')
					.replace(/\s+/g, ' ')
					.trim()
			: '';

	const itemMatches = (item) => {
		const title = (item.title?.rendered || item.title || '').toLowerCase();
		const content = stripHtml(item.content?.rendered || '').toLowerCase();
		return title.includes(query) || content.includes(query);
	};

	// Flat list of matching results for the search dropdown
	const searchResults = query
		? docsData.flatMap((section) =>
				section.items.filter(itemMatches).map((item) => ({
					title: item.title?.rendered || item.title,
					link: item.link,
					section: section.title,
					excerpt: stripHtml(
						item.excerpt?.rendered || item.content?.rendered || ''
					).slice(0, 100),
				}))
			)
		: [];

	return (
		<div className="disco-py-4 disco-pr-4">
			<HelpCenter
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				searchResults={searchResults}
			/>
			{/* Accordions */}
			<div className="disco-flex disco-justify-between disco-gap-5 disco-py-5">
				<div className="disco-w-[70%]">
					<DiscoAccordion docsData={docsData} />
					{/* Contact Form */}
					<DiscoSupportSection />
					<DiscoResources />
				</div>
				<DiscoSidebar />
			</div>
		</div>
	);
}
