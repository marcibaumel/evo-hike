import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';

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
