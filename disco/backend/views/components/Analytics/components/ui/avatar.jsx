import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';

import { cn } from '@/lib/utils';

function Avatar({ className, size = 'default', ...props }) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			data-size={size}
			className={cn(
				'disco-group/avatar disco-relative disco-flex disco-size-8 disco-shrink-0 disco-rounded-full disco-select-none after:disco-absolute after:disco-inset-0 after:disco-rounded-full after:disco-border after:disco-border-border after:disco-mix-blend-darken data-[size=lg]:disco-size-10 data-[size=sm]:disco-size-6 dark:after:disco-mix-blend-lighten',
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
				'disco-aspect-square disco-size-full disco-rounded-full disco-object-cover',
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
				'disco-flex disco-size-full disco-items-center disco-justify-center disco-rounded-full disco-bg-muted disco-text-sm disco-text-muted-foreground group-data-[size=sm]/avatar:disco-text-xs',
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
				'disco-absolute disco-right-0 disco-bottom-0 disco-z-10 disco-inline-flex disco-items-center disco-justify-center disco-rounded-full disco-bg-primary disco-text-primary-foreground disco-bg-blend-color disco-ring-2 disco-ring-background disco-select-none',
				'group-data-[size=sm]/avatar:disco-size-2 group-data-[size=sm]/avatar:[&>svg]:disco-hidden',
				'group-data-[size=default]/avatar:disco-size-2.5 group-data-[size=default]/avatar:[&>svg]:disco-size-2',
				'group-data-[size=lg]/avatar:disco-size-3 group-data-[size=lg]/avatar:[&>svg]:disco-size-2',
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
				'disco-group/avatar-group disco-flex disco--space-x-2 *:data-[slot=avatar]:disco-ring-2 *:data-[slot=avatar]:disco-ring-background',
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
				'disco-relative disco-flex disco-size-8 disco-shrink-0 disco-items-center disco-justify-center disco-rounded-full disco-bg-muted disco-text-sm disco-text-muted-foreground disco-ring-2 disco-ring-background group-has-data-[size=lg]/avatar-group:disco-size-10 group-has-data-[size=sm]/avatar-group:disco-size-6 [&>svg]:disco-size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:disco-size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:disco-size-3',
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
