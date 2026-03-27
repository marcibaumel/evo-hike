import { useTranslation } from 'react-i18next';
import { MapsCard } from './MapsCard';
import { WeatherCard } from './WeatherCard';
import { CommunityCard } from './CommunityCard';

export const FeaturesSection = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-display">{t('landing.features.title')}</h2>
                    <p className="text-brand-muted text-lg max-w-2xl mx-auto">{t('landing.features.subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    <MapsCard />
                    <WeatherCard />
                    <CommunityCard />
                </div>
            </div>
        </section>
    );
};