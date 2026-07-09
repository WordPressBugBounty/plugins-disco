import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AVATAR_PALETTE = {
	'#06b6d4': '#ecfeff',
	'#ec4899': '#fdf2f8',
	'#f59e0b': '#fffbeb',
	'#f97316': '#fff7ed',
	'#3b82f6': '#eff6ff',
	'#84cc16': '#f7fee7',
	'#ef4444': '#fef2f2',
	'#a78bfa': '#f5f3ff',
	'#8b5cf6': '#f5f3ff',
};

const CustomerAvatar = ({ avatar, color, fallback }) => {
	const bg = AVATAR_PALETTE[color] ?? '#f3f4f6';
	return (
		<Avatar>
			<AvatarImage src={avatar} />
			<AvatarFallback style={{ backgroundColor: bg, color }}>
				{fallback}
			</AvatarFallback>
		</Avatar>
	);
};

export default CustomerAvatar;
