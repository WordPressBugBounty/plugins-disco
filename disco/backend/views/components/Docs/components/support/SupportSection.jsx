import useIsPro from '../../../Main/hooks/useIsPro';
import DiscoChannelCard from './ChannelCard';
import DiscoSupportHeader from './SupportHeader';
import LiveChatToggle from './LiveChatToggle';

const channels = [
	{
		title: 'Submit a Support Ticket',
		desc: 'Response within 24 hours',
		icon: '✉️',
		iconBg: 'disco-bg-green-100',
		pro: false,
		link: 'https://discoplugin.com/my-account/support/',
	},
	{
		title: 'WordPress.org Forums',
		desc: 'Community support & bug reports',
		icon: '🐞',
		iconBg: 'disco-bg-blue-100',
		pro: false,
		link: 'https://wordpress.org/support/plugin/disco/',
	},
	{
		title: 'Priority Support',
		desc: 'Response within 4 hours',
		icon: '⚡',
		iconBg: 'disco-bg-yellow-100',
		pro: true,
		link: 'https://discoplugin.com/my-account/support/',
	},
];

export default function DiscoSupportSection() {
	const isPro = useIsPro();

	return (
		<div className="disco-w-full disco-py-4 disco-font-sans">
			<div className="disco-bg-white disco-rounded-2xl disco-border disco-border-gray-200 disco-shadow-sm disco-p-8 disco-flex disco-flex-col md:disco-flex-row disco-gap-8">
				<DiscoSupportHeader />
				<div className="disco-flex-1 disco-flex disco-flex-col disco-gap-3">
					<p className="disco-text-xs disco-font-bold disco-tracking-widest disco-text-gray-400 disco-uppercase disco-m-0 disco-mb-1">
						Choose a Support Channel
					</p>
					{channels.map((ch, i) => (
						<DiscoChannelCard key={i} {...ch} isPro={isPro} />
					))}
					<LiveChatToggle />
				</div>
			</div>
		</div>
	);
}
