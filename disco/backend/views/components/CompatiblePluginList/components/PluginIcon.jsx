function PluginIcon({ plugin }) {
	if (plugin.icon) {
		return (
			<img
				src={plugin.icon}
				alt={plugin.name}
				className="disco-w-full disco-h-full disco-object-cover"
			/>
		);
	}
	return (
		<div
			className="disco-w-full disco-h-full disco-flex disco-items-center disco-justify-center disco-text-white disco-text-[10.8px] disco-font-extrabold disco-tracking-[-0.5px]"
			style={{ backgroundColor: plugin.iconBg || '#94a3b8' }}
		>
			{plugin.iconInitials || plugin.name.charAt(0)}
		</div>
	);
}

export default PluginIcon;
