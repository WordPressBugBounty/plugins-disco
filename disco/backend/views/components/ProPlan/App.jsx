import HeroSection from './components/HeroSection';
import PricingSection from './components/PricingSection';
import ComparisonSection from './components/ComparisonSection';
import WhyUpgradeSection from './components/WhyUpgradeSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTAFooter from './components/CTAFooter';

export default function DiscoPricingPage() {
	return (
		<div className="disco-min-h-screen disco-bg-white disco-font-sans disco-my-4 disco-mr-4 disco-p-5 disco-rounded-2xl">
			<HeroSection />
			<PricingSection />
			<ComparisonSection />
			<WhyUpgradeSection />
			<TestimonialsSection />
			<CTAFooter />
		</div>
	);
}
