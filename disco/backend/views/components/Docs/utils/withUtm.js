/**
 * Add the standard in-plugin UTM parameters to a discoplugin.com link.
 *
 * Used for links that come from the discoplugin.com REST API (docs, blog posts),
 * so they can't carry UTMs in the source like the static links do.
 *
 * @param {string} url      Link to tag.
 * @param {string} campaign Placement inside the plugin (utm_campaign).
 * @param {string} content  Element that was clicked (utm_content).
 * @return {string} Tagged link, or the original value if it isn't a discoplugin.com URL.
 */
const withUtm = (url, campaign, content) => {
	if (!url || !url.includes('discoplugin.com')) {
		return url;
	}

	try {
		const tagged = new URL(url);
		tagged.searchParams.set('utm_source', 'disco-plugin');
		tagged.searchParams.set('utm_medium', 'in-plugin');
		tagged.searchParams.set('utm_campaign', campaign);
		tagged.searchParams.set('utm_content', content);
		return tagged.toString();
	} catch (err) {
		return url;
	}
};

export default withUtm;
