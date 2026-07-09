import { Mail, MapPin, User } from 'lucide-react';
import CustomerAvatar from './CustomerAvatar';

const AVATAR_COLORS = [
	'#06b6d4',
	'#ec4899',
	'#f59e0b',
	'#f97316',
	'#3b82f6',
	'#84cc16',
	'#8b5cf6',
	'#ef4444',
	'#a78bfa',
	'#10b981',
];

function getInitials(name) {
	if (!name) return '?';
	const parts = name.trim().split(/\s+/);
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

const CustomerHeader = ({ customer }) => {
	const { id, name, email, state, avatar } = customer;
	const color = AVATAR_COLORS[id % AVATAR_COLORS.length];

	return (
		<div className="disco-bg-white disco-border disco-border-[#e5e7eb] disco-rounded-xl disco-px-4 disco-py-4 disco-flex disco-items-center disco-gap-3">
			<CustomerAvatar
				avatar={avatar}
				fallback={getInitials(name)}
				color={color}
			/>
			<div>
				<h2 className="disco-text-sm disco-font-bold disco-text-[#111827] disco-tracking-tight disco-leading-snug">
					{name}
				</h2>
				<div className="disco-flex disco-items-center disco-gap-3 disco-mt-1.5 disco-flex-wrap">
					{email && (
						<span className="disco-flex disco-items-center disco-gap-1 disco-text-[10px] disco-text-[#6b7280]">
							<Mail className="disco-size-3 disco-text-[#9ca3af]" />
							{email}
						</span>
					)}
					{state && (
						<span className="disco-flex disco-items-center disco-gap-1 disco-text-[10px] disco-text-[#6b7280]">
							<MapPin className="disco-size-3 disco-text-[#9ca3af]" />
							{state}
						</span>
					)}
					<span className="disco-flex disco-items-center disco-gap-1 disco-text-[10px] disco-text-[#9ca3af]">
						<User className="disco-size-3" />
						ID: {id}
					</span>
				</div>
			</div>
		</div>
	);
};

export default CustomerHeader;
