import { useEffect, useState } from 'react';
import DiscoResourceCard from './ResourceCard';
import SkeletonCard from './SkeletonCard';

function getThumbnail(post) {
	const featured = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
	if (featured) return featured;

	const sizes =
		post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes;
	if (sizes?.medium?.source_url) return sizes.medium.source_url;
	if (sizes?.thumbnail?.source_url) return sizes.thumbnail.source_url;

	const match = post.content?.rendered?.match(/<img[^>]+src="([^">]+)"/);
	if (match?.[1]) return match[1];

	return null;
}

function mapPost(post) {
	const wordCount = post.content?.rendered
		? post.content.rendered.replace(/<[^>]+>/g, '').split(/\s+/).length
		: 0;

	return {
		id: post.id,
		tag: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'WooCommerce',
		title: post.title?.rendered || '',
		date: new Date(post.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}),
		read:
			wordCount > 0
				? `About ${Math.max(1, Math.ceil(wordCount / 200))} Min Read`
				: 'About 5 Min Read',
		link: post.link,
		imageUrl: getThumbnail(post),
	};
}

export default function DiscoResources() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(
			'https://discoplugin.com/wp-json/wp/v2/posts?_embed&per_page=3&orderby=date&order=desc'
		)
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then((data) => {
				setPosts(data.map(mapPost));
				setLoading(false);
			})
			.catch((e) => {
				setError(e.message);
				setLoading(false);
			});
	}, []);

	return (
		<div className="disco-w-full disco-py-6 disco-font-sans">
			<h2
				className="disco-text-3xl disco-font-bold disco-m-0 disco-mb-2"
				style={{ color: '#38bdf8' }}
			>
				Additional Resources
			</h2>
			<p className="disco-text-gray-400 disco-text-base disco-m-0 disco-mb-6">
				Need help with disco? These resources are great to start.
			</p>

			{error && (
				<p className="disco-text-red-400 disco-text-sm">
					Failed to load posts: {error}
				</p>
			)}

			<div
				className="disco-grid disco-gap-5"
				style={{
					gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
				}}
			>
				{loading
					? Array.from({ length: 3 }).map((_, i) => (
							<SkeletonCard key={i} />
						))
					: posts.map((r, i) => (
							<DiscoResourceCard key={r.id ?? i} {...r} />
						))}
			</div>
		</div>
	);
}
