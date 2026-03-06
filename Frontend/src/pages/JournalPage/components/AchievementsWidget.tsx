import { TrophyIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/ui/Card';

export const AchievementsWidget = () => {
    const { t } = useTranslation();

    return (
        <Card variant="glass">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrophyIcon className="text-yellow-400" /> {t('dashboard.badges.title')}
            </h3>
            <div className="flex justify-between">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-linear-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-xl grayscale hover:grayscale-0 transition-all cursor-help"
                        title="Badge Name">
                        🏅
                    </div>
                ))}
            </div>
        </Card>
    );
};
