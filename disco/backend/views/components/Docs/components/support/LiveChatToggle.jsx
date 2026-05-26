import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function LiveChatToggle() {
	const [enabled, setEnabled] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetch(`${DISCO.json_url}settings`, {
			headers: { 'X-WP-Nonce': DISCO.rest_nonce },
		})
			.then((r) => r.json())
			.then((data) => {
				setEnabled(!!data.live_chat_support);
				setLoading(false);
			})
			.catch(() => setLoading(false));

		const onLiveChatChanged = (e) => setEnabled(!!e.detail.enabled);
		window.addEventListener('disco:livechat:changed', onLiveChatChanged);
		return () => window.removeEventListener('disco:livechat:changed', onLiveChatChanged);
	}, []);

	const handleToggle = (next) => {
		setEnabled(next);
		setSaving(true);

		fetch(`${DISCO.json_url}settings`, {
			method: 'PUT',
			headers: {
				'X-WP-Nonce': DISCO.rest_nonce,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ live_chat_support: next }),
		})
			.then((r) => {
				if (r.ok) {
					window.dispatchEvent(
						new CustomEvent('disco:livechat:changed', { detail: { enabled: next } })
					);
				} else {
					setEnabled(!next);
				}
			})
			.catch(() => setEnabled(!next))
			.finally(() => setSaving(false));
	};

	return (
		<div className="disco-flex disco-items-center disco-gap-4 disco-p-4 disco-rounded-xl disco-border disco-border-gray-200 disco-bg-gray-50 hover:disco-bg-white hover:disco-shadow-sm hover:disco-border-primary disco-transition-all">
			<span className="disco-w-12 disco-h-12 disco-rounded-xl disco-flex disco-items-center disco-justify-center disco-flex-shrink-0 disco-bg-[#ffd9d9]">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
					<path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
				</svg>
			</span>

			<div className="disco-flex-1">
				<p className="disco-font-semibold disco-text-gray-800 disco-m-0 disco-text-base">
					Live Chat
				</p>
				<p className="disco-text-sm disco-text-gray-400 disco-m-0">
					Need help? Let&rsquo;s chat
				</p>
			</div>

			<Switch
				checked={enabled}
				onChange={handleToggle}
				disabled={loading || saving}
				className={`${
					enabled ? 'disco-bg-primary' : 'disco-bg-gray-200'
				} disco-relative disco-inline-flex disco-h-5 disco-w-9 disco-flex-shrink-0 disco-cursor-pointer disco-rounded-full disco-border-2 disco-border-transparent disco-transition-colors disco-duration-200 disco-ease-in-out focus:disco-outline-none ${
					loading || saving ? 'disco-opacity-50 disco-cursor-not-allowed' : ''
				}`}
			>
				<span
					aria-hidden="true"
					className={`${
						enabled ? 'disco-translate-x-4' : 'disco-translate-x-0'
					} disco-pointer-events-none disco-inline-block disco-h-4 disco-w-4 disco-transform disco-rounded-full disco-bg-white disco-shadow disco-ring-0 disco-transition disco-duration-200 disco-ease-in-out`}
				/>
			</Switch>
		</div>
	);
}
