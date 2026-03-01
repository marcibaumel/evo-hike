import { TrophyIcon, MountainsIcon } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';

interface UserStats {
    totalDistance: string;
    elevationGain: string;
    hikesCompleted: number;
}

interface UserProfile {
    name: string;
    level: string;
    avatar: string;
    stats: UserStats;
}

interface ProfileHeaderProps {
    user: UserProfile;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const { t } = useTranslation();

    return (
        <Card
            variant="solid"
            className="flex flex-col md:flex-row items-center gap-6 p-8 relative overflow-hidden bg-linear-to-br from-brand-card to-brand-dark">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <MountainsIcon size={400} />
            </div>

            <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-linear-to-tr from-brand-accent to-blue-500">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border-4 border-brand-dark"
                    />
                </div>
                <div className="absolute bottom-0 right-0 bg-brand-dark p-2 rounded-full border border-white/10">
                    <TrophyIcon size={20} className="text-yellow-400" weight="fill" />
                </div>
            </div>

            <div className="text-center md:text-left z-10">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">{user.name}</h1>
                <p className="text-brand-accent font-semibold tracking-wide uppercase text-sm">{user.level}</p>
            </div>

            <div className="md:ml-auto grid grid-cols-3 gap-4 md:gap-12 text-center z-10">
                <div>
                    <div className="text-2xl md:text-3xl font-display font-bold text-white">
                        {user.stats.hikesCompleted}
                    </div>
                    <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                        {t('dashboard.stats.hikes')}
                    </div>
                </div>
                <div>
                    <div className="text-2xl md:text-3xl font-display font-bold text-white">
                        {user.stats.totalDistance}
                    </div>
                    <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                        {t('dashboard.stats.distance')}
                    </div>
                </div>
                <div>
                    <div className="text-2xl md:text-3xl font-display font-bold text-white">
                        {user.stats.elevationGain}
                    </div>
                    <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                        {t('dashboard.stats.elevation')}
                    </div>
                </div>
            </div>
        </Card>
    );
};
