import useIsPro from '../../../Main/hooks/useIsPro';
import DiscoProCard from './ProCard';
import DiscoQuickLinks from './QuickLinks';

export default function DiscoSidebar() {
	const isPro = useIsPro();
	return (
		<div className="disco-w-[30%] disco-flex disco-flex-col disco-gap-4 disco-font-sans">
			{!isPro && <DiscoProCard />}
			<DiscoQuickLinks />
		</div>
	);
}
