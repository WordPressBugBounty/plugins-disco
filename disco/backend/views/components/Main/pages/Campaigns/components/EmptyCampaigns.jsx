import { PlusIcon } from '@heroicons/react/16/solid';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { reset } from '../../../features/discount/discountSlice';

const TERMS_OF_SERVICE_URL =
	'https://www.activecampaign.com/legal/terms-of-service';
const PRIVACY_POLICY_URL =
	'https://www.activecampaign.com/legal/privacy-policy';

// ActiveCampaign config. The v1 API accepts the key as a query param and a
// form-encoded POST, which the browser sends without a CORS preflight
// (mode: 'no-cors'). The response is opaque — success is assumed once the
// request is sent.
const ACTIVE_CAMPAIGN_CONFIG = {
	apiUrl: 'https://webappick70460.api-us1.com',
	apiKey: 'fbe194678478240ca034c3f9bca559d708f16ad100585cb4dcf68d1eede1e5f39acc193a',
	listId: 35,
	tag: 'lead from empty campaign page',
};

const activeCampaign = window.DISCO?.active_campaign;

const EmptyCampaigns = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showEmailField, setShowEmailField] = useState(
		Boolean(activeCampaign?.show_email_field)
	);

	const handleCreateCampaign = () => {
		navigate('disco');
		dispatch(reset());
	};

	const handleSubscribe = async (e) => {
		e.preventDefault();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error(__('Please enter a valid email address', 'disco'));
			return;
		}

		setIsSubmitting(true);

		try {
			// 1. Submit the contact straight to ActiveCampaign (v1 API).
			const { apiUrl, apiKey, listId, tag } = ACTIVE_CAMPAIGN_CONFIG;
			const acUrl = `${apiUrl}/admin/api.php?api_action=contact_sync&api_key=${apiKey}&api_output=json`;
			const acBody = new FormData();
			acBody.append('email', email);
			acBody.append(`p[${listId}]`, listId);
			acBody.append(`status[${listId}]`, 1);
			acBody.append('tags', tag);

			await fetch(acUrl, {
				method: 'POST',
				mode: 'no-cors',
				body: acBody,
			});

			// 2. Store the collected flag via AJAX so the field stays hidden.
			const body = new FormData();
			body.append('action', activeCampaign.action);
			body.append('nonce', activeCampaign.nonce);

			const response = await fetch(activeCampaign.ajax_url, {
				method: 'POST',
				credentials: 'same-origin',
				body,
			});
			const result = await response.json();

			if (result.success) {
				toast.success(__('Thanks for subscribing!', 'disco'));
				setEmail('');
				setShowEmailField(false);
			} else {
				toast.error(
					result.data?.message ||
						__('Could not subscribe. Please try again.', 'disco')
				);
			}
		} catch (error) {
			toast.error(__('Network error. Please try again.', 'disco'));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			data-testid="empty-campaigns"
			className="disco-flex disco-flex-col disco-items-center disco-pt-20 disco-pb-24 disco-px-4"
		>
			<div className="disco-flex disco-flex-col disco-items-center disco-gap-4 disco-text-center">
				<h3 className="disco-text-[28px] disco-leading-10 disco-font-extrabold disco-text-[#111111] disco-m-0">
					{__(
						'No campaigns yet — your first one takes 2 minutes',
						'disco'
					)}
				</h3>
				<p className="disco-text-lg disco-leading-[25px] disco-font-medium disco-text-[#597A67] disco-max-w-[640px] disco-m-0">
					{__(
						'Stores using automated discounts see up to 34% higher average order value. Start in 2 minutes',
						'disco'
					)}
				</p>
				<button
					data-testid="create-first-campaign-btn"
					onClick={handleCreateCampaign}
					className="disco-flex disco-items-center disco-gap-1.5 disco-h-[43px] disco-px-5 disco-rounded-xl disco-bg-[#0BC88A] hover:disco-bg-[#0AB57D] disco-text-white disco-text-[17px] disco-font-semibold disco-shadow-[0px_3px_6px_0px_rgba(22,163,74,0.25)] disco-transition-colors disco-duration-200"
				>
					<PlusIcon className="disco-h-4 disco-w-4" />
					{__('Create Your First Campaign', 'disco')}
				</button>
			</div>

			{showEmailField && (
				<div className="disco-mt-12 disco-w-full disco-max-w-[631px] disco-rounded-2xl disco-border disco-border-white disco-bg-[#FEFEFE] disco-shadow-[0px_0px_32px_0px_rgba(0,0,0,0.04)] disco-p-7">
					<p className="disco-text-base disco-leading-6 disco-font-bold disco-text-[#0F6E56] disco-m-0">
						{__('Free weekly tips', 'disco')}
					</p>
					<p className="disco-mt-1 disco-text-lg disco-leading-7 disco-font-bold disco-text-[#111111] disco-mb-0">
						{__(
							'Get discount strategies that increase WooCommerce revenue sent every week.',
							'disco'
						)}
					</p>
					<form
						onSubmit={handleSubscribe}
						className="disco-mt-5 disco-flex disco-gap-3"
					>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={__('your@store.com', 'disco')}
							data-testid="subscribe-email-input"
							className="disco-flex-1 disco-h-[50px] !disco-px-4 !disco-bg-white !disco-border !disco-border-[#A8E6CE] !disco-rounded-[9px] disco-text-base disco-text-[#111111] placeholder:disco-text-[#B0D4C8] focus:!disco-border-[#0BC88A] focus:!disco-shadow-none disco-outline-none"
						/>
						<button
							type="submit"
							data-testid="subscribe-btn"
							disabled={isSubmitting}
							className="disco-h-[50px] disco-w-[130px] disco-shrink-0 disco-rounded-[9px] disco-bg-[#0BC88A] hover:disco-bg-[#0AB57D] disabled:disco-opacity-60 disabled:disco-cursor-not-allowed disco-text-white disco-text-lg disco-font-semibold disco-tracking-[-0.2px] disco-transition-colors disco-duration-200"
						>
							{isSubmitting
								? __('Subscribing…', 'disco')
								: __('Subscribe', 'disco')}
						</button>
					</form>
					<p className="disco-mt-4 disco-text-xs disco-leading-4 disco-text-[#AAAAAA] disco-text-center disco-m-0">
						{__('By subscribing you agree to the', 'disco')}{' '}
						<a
							href={TERMS_OF_SERVICE_URL}
							target="_blank"
							rel="noreferrer"
							className="!disco-text-[#0BC88A] visited:!disco-text-[#0BC88A] hover:!disco-text-[#0AB57D] disco-underline"
						>
							{__('Terms', 'disco')}
						</a>
						<span className="disco-text-[#0BC88A]">.</span>{' '}
						<a
							href={PRIVACY_POLICY_URL}
							target="_blank"
							rel="noreferrer"
							className="!disco-text-[#0BC88A] visited:!disco-text-[#0BC88A] hover:!disco-text-[#0AB57D] disco-underline"
						>
							{__('Policy', 'disco')}
						</a>
						<span className="disco-text-[#0BC88A]">.</span>
					</p>
				</div>
			)}
		</div>
	);
};

export default EmptyCampaigns;
