import { useMemo } from 'react';
import HeroSection from './components/HeroSection';
import PluginGrid from './components/PluginGrid';
import getPlugins from './data/plugins';

export default function CompatiblePluginListApp() {
	const plugins = useMemo(() => {
		const raw = window.DISCO_COMPATIBLE_PLUGINS?.active_plugins ?? [];
		const activePlugins = Array.isArray( raw ) ? raw : Object.values( raw );

		const withStatus = getPlugins().map((plugin) => ({
			...plugin,
			status: activePlugins.includes(plugin.pluginFile)
				? 'detected'
				: 'not-installed',
		}));

		// Detected plugins first
		return [
			...withStatus.filter((p) => p.status === 'detected'),
			...withStatus.filter((p) => p.status !== 'detected'),
		];
	}, []);

	return (
		<div className="disco-min-h-screen disco-bg-white disco-font-sans disco-my-4 disco-mr-4 disco-rounded-2xl">
			<HeroSection />
			<PluginGrid plugins={plugins} />
		</div>
	);
}
