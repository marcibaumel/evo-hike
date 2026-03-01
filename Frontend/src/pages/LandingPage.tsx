import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';

function LandingPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-brand-dark overflow-x-hidden">
            <HeroSection />
            <FeaturesSection />
            <Footer />
        </div>
    );
}

export default LandingPage;
