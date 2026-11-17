import { __ } from '@wordpress/i18n';
import bannerImage from '../../../asset/img/banner/black_friday_sidebar_banner_2026.svg';

/*
 * Black Friday 2026 sidebar banner. It takes the place of the "Unlock Disco Pro"
 * card while the sale runs; outside these dates the card shows as usual.
 * Times are UTC, matching the Black Friday admin notice (PromotionalNotice.php).
 */
const SALE_START = Date.UTC(2026, 10, 16, 0, 0, 0); // 16 Nov 2026 00:00:00
const SALE_END = Date.UTC(2026, 11, 7, 23, 59, 59); // 7 Dec 2026 23:59:59

/*
 * Styles live here, not in Tailwind: the plugin's prebuilt Tailwind CSS has no
 * classes for these, and :hover / :focus-visible cannot be inline styles.
 * max-width keeps the banner from stretching in the wide Help/Docs column.
 */
const BANNER_CSS = `
.disco-bf-sidebar-banner{display:block;max-width:320px;border-radius:12px;overflow:hidden;text-decoration:none;box-shadow:0 10px 30px -10px rgba(0,0,0,.55);transition:transform .2s ease,box-shadow .2s ease}
.disco-bf-sidebar-banner:hover{transform:translateY(-2px);box-shadow:0 16px 34px -12px rgba(0,0,0,.6)}
.disco-bf-sidebar-banner:focus{outline:none;box-shadow:none}
.disco-bf-sidebar-banner:focus-visible{outline:2px solid #0bc88a;outline-offset:3px}
.disco-bf-sidebar-banner img{display:block;width:100%;height:auto}
@media (prefers-reduced-motion:reduce){.disco-bf-sidebar-banner,.disco-bf-sidebar-banner:hover{transition:none;transform:none}}
`;

export function isBlackFridaySale(now = Date.now()) {
	return now >= SALE_START && now <= SALE_END;
}

/**
 * @param {Object} props
 * @param {string} props.placement Where the banner sits, sent as utm_campaign.
 */
export default function BlackFridaySidebarBanner({ placement }) {
	const url = `https://discoplugin.com/?utm_source=disco-plugin&utm_medium=in-plugin&utm_campaign=${placement}&utm_content=black-friday-2026-sidebar#pricing`;

	return (
		<>
			<style>{BANNER_CSS}</style>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="disco-bf-sidebar-banner"
			>
				<img
					src={bannerImage}
					alt={__(
						'Disco Pro Black Friday: up to 60% off yearly and lifetime plans. Save up to $299. Try Disco Pro now.',
						'disco'
					)}
					width="290"
					height="465"
				/>
			</a>
		</>
	);
}
