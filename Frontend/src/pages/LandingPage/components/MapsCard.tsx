import { MapTrifoldIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';

export const MapsCard = () => {
    const { t } = useTranslation();

    return (
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
    );
};