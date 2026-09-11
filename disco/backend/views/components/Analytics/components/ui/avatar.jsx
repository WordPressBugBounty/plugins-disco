import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';

import { cn } from '@/lib/utils';

function Avatar({ className, size = 'default', ...props }) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			data-size={size}
			className={cn(
				'disco:group/avatar disco:relative disco:flex disco:size-8 disco:shrink-0 disco:rounded-full disco:select-none disco:after:absolute disco:after:inset-0 disco:after:rounded-full disco:after:border disco:after:border-border disco:after:mix-blend-darken disco:data-[size=lg]:size-10 disco:data-[size=sm]:size-6 disco:dark:after:mix-blend-lighten',
				className
			)}
			{...props}
		/>
	);
}

function AvatarImage({ className, ...props }) {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn(
				'disco:aspect-square disco:size-full disco:rounded-full disco:object-cover',
				className
			)}
			{...props}
		/>
	);
}

function AvatarFallback({ className, ...props }) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				'disco:flex disco:size-full disco:items-center disco:justify-center disco:rounded-full disco:bg-muted disco:text-sm disco:text-muted-foreground disco:group-data-[size=sm]/avatar:text-xs',
				className
			)}
			{...props}
		/>
	);
}

function AvatarBadge({ className, ...props }) {
	return (
		<span
			data-slot="avatar-badge"
			className={cn(
				'disco:absolute disco:right-0 disco:bottom-0 disco:z-10 disco:inline-flex disco:items-center disco:justify-center disco:rounded-full disco:bg-primary disco:text-primary-foreground disco:bg-blend-color disco:ring-2 disco:ring-background disco:select-none',
				'disco:group-data-[size=sm]/avatar:size-2 disco:group-data-[size=sm]/avatar:[&>svg]:hidden',
				'disco:group-data-[size=default]/avatar:size-2.5 disco:group-data-[size=default]/avatar:[&>svg]:size-2',
				'disco:group-data-[size=lg]/avatar:size-3 disco:group-data-[size=lg]/avatar:[&>svg]:size-2',
				className
			)}
			{...props}
		/>
	);
}

function AvatarGroup({ className, ...props }) {
	return (
		<div
			data-slot="avatar-group"
			className={cn(
				'disco:group/avatar-group disco:flex disco:-space-x-2 disco:*:data-[slot=avatar]:ring-2 disco:*:data-[slot=avatar]:ring-background',
				className
			)}
			{...props}
		/>
	);
}

function AvatarGroupCount({ className, ...props }) {
	return (
		<div
			data-slot="avatar-group-count"
			className={cn(
				'disco:relative disco:flex disco:size-8 disco:shrink-0 disco:items-center disco:justify-center disco:rounded-full disco:bg-muted disco:text-sm disco:text-muted-foreground disco:ring-2 disco:ring-background disco:group-has-data-[size=lg]/avatar-group:size-10 disco:group-has-data-[size=sm]/avatar-group:size-6 disco:[&>svg]:size-4 disco:group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 disco:group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
				className
			)}
			{...props}
		/>
	);
}

export {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
};
