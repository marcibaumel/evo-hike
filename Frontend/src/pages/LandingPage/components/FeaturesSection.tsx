import { CloudSunIcon, MapTrifoldIcon, UsersIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/ui/Card';

//TODO: SEPARATE FEATURE CARDS INTO THEIR OWN COMPONENTS FOR BETTER MAINTAINABILITY
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
                    {/* Large Card: Maps */}
                    <Card
                        variant="solid"
                        className="md:col-span-2 row-span-1 md:row-span-2 p-8 relative overflow-hidden group hover:border-brand-accent/20 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            <MapTrifoldIcon size={200} weight="thin" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="p-4 bg-brand-accent/10 w-fit rounded-2xl text-brand-accent mb-4">
                                <MapTrifoldIcon size={32} weight="duotone" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-display mb-2">{t('landing.features.maps_title')}</h3>
                                <p className="text-brand-muted max-w-md">{t('landing.features.maps_desc')}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-linear-to-tl from-brand-accent/5 to-transparent rounded-tl-[100px]" />
                    </Card>

                    {/* Weather Card */}
                    <Card
                        variant="solid"
                        className="p-8 relative overflow-hidden group hover:border-blue-400/30 transition-all duration-500">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 rotate-12">
                            <CloudSunIcon size={140} weight="thin" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="p-4 bg-blue-500/10 w-fit rounded-2xl text-blue-400">
                                <CloudSunIcon size={32} weight="duotone" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-display mb-2">{t('landing.features.weather_title')}</h3>
                                <p className="text-brand-muted text-sm">{t('landing.features.weather_desc')}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Community Card */}
                    <Card
                        variant="solid"
                        className="p-8 relative overflow-hidden group hover:border-brand-orange/30 transition-all duration-500">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 -rotate-12">
                            <UsersIcon size={140} weight="thin" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="p-4 bg-brand-orange/10 w-fit rounded-2xl text-brand-orange">
                                <UsersIcon size={32} weight="duotone" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-display mb-2">{t('landing.features.community_title')}</h3>
                                <p className="text-brand-muted text-sm">{t('landing.features.community_desc')}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};
