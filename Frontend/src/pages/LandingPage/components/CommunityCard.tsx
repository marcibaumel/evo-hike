import { UsersIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';
import bgImage from '../../../assets/pictures/commBg.jpg';


export const CommunityCard = () => {
    const { t } = useTranslation();

    return (
        <Card
            variant="solid"
            style={{ backgroundImage: `url(${bgImage})` }}
            className="p-8 bg-emerald/50 bg-blend-overlay bg-cover bg-center bg-no repeat relative overflow-hidden group hover:border-brand-orange/30 transition-all duration-500">
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
    );
};