import { useTranslation } from 'react-i18next';

interface ProfileStatsProps {
    totalDistance: string;
    elevationGain: string;
    hikesCompleted: number;
}

export const ProfileStats = ({ totalDistance, elevationGain, hikesCompleted }: ProfileStatsProps) => {
    const { t } = useTranslation();

    return (
        <div className="md:ml-auto grid grid-cols-3 gap-4 md:gap-12 text-center z-10">
            <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">{hikesCompleted}</div>
                <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                    {t('dashboard.stats.hikes')}
                </div>
            </div>
            <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">{totalDistance}</div>
                <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                    {t('dashboard.stats.distance')}
                </div>
            </div>
            <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">{elevationGain}</div>
                <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                    {t('dashboard.stats.elevation')}
                </div>
            </div>
        </div>
    );
};