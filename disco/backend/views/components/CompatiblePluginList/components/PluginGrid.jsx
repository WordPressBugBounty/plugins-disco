import BottomCTA from './BottomCTA';
import PluginCard from './PluginCard';
import RequestIntegrationCard from './RequestIntegrationCard';

function PluginGrid({ plugins }) {
	return (
		<div className="disco-px-8 disco-pb-8">
			{/* Plugin grid */}
			<div className="disco-grid disco-grid-cols-1 md:disco-grid-cols-2 lg:disco-grid-cols-4 disco-gap-5 disco-mb-5">
				{plugins.map((plugin) => (
					<PluginCard key={plugin.id} plugin={plugin} />
				))}
				<RequestIntegrationCard />
			</div>

			{/* Bottom CTA */}
			<BottomCTA />
		</div>
	);
}

export default PluginGrid;
