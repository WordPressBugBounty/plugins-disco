import { __ } from '@wordpress/i18n';

function HeroSection() {
	return (
		<div className="disco-flex disco-flex-col disco-gap-2 disco-px-8 disco-pt-6 disco-pb-4">
			<h1
				className="disco-text-[30px] disco-font-bold disco-leading-9 disco-bg-clip-text disco-text-transparent"
				style={{
					backgroundImage:
						'linear-gradient(144.56deg, #0091FF 0%, #12A1FF 100%)',
				}}
			>
				{ __( 'Plugin Integrations', 'disco' ) }
			</h1>
			<p className="disco-text-[#1a1d1f] disco-text-base disco-leading-6 disco-font-normal">
				{ __(
					'Disco works natively with these plugins. Detected integrations activate automatically — no extra setup needed.',
					'disco'
				) }
			</p>
		</div>
	);
}

export default HeroSection;
