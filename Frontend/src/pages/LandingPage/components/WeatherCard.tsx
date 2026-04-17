import { CloudSunIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';

export const WeatherCard = () => {
    const { t } = useTranslation();

    return (
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
    );
};